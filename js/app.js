/* ============================================================
   CG PORTFOLIO — app.js
   渲染（data.js 驱动）+ 动效（GSAP/Lenis）+ WebGL 流光背景
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = window.matchMedia('(pointer: fine)').matches;
  const pad2 = n => String(n).padStart(2, '0');

  const PAGE = document.body.dataset.page;

  /* ============================================================
     语言：localStorage 记忆 → 浏览器语言探测 → 默认英文
     ============================================================ */
  let LANG;
  try {
    LANG = localStorage.getItem('lang')
      || ((navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en');
  } catch (e) { LANG = 'en'; }
  if (LANG !== 'zh' && LANG !== 'en') LANG = 'en';
  const I = () => I18N[LANG];
  /* 取值：{en,zh} 对象按当前语言取，普通字符串原样返回 */
  const t = v => (v && typeof v === 'object' && (v.en || v.zh)) ? (v[LANG] || v.en) : v;

  function setLang(lang) {
    if (lang === LANG) return;
    LANG = lang;
    try {
      localStorage.setItem('lang', lang);
      sessionStorage.setItem('lang-switched', '1');   // 重载后跳过 preloader
    } catch (e) {}
    location.reload();
  }

  function initLangSwitch() {
    $$('.lang-switch__btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.lang === LANG);
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
    document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : 'en';
    document.body.setAttribute('data-lang', LANG);
  }

  /* ============================================================
     WebGL — 流光背景（玻璃光感，无 glitch）
     ============================================================ */
  class AuraFlow {
    constructor(canvas, opts) {
      this.canvas = canvas;
      this.o = Object.assign({
        hue: 'blue',       // blue | gold | cyan
        speed: 1.0,
        mouse: false,
        opacity: 1,
      }, opts || {});
      this.mouseX = .5; this.mouseY = .45;
      this.tx = .5; this.ty = .45;
      this.gl = canvas.getContext('webgl', { alpha: true, antialias: false });
      if (!this.gl) return;              // WebGL 不可用 → CSS 背景兜底
      this._build();
      this._resize();
      this._events();
      if (REDUCED) { this._draw(0); }    // 只画一帧
      else this._loop = (t) => { this._draw(t); this._raf = requestAnimationFrame(this._loop); };
      if (!REDUCED) this._raf = requestAnimationFrame(this._loop);
    }
    _build() {
      const gl = this.gl;
      const PALETTES = {
        blue: ['vec3(.020,.028,.050)', 'vec3(.050,.100,.190)', 'vec3(.160,.350,.550)', 'vec3(.750,.820,.880)'],
        gold: ['vec3(.024,.020,.016)', 'vec3(.080,.060,.035)', 'vec3(.300,.220,.100)', 'vec3(.850,.780,.650)'],
        cyan: ['vec3(.020,.028,.030)', 'vec3(.050,.100,.110)', 'vec3(.100,.250,.300)', 'vec3(.700,.820,.850)'],
      };
      const pal = PALETTES[this.o.hue] || PALETTES.blue;
      const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
      const fs = `
        precision highp float;
        uniform vec2 u_res; uniform float u_t; uniform vec2 u_mouse; uniform float u_speed; uniform float u_op;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
        float noise(vec2 p){
          vec2 i=floor(p), f=fract(p);
          vec2 u=f*f*(3.-2.*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                     mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
        }
        float fbm(vec2 p){
          float v=0., a=.5;
          for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.03+vec2(17.3,9.1); a*=.5; }
          return v;
        }
        void main(){
          vec2 uv=(gl_FragCoord.xy-.5*u_res)/min(u_res.x,u_res.y);
          float t=u_t*.015*u_speed;
          vec2 m=(u_mouse-.5)*.35;
          /* domain-warped flow */
          vec2 q=vec2(fbm(uv*1.4+t), fbm(uv*1.4+vec2(5.2,1.3)-t*.7));
          vec2 r=vec2(fbm(uv*1.8+3.4*q+vec2(1.7,9.2)+t*.6),
                      fbm(uv*1.8+3.4*q+vec2(8.3,2.8)-t*.4));
          float f=fbm(uv*1.6+3.2*r - m);
          vec3 c0=${pal[0]}, c1=${pal[1]}, c2=${pal[2]}, c3=${pal[3]};
          vec3 col=mix(c0,c1,clamp(f*1.6,0.,1.));
          col=mix(col,c2,clamp(length(r)*.85-.25,0.,1.));
          /* key light — 偏右上的光团，被鼠标轻微牵引 */
          vec2 lp=vec2(.42,-.28)-m*.6;
          float glow=exp(-2.6*dot(uv-lp,uv-lp));
          col+=c3*glow*.34;
          col*=1.-.42*dot(uv,uv);            /* vignette */
          float g=(hash(gl_FragCoord.xy+fract(u_t))-.5)*.028; /* grain 防 banding */
          gl_FragColor=vec4(col+g, u_op);
        }`;
      const sh = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
        return s;
      };
      const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
      if (!v || !f) { this.gl = null; return; }
      const prog = gl.createProgram();
      gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      this.u = {
        res: gl.getUniformLocation(prog, 'u_res'),
        t: gl.getUniformLocation(prog, 'u_t'),
        mouse: gl.getUniformLocation(prog, 'u_mouse'),
        speed: gl.getUniformLocation(prog, 'u_speed'),
        op: gl.getUniformLocation(prog, 'u_op'),
      };
      gl.uniform1f(this.u.speed, this.o.speed);
      gl.uniform1f(this.u.op, this.o.opacity);
    }
    _palette(P) { return `c0=${P.blue},c1=${P.blue},c2=${P.blue},c3=${P.blue};`.length && ''; }
    _events() {
      if (this.o.mouse) {
        window.addEventListener('pointermove', (e) => {
          this.tx = e.clientX / window.innerWidth;
          this.ty = 1 - e.clientY / window.innerHeight;
        }, { passive: true });
      }
      window.addEventListener('resize', () => this._resize(), { passive: true });
    }
    _resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = this.canvas.getBoundingClientRect();
      this.canvas.width = Math.max(2, Math.round(r.width * dpr));
      this.canvas.height = Math.max(2, Math.round(r.height * dpr));
      if (this.gl) this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    _draw(t) {
      const gl = this.gl; if (!gl) return;
      this.mouseX += (this.tx - this.mouseX) * .03;
      this.mouseY += (this.ty - this.mouseY) * .03;
      gl.uniform2f(this.u.res, this.canvas.width, this.canvas.height);
      gl.uniform1f(this.u.t, t * .001);
      gl.uniform2f(this.u.mouse, this.mouseX, this.mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
  /* ============================================================
     文字拆分（SplitText 替代）
     ============================================================ */
  function splitRows(el, text) {
    const words = String(text).split(/\s+/).filter(Boolean);
    el.innerHTML = words.map(w => `<span class="row"><span>${w}</span></span>`).join('');
    return $$('span.row > span', el);
  }
  /* 按预设行渲染（hero 署名用，不拆词）；多行时末行加空心描边，末行文字后接延伸细线 */
  function renderLines(el, lines) {
    const multi = lines.length > 1;
    el.innerHTML = lines.map((w, i) => {
      const outline = multi && i === lines.length - 1 ? ' class="hero-outline"' : '';
      const rule = i === lines.length - 1 ? '<span class="hero-rule" aria-hidden="true"></span>' : '';
      return `<span class="row"><span${outline}>${w}</span>${rule}</span>`;
    }).join('');
    return $$('.row > span:not(.hero-rule)', el);
  }

  /* ============================================================
     Preloader
     ============================================================ */
  function runPreloader(onDone) {
    const pre = $('#preloader'), count = $('#preloader-count'), nameEl = $('#preloader-name');
    /* 语言切换重载：跳过计数动画，快速进入页面 */
    let switched = false;
    try { switched = sessionStorage.getItem('lang-switched') === '1'; sessionStorage.removeItem('lang-switched'); } catch (e) {}
    if (REDUCED || switched) { pre.remove(); onDone(); return; }
    document.body.classList.add('is-loading');
    nameEl.textContent = SITE.name;
    /* 兜底：标签页在后台时 rAF 被冻结、GSAP 时间线停摆 —— 4s 后强制放行，回前台后动画继续 */
    let fired = false;
    const finish = () => {
      if (fired) return;
      fired = true;
      pre.classList.add('is-done');
      document.body.classList.remove('is-loading');
      onDone();
    };
    const guard = setTimeout(() => {
      if (fired) return;
      gsap.set(pre, { display: 'none' });
      finish();
    }, 4000);
    const state = { v: 0 };
    gsap.set(nameEl, { opacity: 0, y: 12 });
    const tl = gsap.timeline({
      onComplete() {
        clearTimeout(guard);
        finish();
        gsap.to(pre, {
          yPercent: -100, duration: .9, ease: 'power4.inOut', delay: .1,
          onComplete: () => pre.remove(),
        });
      },
    });
    tl.to(nameEl, { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, 0)
      .to(state, {
        v: 100, duration: 1.5, ease: 'power2.inOut',
        onUpdate: () => { count.textContent = pad2(Math.round(state.v)); },
      }, .15)
      .to([count, nameEl], { opacity: 0, duration: .35, ease: 'power1.in' }, '-=.1');
  }

  /* ============================================================
     通用：光标 / 菜单 / 页脚 / 磁性按钮 / 滚动
     ============================================================ */
  let lenis = null;
  function initScroll() {
    if (REDUCED || typeof Lenis === 'undefined') return;
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function initCursor() {
    if (!FINE || REDUCED) return;
    const dot = $('#cursor-dot'), ring = $('#cursor-ring');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, shown = false;
    window.addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; document.body.classList.add('cursor-ready'); gsap.to([dot, ring], { opacity: 1, duration: .3 }); }
    }, { passive: true });
    gsap.ticker.add(() => {
      rx += (x - rx) * .16; ry += (y - ry) * .16;
      dot.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      const half = ring.offsetWidth / 2;
      ring.style.transform = `translate(${rx - half}px, ${ry - half}px)`;
    });
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('[data-cursor="hover"], a, button')) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('[data-cursor="hover"], a, button')) ring.classList.remove('is-hover');
    });
  }

  function initMenu() {
    const burger = $('#nav-burger'), menu = $('#menu');
    if (!burger || !menu) return;
    let open = false, animating = false;
    const links = $$('.menu__link', menu);
    gsap.set(links, { y: 60, opacity: 0 });
    burger.addEventListener('click', () => {
      if (animating) return;
      animating = true; open = !open;
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      if (open) {
        menu.style.visibility = 'visible';
        gsap.to(menu, { clipPath: 'inset(0% 0 0% 0)', duration: .8, ease: 'power4.inOut' });
        gsap.to(links, { y: 0, opacity: 1, duration: .7, stagger: .07, delay: .25, ease: 'power3.out',
          onComplete: () => { animating = false; } });
        if (lenis) lenis.stop();
      } else {
        gsap.to(links, { y: 40, opacity: 0, duration: .3, stagger: .03, ease: 'power1.in' });
        gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .7, ease: 'power4.inOut', delay: .15,
          onComplete: () => { menu.style.visibility = 'hidden'; animating = false; } });
        if (lenis) lenis.start();
      }
    });
    $$('#menu a').forEach(a => a.addEventListener('click', () => burger.click()));
  }

  function initFooter() {
    const L = I();
    $('#footer-email').href = 'mailto:' + SITE.email;
    $('#footer-email').innerHTML = L.footerCta;
    $('#footer-kicker').textContent = L.footerKicker;
    $('#footer-year').textContent = new Date().getFullYear();
    $('#footer-name').textContent = SITE.name + ' — ' + L.rights;
    const soc = $('#footer-socials');
    soc.innerHTML = SITE.socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener" data-cursor="hover">${s.label}</a>`).join('');
    const timeEl = $('#footer-time');
    const tick = () => {
      const d = new Date();
      timeEl.textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())} GMT${d.getTimezoneOffset() <= 0 ? '+' : '-'}${Math.abs(d.getTimezoneOffset() / 60)}`;
    };
    tick(); setInterval(tick, 10000);
    /* menu foot */
    const mf = $('#menu-foot');
    if (mf) mf.innerHTML = `<span>${SITE.email}</span><span>${t(SITE.location)}</span>`;
  }

  function initMagnetic() {
    if (!FINE || REDUCED) return;
    $$('.btn-magnetic').forEach(btn => {
      const label = $('.btn-magnetic__label', btn) || btn;
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(btn, { x: dx * .18, y: dy * .3, duration: .5, ease: 'power3.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' });
      });
    });
  }

  function initNavText() {
    const logo = $('#nav-logo');
    if (logo) logo.textContent = SITE.name;
    /* 导航 / 菜单文案（i18n） */
    const L = I();
    const navLinks = $$('.nav__link');
    if (navLinks.length >= 3) {
      navLinks[0].textContent = L.navWork;
      navLinks[1].textContent = L.navInfo;
      navLinks[2].textContent = L.navContact;
    }
    $$('.menu__link').forEach((a, i) => {
      const labels = [L.navWork, L.navInfo, L.navContact];
      const nums = L.menuNums;
      if (labels[i]) a.innerHTML = `<span class="menu__num">${nums[i]}</span>${labels[i]}`;
    });
    const nc = $('#nav-contact'), mc = $('#menu-contact');
    if (nc) nc.href = 'mailto:' + SITE.email;
    if (mc) mc.href = 'mailto:' + SITE.email;
  }

  function initReveals(root) {
    const scope = root || document;
    /* fade-ups */
    $$('.reveal-fade', scope).forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
    /* masked lines */
    $$('.reveal-mask > span', scope).forEach(el => {
      gsap.to(el, {
        y: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: el.parentElement, start: 'top 90%' },
      });
    });
    /* hairlines */
    $$('.reveal-line', scope).forEach(el => {
      gsap.to(el, {
        scaleX: 1, duration: 1.2, ease: 'power4.inOut',
        scrollTrigger: { trigger: el, start: 'top 92%' },
      });
    });
  }

  function scrollToHash() {
    if (!location.hash) return;
    const target = $(location.hash);
    if (!target) return;
    setTimeout(() => {
      if (lenis) lenis.scrollTo(target, { offset: -20 });
      else target.scrollIntoView({ behavior: 'auto' });
    }, 1200);
  }

  /* ============================================================
     HOME 渲染
     ============================================================ */
  function renderHome() {
    const L = I();
    const featured = WORKS.filter(w => w.featured);
    const recent = WORKS.filter(w => !w.featured);

    const years = WORKS.map(w => w.year).filter((v, i, a) => a.indexOf(v) === i).sort();
    $('#hero-kicker').textContent = `${L.heroKicker} — ${years[0]} — ${Math.max(...WORKS.map(w => +w.year))}`;
    $('#hero-location').textContent = t(SITE.location);
    $('#hero-avail').textContent = L.heroAvail;
    $('.hero__foot-scroll').innerHTML = `${L.heroScroll}<span class="hero__scroll-line"></span>`;
    $('#featured-label').textContent = L.featuredLabel;
    $('#featured-count').textContent = `${pad2(featured.length)} ${L.projectsSuffix}`;
    $('#recent-label').textContent = L.recentLabel;
    $('#recent-count').textContent = `${pad2(recent.length)} ${L.projectsSuffix}`;
    $('#about-text').innerHTML = L.aboutText;
    $('.btn-magnetic__label').textContent = L.moreAbout;

    /* featured cards */
    $('#featured-list').innerHTML = featured.map((w, i) => `
      <a class="featured-card" href="work.html?w=${w.id}" data-cursor="hover" data-video="${w.film.src}">
        <div class="featured-card__media reveal-fade">
          <img src="${w.poster}" alt="${w.title}" loading="lazy">
          <video muted loop playsinline preload="none" src="${w.film.src}"></video>
          <span class="featured-card__play">View</span>
        </div>
        <div class="featured-card__row reveal-fade">
          <h3 class="featured-card__title">${w.title}</h3>
          <span class="featured-card__cat">${t(w.category)}</span>
        </div>
        <div class="featured-card__meta reveal-fade">
          <span>${pad2(i + 1)}</span><span>${w.year}</span><span>${t(w.role)}</span>
        </div>
      </a>`).join('');

    /* recent rows */
    $('#recent-list').innerHTML = recent.map((w, i) => `
      <a class="work-row" href="work.html?w=${w.id}" data-cursor="hover" data-poster="${w.poster}" data-video="${w.film.src}">
        <span class="work-row__num">${pad2(featured.length + i + 1)}</span>
        <h3 class="work-row__title">${w.title}</h3>
        <span class="work-row__cat">${t(w.category)}</span>
        <span class="work-row__year">${w.year}</span>
        <span class="work-row__arrow">→</span>
      </a>`).join('');

    /* hero text */
    const heroTitle = $('#hero-title');
    heroTitle.setAttribute('aria-label', SITE.name);
    renderLines(heroTitle, t(SITE.nameLines));
    $('#hero-role').textContent = t(SITE.role);
  }

  function initHomeFx() {
    /* hero canvas */
    new AuraFlow($('#hero-canvas'), { hue: 'blue', speed: 1, mouse: true });
    const fc = $('#footer-canvas');
    if (fc) new AuraFlow(fc, { hue: 'blue', speed: .6, opacity: .5 });

    /* hero entrance */
    const rows = $$('#hero-title .row > span');
    const intro = gsap.timeline({ delay: REDUCED ? 0 : .15 });
    intro.to('#hero-kicker', { y: 0, duration: 1, ease: 'power3.out' }, .05)
      .to(rows, { y: 0, duration: 1.3, stagger: .09, ease: 'power4.out' }, .15)
      .fromTo('.hero-rule', { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power4.inOut' }, '-=.7')
      .to('#hero-role', { y: 0, duration: 1, ease: 'power3.out' }, '-=.9')
      .fromTo('.hero__foot', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=.6');

    /* featured card hover → video */
    $$('.featured-card').forEach(card => {
      const v = $('video', card);
      if (!v) return;
      card.addEventListener('mouseenter', () => {
        if (!v.readyState) v.load();
        v.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => { v.pause(); });
    });

    /* recent rows → floating preview */
    const prev = $('#work-preview'), pimg = $('#work-preview-img'), pvid = $('#work-preview-video');
    const list = $('#recent-list');
    if (prev && FINE && !REDUCED) {
      let px = 0, py = 0, tx2 = 0, ty2 = 0, active = false, rafOn = false;
      const loop = () => {
        px += (tx2 - px) * .12; py += (ty2 - py) * .12;
        prev.style.left = px + 'px'; prev.style.top = py + 'px';
        if (active || Math.abs(tx2 - px) > .5) requestAnimationFrame(loop);
        else rafOn = false;
      };
      list.addEventListener('mousemove', (e) => {
        tx2 = e.clientX; ty2 = e.clientY;
        if (!rafOn) { rafOn = true; requestAnimationFrame(loop); }
      });
      $$('.work-row', list).forEach(row => {
        row.addEventListener('mouseenter', () => {
          active = true;
          pimg.src = row.dataset.poster;
          prev.classList.remove('is-media-ready');
          pvid.src = row.dataset.video;
          pvid.play().then(() => prev.classList.add('is-media-ready')).catch(() => {});
          gsap.to(prev, { opacity: 1, scale: 1, rotate: 0, duration: .55, ease: 'power3.out' });
        });
        row.addEventListener('mouseleave', () => {
          active = false;
          gsap.to(prev, { opacity: 0, scale: .85, rotate: -2, duration: .4, ease: 'power2.in' });
          setTimeout(() => { if (!active) pvid.pause(); }, 400);
        });
      });
    }

    /* section reveals */
    initReveals(document);
    /* 行列表：先隐藏，再批量入场 */
    gsap.set('.work-row', { opacity: 0, y: 30 });
    ScrollTrigger.batch('.work-row', {
      start: 'top 92%',
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: .9, stagger: .07, ease: 'power3.out' }),
    });
  }

  /* ============================================================
     WORK PAGE 渲染
     ============================================================ */
  function renderWork() {
    const L = I();
    const id = new URLSearchParams(location.search).get('w');
    const idx = Math.max(0, WORKS.findIndex(w => w.id === id));
    const w = WORKS[idx];
    const prev = WORKS[(idx - 1 + WORKS.length) % WORKS.length];
    const next = WORKS[(idx + 1) % WORKS.length];

    document.title = `${w.title} — ${SITE.name}`;

    const titleRows = w.title.split(/\s+/)
      .map(tt => `<span class="row"><span>${tt}</span></span>`).join('');

    const chapters = w.process.map((c, i) => `
      <div class="wp-chapter ${i % 2 ? 'wp-chapter--flip' : ''}">
        <div class="wp-chapter__head">
          <span class="wp-chapter__num">${L.chapter} ${pad2(i + 1)}</span>
          <h3 class="wp-chapter__title reveal-mask"><span>${t(c.title)}</span></h3>
        </div>
        <div class="wp-chapter__grid">
          <p class="wp-chapter__text reveal-fade">${t(c.text)}</p>
          <div class="wp-chapter__media"><img src="${c.image}" alt="${t(c.title)}" loading="lazy"></div>
        </div>
      </div>`).join('');

    $('#workpage').innerHTML = `
      <section class="wp-hero">
        <p class="wp-hero__cat label">${t(w.category)} — ${w.year}</p>
        <h1 class="wp-hero__title">${titleRows}</h1>
      </section>

      <div class="wp-meta reveal-fade">
        <div class="wp-meta__item"><span class="wp-meta__label">${L.metaYear}</span><span class="wp-meta__value">${w.year}</span></div>
        <div class="wp-meta__item"><span class="wp-meta__label">${L.metaCategory}</span><span class="wp-meta__value">${t(w.category)}</span></div>
        <div class="wp-meta__item"><span class="wp-meta__label">${L.metaRole}</span><span class="wp-meta__value">${t(w.role)}</span></div>
        <div class="wp-meta__item"><span class="wp-meta__label">${L.metaClient}</span><span class="wp-meta__value">${t(w.client)}</span></div>
      </div>

      <section class="wp-synopsis">
        <div class="wp-section-head"><span class="wp-section-head__label">${L.secSynopsis}</span><span class="wp-section-head__line reveal-line"></span></div>
        <p class="wp-synopsis__text reveal-fade">${t(w.synopsis)}</p>
      </section>

      <section class="wp-film">
        <div class="wp-section-head"><span class="wp-section-head__label">${L.secFilm}</span><span class="wp-section-head__line reveal-line"></span></div>
        <div class="wp-film__frame" id="film-frame">
          <video id="film-video" muted loop playsinline preload="metadata" poster="${w.film.poster}" src="${w.film.src}"></video>
          <img class="wp-film__poster" src="${w.film.poster}" alt="">
          <button class="wp-film__coverbtn" id="film-play" aria-label="${L.play}" data-cursor="hover">
            <span class="wp-film__coverbtn-label">${L.play}</span>
          </button>
        </div>
        <p class="wp-film__caption reveal-fade">${w.title} — ${w.year} · ${t(w.category)}</p>
      </section>

      <section class="wp-process">
        <div class="wp-section-head"><span class="wp-section-head__label">${L.secProcess}</span><span class="wp-section-head__line reveal-line"></span></div>
        ${chapters}
      </section>

      ${w.quote ? `
      <section class="wp-quote">
        <p class="wp-quote__text reveal-fade">${t(w.quote)}</p>
      </section>` : ''}

      <section class="wp-credits">
        <div class="wp-section-head"><span class="wp-section-head__label">${L.secCredits}</span><span class="wp-section-head__line reveal-line"></span></div>
        <div class="wp-credits__grid">
          ${w.credits.map(c => `
            <div class="wp-credits__row reveal-fade">
              <span class="wp-credits__role">${t(c.role)}</span>
              <span class="wp-credits__name">${t(c.name)}</span>
            </div>`).join('')}
        </div>
      </section>

      <nav class="wp-pn" aria-label="Project navigation">
        <a class="wp-pn__link" href="work.html?w=${prev.id}" data-cursor="hover">
          <span class="wp-pn__dir">← ${L.prev}</span>
          <span class="wp-pn__title">${prev.title}</span>
        </a>
        <a class="wp-pn__link wp-pn__link--next" href="work.html?w=${next.id}" data-cursor="hover">
          <span class="wp-pn__dir">${L.next} →</span>
          <span class="wp-pn__title">${next.title}</span>
        </a>
      </nav>
    `;

    /* film interaction */
    const frame = $('#film-frame'), video = $('#film-video'), play = $('#film-play');
    play.addEventListener('click', () => {
      frame.classList.add('is-playing');
      video.currentTime = 0;
      video.muted = false;
      video.play().catch(() => { video.muted = true; video.play().catch(() => {}); });
    });
    frame.addEventListener('click', (e) => {
      if (!frame.classList.contains('is-playing') || e.target.closest('.wp-film__coverbtn')) return;
      frame.classList.remove('is-playing');
      video.pause();
    });

    /* hero entrance */
    const rows = $$('.wp-hero__title .row > span');
    const intro = gsap.timeline({ delay: REDUCED ? 0 : .15 });
    intro.fromTo('.wp-hero__cat', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, .05)
      .to(rows, { y: 0, duration: 1.3, stagger: .1, ease: 'power4.out' }, .15);

    initReveals(document);
    /* chapter media slow-zoom release */
    $$('.wp-chapter__media').forEach(m => {
      ScrollTrigger.create({
        trigger: m, start: 'top 82%',
        once: true, onEnter: () => m.classList.add('is-inview'),
      });
    });
  }

  /* ============================================================
     INFO PAGE 渲染
     ============================================================ */
  function renderInfo() {
    const L = I();
    document.title = `${L.navInfo} — ${SITE.name}`;
    $('#infopage').innerHTML = `
      <section class="info-intro">
        <p class="label reveal-fade" style="margin-bottom:1.5rem">${L.aboutLabel}</p>
        <h1 class="info-intro__text">${t(INFO.intro)}</h1>
      </section>

      <section class="info-block">
        <div class="info-block__head"><span class="label">${L.capabilitiesLabel}</span><span class="wp-section-head__line reveal-line" style="flex:1"></span></div>
        ${INFO.capabilities.map(c => `
          <div class="info-cap__row reveal-fade">
            <span class="info-cap__num">${c.label}</span>
            <h3 class="info-cap__name">${t(c.name)}</h3>
            <p class="info-cap__detail">${t(c.detail)}</p>
          </div>`).join('')}
      </section>

      <section class="info-block">
        <div class="info-block__head"><span class="label">${L.experienceLabel}</span><span class="wp-section-head__line reveal-line" style="flex:1"></span></div>
        ${INFO.experience.map(e => `
          <div class="info-list__row reveal-fade">
            <span class="info-list__year">${e.year}</span>
            <span class="info-list__what">${t(e.what)}</span>
            <span class="info-list__where">${t(e.where)}</span>
          </div>`).join('')}
      </section>

      <section class="info-block">
        <div class="info-block__head"><span class="label">${L.recognitionLabel}</span><span class="wp-section-head__line reveal-line" style="flex:1"></span></div>
        ${INFO.recognition.map(e => `
          <div class="info-list__row reveal-fade">
            <span class="info-list__year">${e.year}</span>
            <span class="info-list__what">${t(e.what)}</span>
            <span class="info-list__where"></span>
          </div>`).join('')}
      </section>
    `;
    initReveals(document);
  }

  /* ============================================================
     BOOT
     ============================================================ */
  gsap.registerPlugin(ScrollTrigger);
  document.title = `${SITE.name} — ${t(SITE.role)}`;
  initLangSwitch();
  initNavText();
  initFooter();

  runPreloader(() => {
    initScroll();
    initCursor();
    initMenu();
    initMagnetic();

    if (PAGE === 'home') { renderHome(); initHomeFx(); }
    else if (PAGE === 'work') { renderWork(); }
    else if (PAGE === 'info') { renderInfo(); }

    /* hero 标题行预置（preloader 期间隐藏在 mask 里） */
    ScrollTrigger.refresh();
    scrollToHash();
    /* 字体/图片加载完成后重算 */
    window.addEventListener('load', () => ScrollTrigger.refresh());
  });
})();
