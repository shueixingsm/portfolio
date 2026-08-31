/* ============================================================
   CG PORTFOLIO — app.js
   渲染（data.js 驱动）+ 动效（GSAP/Lenis）+ WebGL 流光 + 灯箱
   页面：home / work（案例+旗舰）/ discipline（方向页）/ about
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
     语言
     ============================================================ */
  let LANG;
  try {
    LANG = localStorage.getItem('lang')
      || ((navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en');
  } catch (e) { LANG = 'en'; }
  if (LANG !== 'zh' && LANG !== 'en') LANG = 'en';
  const I = () => I18N[LANG];
  const t = v => (v && typeof v === 'object' && (v.en || v.zh)) ? (v[LANG] || v.en) : v;

  function setLang(lang) {
    if (lang === LANG) return;
    LANG = lang;
    try {
      localStorage.setItem('lang', lang);
      sessionStorage.setItem('lang-switched', '1');
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
     WebGL — 流光背景
     ============================================================ */
  class AuraFlow {
    constructor(canvas, opts) {
      this.canvas = canvas;
      this.o = Object.assign({ hue: 'blue', speed: 1.0, mouse: false, opacity: 1 }, opts || {});
      this.mouseX = .5; this.mouseY = .45;
      this.tx = .5; this.ty = .45;
      this.gl = canvas.getContext('webgl', { alpha: true, antialias: false });
      if (!this.gl) return;
      this._build();
      this._resize();
      this._events();
      if (REDUCED) { this._draw(0); return; }
      this._loop = (t) => { this._draw(t); this._raf = requestAnimationFrame(this._loop); };
      this._raf = requestAnimationFrame(this._loop);
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
          vec2 q=vec2(fbm(uv*1.4+t), fbm(uv*1.4+vec2(5.2,1.3)-t*.7));
          vec2 r=vec2(fbm(uv*1.8+3.4*q+vec2(1.7,9.2)+t*.6),
                      fbm(uv*1.8+3.4*q+vec2(8.3,2.8)-t*.4));
          float f=fbm(uv*1.6+3.2*r - m);
          vec3 c0=${pal[0]}, c1=${pal[1]}, c2=${pal[2]}, c3=${pal[3]};
          vec3 col=mix(c0,c1,clamp(f*1.6,0.,1.));
          col=mix(col,c2,clamp(length(r)*.85-.25,0.,1.));
          vec2 lp=vec2(.42,-.28)-m*.6;
          float glow=exp(-2.6*dot(uv-lp,uv-lp));
          col+=c3*glow*.34;
          col*=1.-.42*dot(uv,uv);
          float g=(hash(gl_FragCoord.xy+fract(u_t))-.5)*.028;
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
     文字拆行
     ============================================================ */
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
    const line = $('.preloader__line'), bar = $('#preloader-bar'), inner = $('.preloader__inner');
    let switched = false;
    try { switched = sessionStorage.getItem('lang-switched') === '1'; sessionStorage.removeItem('lang-switched'); } catch (e) {}
    if (REDUCED || switched) { pre.remove(); onDone(); return; }
    document.body.classList.add('is-loading');
    nameEl.textContent = SITE.name;
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
    gsap.set(nameEl, { opacity: 0, y: 14 });
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
    tl.to(nameEl, { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, 0)
      .to(line, { opacity: 1, duration: .6, ease: 'power1.out' }, .1)
      .to(count, { opacity: 1, duration: .5 }, .2)
      .to(state, {
        v: 100, duration: 1.6, ease: 'power2.inOut',
        onUpdate: () => {
          count.textContent = String(Math.round(state.v)).padStart(3, '0');
          gsap.set(bar, { scaleX: state.v / 100 });
        },
      }, .3)
      .to(inner, { opacity: 0, y: -14, duration: .4, ease: 'power1.in' }, '-=.05');
  }

  /* ============================================================
     通用
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
    const mf = $('#menu-foot');
    if (mf) mf.innerHTML = `<span>${SITE.email}</span><span>${t(SITE.location)}</span>`;
  }

  function initMagnetic() {
    if (!FINE || REDUCED) return;
    $$('.btn-magnetic').forEach(btn => {
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
    const L = I();
    const navLinks = $$('.nav__link');
    if (navLinks.length >= 3) {
      navLinks[0].textContent = L.navWork;
      navLinks[1].textContent = L.navAbout;
      navLinks[2].textContent = L.navContact;
    }
    $$('.menu__link').forEach((a, i) => {
      const labels = [L.navWork, L.navAbout, L.navContact];
      const nums = L.menuNums;
      if (labels[i]) a.innerHTML = `<span class="menu__num">${nums[i]}</span>${labels[i]}`;
    });
    const nc = $('#nav-contact'), mc = $('#menu-contact');
    if (nc) nc.href = 'mailto:' + SITE.email;
    if (mc) mc.href = 'mailto:' + SITE.email;
  }

  function initReveals(root) {
    const scope = root || document;
    $$('.reveal-fade', scope).forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
    $$('.reveal-mask > span', scope).forEach(el => {
      gsap.to(el, {
        y: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: el.parentElement, start: 'top 90%' },
      });
    });
    $$('.reveal-line', scope).forEach(el => {
      gsap.to(el, {
        scaleX: 1, duration: 1.2, ease: 'power4.inOut',
        scrollTrigger: { trigger: el, start: 'top 92%' },
      });
    });
  }

  /* ============================================================
     灯箱（网格条目 / 无案例页精选卡片 点击放大播放）
     ============================================================ */
  function ensureLightbox() {
    if ($('#lightbox')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="lightbox" id="lightbox" aria-hidden="true">
        <button class="lightbox__close" id="lightbox-close" aria-label="Close" data-cursor="hover">✕</button>
        <div class="lightbox__stage">
          <video id="lightbox-video" playsinline controls loop></video>
        </div>
        <div class="lightbox__cap"><span id="lb-title"></span><span id="lb-meta"></span></div>
      </div>`);
    const lb = $('#lightbox'), video = $('#lightbox-video');
    const close = () => {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      video.pause();
      if (lenis) lenis.start();
    };
    $('#lightbox-close').addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('is-open')) close(); });
  }

  function openLightbox(src, poster, title, meta) {
    ensureLightbox();
    const lb = $('#lightbox'), video = $('#lightbox-video');
    $('#lb-title').textContent = title || '';
    $('#lb-meta').textContent = meta || '';
    video.poster = poster || '';
    video.src = src;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
    video.muted = false;
    const p = video.play();
    if (p) p.catch(() => { video.muted = true; video.play().catch(() => {}); });
  }

  /* hover 播放绑定（方向页网格单元） */
  function bindHoverVideo(scope) {
    if (!FINE || REDUCED) return;
    $$('.study-cell', scope).forEach(cell => {
      const v = $('video', cell);
      if (!v) return;
      cell.addEventListener('mouseenter', () => {
        if (!v.readyState) v.load();
        v.play().catch(() => {});
      });
      cell.addEventListener('mouseleave', () => { v.pause(); });
    });
  }

  /* 首页精选卡：进入视口自动静音循环播放，滚出暂停（浏览不单调且省性能；触屏仍显示封面省流量） */
  function bindAutoplayVideo(scope) {
    if (!FINE || REDUCED || !('IntersectionObserver' in window)) return;
    const cards = $$('.selected-card', scope);
    const inView = (card) => {
      const r = card.getBoundingClientRect();
      return r.bottom > -120 && r.top < innerHeight + 120;
    };
    const kick = (card) => {
      const v = $('video', card);
      if (!v || !inView(card)) return;
      if (!v.readyState) v.load();
      const p = v.play();
      if (p) p.catch(() => {});
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        const v = $('video', en.target);
        if (!v) return;
        if (en.isIntersecting) {
          if (!v.readyState) v.load();
          const p = v.play();
          if (p) p.catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { rootMargin: '120px' });
    cards.forEach(card => io.observe(card));
    /* 标签页切走时 Chrome 会暂停后台视频；回来后重新拉起在视野内的播放 */
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') cards.forEach(kick);
    });
  }

  /* 无案例页条目：点击 → 灯箱 */
  function bindLightboxLinks(scope) {
    $$('[data-lb]', scope).forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(el.dataset.lb, el.dataset.poster, el.dataset.title, el.dataset.meta);
      });
    });
  }

  /* ============================================================
     HOME
     ============================================================ */
  function renderHome() {
    const L = I();
    const selected = WORKS.filter(w => w.selected);
    const disc = id => DISCIPLINES.find(d => d.id === id);

    $('#hero-kicker').textContent = L.heroKicker;
    $('#hero-location').textContent = t(SITE.location);
    $('.hero__foot-scroll').innerHTML = `${L.heroScroll}<span class="hero__scroll-line"></span>`;
    $('#selected-label').textContent = L.selectedLabel;
    $('#selected-count').textContent = `${pad2(selected.length)} ${L.selectedSuffix}`;
    $('#explore-label').textContent = L.exploreLabel;
    $('#explore-count').textContent = pad2(DISCIPLINES.length);
    $('#about-text').innerHTML = L.aboutStrip;
    $('.btn-magnetic__label').textContent = L.moreAbout;

    /* 精选作品卡 */
    $('#selected-list').innerHTML = selected.map((w, i) => {
      const d = disc(w.discipline);
      const label = w.subtitle ? t(w.subtitle) : t(d.title);
      const href = w.case ? `work.html?w=${w.id}` : `discipline.html?d=${w.discipline}`;
      const hoverSrc = w.video ? w.video.src : (w.film ? w.film.src : w.episodes[0].src);
      const lb = w.case ? '' :
        ` data-lb="${hoverSrc}" data-poster="${w.poster}" data-title="${w.title}" data-meta="${t(w.meta || label)} · ${w.year}"`;
      return `
      <a class="selected-card${w.case ? '' : ' is-lb'}" href="${href}" data-cursor="hover"${lb}>
        <div class="selected-card__media">
          <img src="${w.poster}" alt="${w.title}" loading="lazy">
          <video muted loop playsinline preload="none" src="${hoverSrc}"></video>
          <span class="selected-card__play">${L.view}</span>
        </div>
        <div class="selected-card__row reveal-fade">
          <h3 class="selected-card__title"><span class="selected-card__num">${pad2(i + 1)}</span>${w.title}</h3>
          <span class="selected-card__cat">${label}</span>
        </div>
        <div class="selected-card__meta reveal-fade">
          <span>${t(d.title)}</span><span>${w.year}</span>
        </div>
      </a>`;
    }).join('');

    /* 方向入口 */
    $('#disc-list').innerHTML = DISCIPLINES.map(d => `
      <a class="disc-row" href="discipline.html?d=${d.id}" data-cursor="hover">
        <span class="disc-row__num">${d.num}</span>
        <span class="disc-row__title">${t(d.title)}</span>
        <span class="disc-row__note">${t(d.note)}</span>
        <span class="disc-row__arrow">→</span>
      </a>`).join('');

    /* hero 大字 */
    const heroTitle = $('#hero-title');
    heroTitle.setAttribute('aria-label', SITE.name);
    renderLines(heroTitle, t(SITE.nameLines));
    $('#hero-role').textContent = t(SITE.role);
    $('#hero-sub').textContent = t(SITE.subtitle);
  }

  function initHomeFx() {
    new AuraFlow($('#hero-canvas'), { hue: 'blue', speed: 1, mouse: true });
    const fc = $('#footer-canvas');
    if (fc) new AuraFlow(fc, { hue: 'blue', speed: .6, opacity: .5 });

    const rows = $$('#hero-title .row > span:not(.hero-rule)');
    const intro = gsap.timeline({ delay: REDUCED ? 0 : .15 });
    intro.to('#hero-kicker', { y: 0, duration: 1, ease: 'power3.out' }, .05)
      .to(rows, { y: 0, duration: 1.3, stagger: .09, ease: 'power4.out' }, .15)
      .fromTo('.hero-rule', { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power4.inOut' }, '-=.7')
      .to('#hero-role', { y: 0, duration: 1, ease: 'power3.out' }, '-=.9')
      .to('#hero-sub', { y: 0, duration: 1, ease: 'power3.out' }, '-=.85')
      .fromTo('.hero__foot', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=.6');

    bindHoverVideo(document);
    bindAutoplayVideo(document);
    bindLightboxLinks(document);

    initReveals(document);
    /* 精选大卡随滚动展开：收拢(内缩+缩小+压暗) → 全幅，scrub 跟手 */
    if (!REDUCED) {
      $$('.selected-card__media', document).forEach(media => {
        gsap.fromTo(media,
          { clipPath: 'inset(7% 10% 7% 10% round 2px)', scale: .95, filter: 'brightness(.7)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, filter: 'brightness(1)', ease: 'none',
            scrollTrigger: { trigger: media.parentElement, start: 'top 88%', end: 'top 32%', scrub: .5 },
          });
      });
    }
    gsap.set('.disc-row', { opacity: 0, y: 30 });
    ScrollTrigger.batch('.disc-row', {
      start: 'top 92%',
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out' }),
    });
  }

  /* ============================================================
     DISCIPLINE 方向页
     ============================================================ */
  function renderDiscipline() {
    const L = I();
    const id = new URLSearchParams(location.search).get('d') || 'aifilm';
    const d = DISCIPLINES.find(x => x.id === id) || DISCIPLINES[0];
    document.title = `${t(d.title)} — ${SITE.name}`;

    const items = WORKS.filter(w => w.discipline === d.id);
    const originals = items.filter(w => w.group === 'original');
    const experiments = items.filter(w => w.group === 'experiment');
    const others = items.filter(w => !w.group);

    /* 单元格（网格条目 / 卡片共用内部 media） */
    const cell = (w, i, lazy) => {
      const src = w.video ? w.video.src : w.film.src;
      const poster = w.video ? w.video.poster : w.film.poster;
      const href = w.case ? `work.html?w=${w.id}` : `discipline.html?d=${d.id}`;
      const lb = w.case ? '' :
        ` data-lb="${src}" data-poster="${poster}" data-title="${w.title}" data-meta="${t(w.meta)} · ${w.year}"`;
      return `
      <a class="study-cell${w.case ? '' : ' is-lb'}" href="${href}" data-cursor="hover"${lb}>
        <div class="study-cell__media">
          <img src="${poster}" alt="${w.title}" ${lazy ? 'loading="lazy"' : ''}>
          <video muted loop playsinline preload="none" src="${src}"></video>
          <span class="study-cell__play">${L.play}</span>
        </div>
        <div class="study-cell__row">
          <span class="study-cell__num">${pad2(i + 1)}</span>
          <h3 class="study-cell__title">${w.title}</h3>
        </div>
        <div class="study-cell__meta"><span>${t(w.meta)}</span><span>${w.year}</span></div>
      </a>`;
    };

    const sub = (label) => `
      <div class="wp-section-head"><span class="wp-section-head__label">${label}</span><span class="wp-section-head__line reveal-line"></span></div>`;

    let body = '';
    if (d.id === 'aifilm') {
      body = `
        ${sub(L.originals)}
        <div class="originals-list">${originals.map((w, i) => `
          <a class="original-card" href="work.html?w=${w.id}" data-cursor="hover">
            <div class="original-card__media reveal-fade">
              <img src="${w.poster}" alt="${w.title}">
              <video muted loop playsinline preload="none" src="${w.film ? w.film.src : w.episodes[0].src}"></video>
            </div>
            <div class="original-card__row reveal-fade">
              <h3 class="original-card__title">${w.title}</h3>
              <span class="original-card__sub">${t(w.subtitle)}</span>
            </div>
          </a>`).join('')}
        </div>
        ${sub(L.experiments)}
        <div class="studies-grid">${experiments.map((w, i) => cell(w, i, true)).join('')}</div>`;
    } else if (d.id === 'rtvfx') {
      body = `${sub(d.id === 'rtvfx' ? 'VFX Studies' : '')}
        <div class="studies-grid">${others.map((w, i) => cell(w, i, true)).join('')}</div>`;
    } else {
      body = `<div class="studies-grid cin-grid">${others.map((w, i) => cell(w, i, true)).join('')}</div>`;
    }

    $('#discipline-page').innerHTML = `
      <section class="dp-hero">
        <p class="dp-hero__cat label reveal-fade">${d.num} — ${t(d.note)}</p>
        <h1 class="dp-hero__title" id="dp-title"></h1>
        <p class="dp-hero__desc reveal-fade">${t(d.desc)}</p>
      </section>
      <section class="dp-body">${body}</section>
    `;

    const titleRows = t(d.title).split(/\s+/).map(w => `<span class="row"><span>${w}</span></span>`).join('');
    $('#dp-title').innerHTML = titleRows;
    const rows = $$('#dp-title .row > span');
    gsap.timeline({ delay: REDUCED ? 0 : .15 })
      .fromTo('.dp-hero__cat', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, .05)
      .to(rows, { y: 0, duration: 1.2, stagger: .08, ease: 'power4.out' }, .15);

    bindHoverVideo(document);
    bindLightboxLinks(document);
    initReveals(document);
    /* 原创大卡 hover 播放 */
    if (FINE && !REDUCED) {
      $$('.original-card').forEach(card => {
        const v = $('video', card);
        if (!v) return;
        card.addEventListener('mouseenter', () => { if (!v.readyState) v.load(); v.play().catch(() => {}); });
        card.addEventListener('mouseleave', () => { v.pause(); });
      });
    }
  }

  /* ============================================================
     WORK 案例页（旗舰 / 普通）
     ============================================================ */
  function filmFrame(src, poster, label) {
    const L = I();
    return `
      <div class="wp-film__frame">
        <video muted loop playsinline preload="metadata" poster="${poster}" src="${src}"></video>
        <img class="wp-film__poster" src="${poster}" alt="">
        <button class="wp-film__coverbtn" aria-label="${L.play}" data-cursor="hover">
          <span class="wp-film__coverbtn-label">${L.play}</span>
        </button>
      </div>`;
  }

  function bindFilmFrames(scope) {
    $$('.wp-film__frame', scope).forEach(frame => {
      const video = $('video', frame);
      const btn = $('.wp-film__coverbtn', frame);
      btn.addEventListener('click', () => {
        frame.classList.add('is-playing');
        video.currentTime = 0;
        video.muted = false;
        const p = video.play();
        if (p) p.catch(() => { video.muted = true; video.play().catch(() => {}); });
      });
      frame.addEventListener('click', (e) => {
        if (!frame.classList.contains('is-playing') || e.target.closest('.wp-film__coverbtn')) return;
        frame.classList.remove('is-playing');
        video.pause();
      });
    });
  }

  function renderWork() {
    const L = I();
    const caseWorks = WORKS.filter(w => w.case);
    const id = new URLSearchParams(location.search).get('w');
    const idx = Math.max(0, caseWorks.findIndex(w => w.id === id));
    const w = caseWorks[idx];
    const prev = caseWorks[(idx - 1 + caseWorks.length) % caseWorks.length];
    const next = caseWorks[(idx + 1) % caseWorks.length];

    document.title = `${w.title} — ${SITE.name}`;
    const titleRows = w.title.split(/\s+/).map(tt => `<span class="row"><span>${tt}</span></span>`).join('');
    const d = DISCIPLINES.find(x => x.id === w.discipline);

    let main = '';
    if (w.flagship) {
      /* ---- 旗舰：FILM / CONCEPT / VISUAL DEV / PROCESS / CREDITS ---- */
      main = `
        <section class="wp-hero">
          <p class="wp-hero__cat label">${t(w.subtitle)}</p>
          <h1 class="wp-hero__title">${titleRows}</h1>
        </section>

        <div class="wp-meta reveal-fade">
          <div class="wp-meta__item"><span class="wp-meta__label">${L.metaYear}</span><span class="wp-meta__value">${w.year}</span></div>
          <div class="wp-meta__item"><span class="wp-meta__label">${L.metaCategory}</span><span class="wp-meta__value">${t(w.subtitle)}</span></div>
          <div class="wp-meta__item"><span class="wp-meta__label">${t(d.title)}</span><span class="wp-meta__value">${t(d.title)}</span></div>
          <div class="wp-meta__item"><span class="wp-meta__label">${L.metaRole}</span><span class="wp-meta__value">${t(w.credits[0].role)}</span></div>
        </div>

        <section class="wp-section">
          <div class="wp-section-head"><span class="wp-section-head__label">01 — ${L.secFilm}</span><span class="wp-section-head__line reveal-line"></span></div>
          ${w.episodes.map(ep => `
            <div class="ep-block">
              <p class="ep-block__label reveal-fade">${t(ep.label)}</p>
              ${filmFrame(ep.src, ep.poster)}
            </div>`).join('')}
        </section>

        <section class="wp-section">
          <div class="wp-section-head"><span class="wp-section-head__label">02 — ${L.secConcept}</span><span class="wp-section-head__line reveal-line"></span></div>
          <div class="concept-list">
            ${w.concept.map(c => `
              <div class="concept-row reveal-fade">
                <span class="concept-row__k">${t(c.k)}</span>
                <span class="concept-row__v">${t(c.v)}</span>
              </div>`).join('')}
          </div>
        </section>

        <section class="wp-section">
          <div class="wp-section-head"><span class="wp-section-head__label">03 — ${L.secVisualDev}</span><span class="wp-section-head__line reveal-line"></span></div>
          ${w.visualdev.map((c, i) => `
            <div class="wp-chapter ${i % 2 ? 'wp-chapter--flip' : ''}">
              <div class="wp-chapter__head">
                <span class="wp-chapter__num">${pad2(i + 1)}</span>
                <h3 class="wp-chapter__title reveal-mask"><span>${t(c.title)}</span></h3>
              </div>
              <div class="wp-chapter__grid">
                <p class="wp-chapter__text reveal-fade">${t(c.text)}</p>
                <div class="wp-chapter__media"><img src="${c.image}" alt="${t(c.title)}" loading="lazy"></div>
              </div>
            </div>`).join('')}
        </section>

        <section class="wp-section">
          <div class="wp-section-head"><span class="wp-section-head__label">04 — ${L.secProcess}</span><span class="wp-section-head__line reveal-line"></span></div>
          <div class="process-list">
            ${w.process.map((p, i) => `
              <div class="process-row reveal-fade">
                <span class="process-row__num">${pad2(i + 1)}</span>
                <h3 class="process-row__title">${t(p.title)}</h3>
                <p class="process-row__text">${t(p.text)}</p>
              </div>`).join('')}
          </div>
        </section>

        ${w.quote ? `
        <section class="wp-quote">
          <p class="wp-quote__text reveal-fade">${t(w.quote)}</p>
        </section>` : ''}

        <section class="wp-section">
          <div class="wp-section-head"><span class="wp-section-head__label">05 — ${L.secCredits}</span><span class="wp-section-head__line reveal-line"></span></div>
          <div class="wp-credits__grid">
            ${w.credits.map(c => `
              <div class="wp-credits__row reveal-fade">
                <span class="wp-credits__role">${t(c.role)}</span>
                <span class="wp-credits__name">${t(c.name)}</span>
              </div>`).join('')}
          </div>
        </section>`;
    } else {
      /* ---- 普通案例 ---- */
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
      main = `
        <section class="wp-hero">
          <p class="wp-hero__cat label">${t(d.title)} — ${w.year}</p>
          <h1 class="wp-hero__title">${titleRows}</h1>
        </section>

        <div class="wp-meta reveal-fade">
          <div class="wp-meta__item"><span class="wp-meta__label">${L.metaYear}</span><span class="wp-meta__value">${w.year}</span></div>
          <div class="wp-meta__item"><span class="wp-meta__label">${L.metaCategory}</span><span class="wp-meta__value">${t(d.title)}</span></div>
          <div class="wp-meta__item"><span class="wp-meta__label">${L.metaRole}</span><span class="wp-meta__value">${t(w.meta)}</span></div>
        </div>

        <section class="wp-synopsis">
          <div class="wp-section-head"><span class="wp-section-head__label">${L.secSynopsis}</span><span class="wp-section-head__line reveal-line"></span></div>
          <p class="wp-synopsis__text reveal-fade">${t(w.synopsis)}</p>
        </section>

        <section class="wp-film">
          <div class="wp-section-head"><span class="wp-section-head__label">${L.secFilm}</span><span class="wp-section-head__line reveal-line"></span></div>
          ${filmFrame(w.film.src, w.film.poster)}
          <p class="wp-film__caption reveal-fade">${w.title} — ${w.year} · ${t(w.meta)}</p>
        </section>

        <section class="wp-process">
          <div class="wp-section-head"><span class="wp-section-head__label">${L.secProcess}</span><span class="wp-section-head__line reveal-line"></span></div>
          ${chapters}
        </section>

        <section class="wp-section">
          <div class="wp-section-head"><span class="wp-section-head__label">${L.secCredits}</span><span class="wp-section-head__line reveal-line"></span></div>
          <div class="wp-credits__grid">
            ${w.credits.map(c => `
              <div class="wp-credits__row reveal-fade">
                <span class="wp-credits__role">${t(c.role)}</span>
                <span class="wp-credits__name">${t(c.name)}</span>
              </div>`).join('')}
          </div>
        </section>`;
    }

    $('#workpage').innerHTML = main + `
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

    const rows = $$('.wp-hero__title .row > span');
    gsap.timeline({ delay: REDUCED ? 0 : .15 })
      .fromTo('.wp-hero__cat', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, .05)
      .to(rows, { y: 0, duration: 1.3, stagger: .1, ease: 'power4.out' }, .15);

    bindFilmFrames(document);
    initReveals(document);
    $$('.wp-chapter__media').forEach(m => {
      ScrollTrigger.create({
        trigger: m, start: 'top 82%',
        once: true, onEnter: () => m.classList.add('is-inview'),
      });
    });
  }

  /* ============================================================
     ABOUT
     ============================================================ */
  function renderAbout() {
    const L = I();
    document.title = `${L.navAbout} — ${SITE.name}`;
    $('#about-page').innerHTML = `
      <section class="info-intro">
        <p class="label reveal-fade" style="margin-bottom:1.5rem">${L.aboutLabel}</p>
        <h1 class="info-intro__text">${t(INFO.intro)}</h1>
      </section>

      <section class="info-block">
        <div class="info-block__head"><span class="label">${L.disciplinesLabel}</span><span class="wp-section-head__line reveal-line" style="flex:1"></span></div>
        ${INFO.disciplines.map(c => `
          <div class="info-cap__row reveal-fade">
            <span class="info-cap__num">${c.label}</span>
            <h3 class="info-cap__name">${t(c.name)}</h3>
            <p class="info-cap__detail">${t(c.detail)}</p>
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
    else if (PAGE === 'discipline') { renderDiscipline(); }
    else if (PAGE === 'about') { renderAbout(); }

    ScrollTrigger.refresh();
    if (location.hash) {
      const target = $(location.hash);
      if (target) setTimeout(() => {
        if (lenis) lenis.scrollTo(target, { offset: -20 });
        else target.scrollIntoView({ behavior: 'auto' });
      }, 1200);
    }
    window.addEventListener('load', () => ScrollTrigger.refresh());
  });
})();
