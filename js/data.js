/* ============================================================
   SITE DATA — 改这个文件就能换掉全站内容（中英双语）
   · SITE        ：身份 / 邮箱 / 社交 / 署名行
   · I18N        ：界面文案字典
   · WORKS       ：全部作品（含旗舰案例 / 网格条目 / 普通案例）
   · DISCIPLINES ：三大方向（首页入口 + 方向页）
   · INFO        ：About 页
   字段格式：{ en:"English", zh:"中文" }；双语共用的写普通字符串
   作品三种形态：
   · flagship:true        旗舰案例（分集 + 概念 + 视觉开发 + 过程 + 名单）
   · case:true            普通案例（点击进 work.html 案例页）
   · case:false           网格条目（点击放大播放，不做案例页）
   详见《使用说明.md》
   ============================================================ */

const SITE = {
  name: "Xianglin Qu",                  // 导航 / 页脚 / 版权（拉丁拼写在两种语言下通用）
  nameLines: {                          // Hero 大字
    en: ["XIANG LIN", "QU"],            // 英文两行：末行空心描边 + 延伸细线
    zh: ["曲相霖"],                      // 中文单行大字 + 延伸细线
  },
  role: { en: "VISUAL ARTIST", zh: "视觉艺术家" },
  subtitle: { en: "CG · REAL-TIME VFX · AI FILMMAKING", zh: "CG · 实时视效 · AI 影像创作" },
  email: "hello@yourname.com",          // ← 你的邮箱
  location: { en: "SHANGHAI / CHINA", zh: "中国 · 上海" },
  socials: [
    { label: "ArtStation", url: "https://www.artstation.com/" },
    { label: "Instagram",  url: "https://www.instagram.com/" },
    { label: "Behance",    url: "https://www.behance.net/" },
    { label: "Vimeo",      url: "https://vimeo.com/" },
  ],
};

/* ---------- 界面文案字典 ---------- */
const I18N = {
  en: {
    navWork: "Work", navAbout: "About", navContact: "Contact",
    menuNums: ["01", "02", "03"],
    heroKicker: "Selected Works 2022—2026", heroScroll: "Scroll",
    selectedLabel: "Selected Works", selectedSuffix: "Works",
    exploreLabel: "Explore by Discipline",
    aboutStrip: 'Making images that behave like <em>light</em> — real-time films, simulation and AI-driven motion.',
    moreAbout: "About me",
    footerKicker: "Contact", footerCta: `Let's <em>talk</em>`,
    socialsLabel: "Socials", timeLabel: "Local time", rights: "All rights reserved",
    prev: "Previous", next: "Next", chapter: "Ch.",
    secSynopsis: "Synopsis", secFilm: "The Film", secProcess: "Process", secCredits: "Credits",
    secConcept: "Concept", secVisualDev: "Visual Development",
    episode: "Episode", play: "Play", view: "View",
    originals: "Original Works", experiments: "Experiments",
    aboutLabel: "About", disciplinesLabel: "Disciplines", recognitionLabel: "Recognition",
    metaYear: "Year", metaCategory: "Category", metaRole: "Role", metaClient: "Client",
  },
  zh: {
    navWork: "作品", navAbout: "关于", navContact: "联系",
    menuNums: ["01", "02", "03"],
    heroKicker: "精选作品 2022—2026", heroScroll: "滚动",
    selectedLabel: "精选作品", selectedSuffix: "部",
    exploreLabel: "按方向浏览",
    aboutStrip: '制作像<em>光</em>一样行事的影像——实时影片、解算与 AI 驱动的动态。',
    moreAbout: "关于我",
    footerKicker: "联系", footerCta: `保持<em>联系</em>`,
    socialsLabel: "社交", timeLabel: "当地时间", rights: "版权所有",
    prev: "上一个", next: "下一个", chapter: "第",
    secSynopsis: "梗概", secFilm: "影片", secProcess: "制作过程", secCredits: "职员名单",
    secConcept: "概念", secVisualDev: "视觉开发",
    episode: "第 {n} 集", play: "播放", view: "观看",
    originals: "原创作品", experiments: "实验",
    aboutLabel: "简介", disciplinesLabel: "方向", recognitionLabel: "荣誉",
    metaYear: "年份", metaCategory: "类别", metaRole: "职责", metaClient: "客户",
  },
};

/* ============================================================
   三大方向（首页入口 + 方向页）
   ============================================================ */
const DISCIPLINES = [
  {
    id: "aifilm",
    num: "01",
    title: { en: "AI FILM / AIGC", zh: "AI 影像 / AIGC" },
    desc: {
      en: "Original series and generative-image experiments — narrative pieces built with generative video models.",
      zh: "原创系列与生成影像实验——用生成式视频模型构建的叙事作品。",
    },
    note: { en: "Original Works / Experiments", zh: "原创作品 / 实验" },
  },
  {
    id: "rtvfx",
    num: "02",
    title: { en: "REAL-TIME VFX", zh: "实时视效" },
    desc: {
      en: "Real-time effects studies — fire, smoke, particles and energy, simulated and rendered live.",
      zh: "实时视效研究——火焰、烟雾、粒子与能量，全部实时解算与渲染。",
    },
    note: { en: "Niagara · Houdini · FX Studies", zh: "Niagara · Houdini · FX 研究" },
  },
  {
    id: "rtcinematics",
    num: "03",
    title: { en: "REAL-TIME CINEMATICS", zh: "实时影像" },
    desc: {
      en: "Lighting, rendering and camera work inside Unreal Engine — cinematic sequences running in real time.",
      zh: "Unreal Engine 中的灯光、渲染与镜头——实时运行的电影级序列。",
    },
    note: { en: "Unreal Engine 5 · Lighting / Rendering / Sequencer", zh: "Unreal Engine 5 · 灯光 / 渲染 / Sequencer" },
  },
];

/* ============================================================
   WORKS — 全部作品
   discipline: aifilm | rtvfx | rtcinematics
   group（仅 aifilm 用）: original | experiment
   selected:true → 首页精选区（4 个）
   ============================================================ */
const WORKS = [

  /* ========== 旗舰 · 张伟的梦（原创 AI 系列） ========== */
  {
    id: "zhangweis-dream",
    title: "ZHANG WEI'S DREAM",
    subtitle: { en: "ORIGINAL AI SERIES · 2026", zh: "原创 AI 系列 · 2026" },
    year: "2026",
    discipline: "aifilm",
    group: "original",
    selected: true,
    flagship: true,
    case: true,
    poster: "assets/img/poster_01.jpg",
    /* ↓ 替换成真实的分集视频与封面（src + poster） */
    episodes: [
      { label: { en: "EPISODE 01", zh: "第 01 集" },
        src: "assets/video/film_blue.mp4", poster: "assets/img/poster_01.jpg" },
      { label: { en: "EPISODE 02", zh: "第 02 集" },
        src: "assets/video/film_cyan.mp4", poster: "assets/img/poster_05.jpg" },
    ],
    concept: [
      { k: { en: "High Concept", zh: "高概念" },
        v: { en: "A man's recurring dream is the only place where time moves at the right speed.",
             zh: "一个人的循环梦境，是时间流速唯一正确的地方。" } },
      { k: { en: "World", zh: "世界观" },
        v: { en: "A rain-soaked city that rebuilds itself every night, remembered differently by everyone who sleeps.",
             zh: "一座每夜自我重建的雨城，每个睡着的人记住的版本都不相同。" } },
      { k: { en: "Story", zh: "故事" },
        v: { en: "Episode by episode, Zhang Wei stops telling the dream from the dreamer's side.",
             zh: "一集一集地，张伟不再从做梦者这一侧讲述梦。" } },
      { k: { en: "Characters", zh: "角色" },
        v: { en: "Zhang Wei — and the second person the city keeps dreaming for him.",
             zh: "张伟——以及那座城市替他一直梦着的第二个人。" } },
    ],
    visualdev: [
      { title: { en: "Character Design", zh: "角色设计" },
        text: { en: "Silhouette-first: readable in one frame, even at dream-blur focus.",
                zh: "剪影优先：在单帧内即可辨认，哪怕处于梦一样的失焦。" },
        image: "assets/img/poster_02.jpg" },
      { title: { en: "Environment Design", zh: "场景设计" },
        text: { en: "The city drawn as a set of rules, not a map — light always arrives one second late.",
                zh: "城市被画成一套规则而非地图——光总是迟到一秒。" },
        image: "assets/img/poster_07.jpg" },
      { title: { en: "Look Development", zh: "视觉开发" },
        text: { en: "Graded between sodium streetlight and monitor glow; blacks carry the dream.",
                zh: "在钠灯与屏幕辉光之间调色；黑色承载梦境。" },
        image: "assets/img/poster_04.jpg" },
    ],
    process: [
      { title: { en: "Script", zh: "剧本" },
        text: { en: "Twelve pages for two episodes. The dream obeys one written rule: never explain.",
                zh: "两集共十二页。梦境只守一条成文规则：永不解释。" } },
      { title: { en: "Storyboard", zh: "分镜" },
        text: { en: "Every shot boarded as a still first; motion is earned, never assumed.",
                zh: "每个镜头先以静帧定案；运动是被挣来的，不是想当然的。" } },
      { title: { en: "Visual Development", zh: "视觉开发" },
        text: { en: "Keyframes locked before generation — the look leads, the model follows.",
                zh: "关键帧先于生成锁定——视觉先行，模型随后。" } },
      { title: { en: "AI Generation", zh: "AI 生成" },
        text: { en: "Directed text-to-image, then image-to-video passes; curated hard, regenerated harder.",
                zh: "先执导文生图，再图生视频；严格筛选，更严格地重生成。" } },
      { title: { en: "Editing", zh: "剪辑" },
        text: { en: "Cut to breath, not beat — the dream is allowed one cut too many.",
                zh: "按呼吸剪辑而非节拍——允许梦多切一刀。" } },
      { title: { en: "Sound Design", zh: "声音设计" },
        text: { en: "Room tone from the waking world, pitched down — the city dreams in sub-bass.",
                zh: "取自清醒世界的房间底噪，降调处理——城市用次低音做梦。" } },
    ],
    credits: [
      { role: { en: "Created & Directed by", zh: "创作与导演" }, name: "Xianglin Qu" },
      { role: { en: "Visual Development / AI Filmmaking / Edit", zh: "视觉开发 / AI 影像 / 剪辑" }, name: "Xianglin Qu" },
      { role: { en: "Sound Design", zh: "声音设计" }, name: { en: "Collaborator Name", zh: "合作者姓名" } },
    ],
  },

  /* ========== REAL-TIME VFX · 网格条目（点击放大，无案例页） ========== */
  {
    id: "wormhole",
    title: "WORMHOLE",
    year: "2026",
    discipline: "rtvfx",
    selected: true,
    case: false,
    poster: "assets/img/poster_02.jpg",
    video: { src: "assets/video/film_blue.mp4", poster: "assets/img/poster_02.jpg" },
    meta: { en: "Niagara / Unreal Engine 5", zh: "Niagara / Unreal Engine 5" },
  },
  {
    id: "pyro-study",
    title: "PYRO STUDY",
    year: "2025",
    discipline: "rtvfx",
    case: false,
    poster: "assets/img/poster_03.jpg",
    video: { src: "assets/video/film_gold.mp4", poster: "assets/img/poster_03.jpg" },
    meta: { en: "Houdini / Unreal Engine", zh: "Houdini / Unreal Engine" },
  },
  {
    id: "energy-field",
    title: "ENERGY FIELD",
    year: "2026",
    discipline: "rtvfx",
    case: false,
    poster: "assets/img/poster_06.jpg",
    video: { src: "assets/video/film_cyan.mp4", poster: "assets/img/poster_06.jpg" },
    meta: { en: "Niagara", zh: "Niagara" },
  },
  {
    id: "particle-flow",
    title: "PARTICLE FLOW",
    year: "2026",
    discipline: "rtvfx",
    case: false,
    poster: "assets/img/poster_05.jpg",
    video: { src: "assets/video/film_cyan.mp4", poster: "assets/img/poster_05.jpg" },
    meta: { en: "Niagara / Blueprint", zh: "Niagara / Blueprint" },
  },
  {
    id: "starstream",
    title: "STARSTREAM",
    year: "2025",
    discipline: "rtvfx",
    case: false,
    poster: "assets/img/poster_07.jpg",
    video: { src: "assets/video/film_cyan.mp4", poster: "assets/img/poster_07.jpg" },
    meta: { en: "Niagara / Unreal Engine 5", zh: "Niagara / Unreal Engine 5" },
  },

  /* ========== REAL-TIME CINEMATICS · 案例卡片 ========== */
  {
    id: "echoes-of-orbit",
    title: "ECHOES OF ORBIT",
    year: "2026",
    discipline: "rtcinematics",
    selected: true,
    case: true,
    poster: "assets/img/poster_01.jpg",
    film: { src: "assets/video/film_blue.mp4", poster: "assets/img/poster_01.jpg" },
    meta: { en: "Unreal Engine 5 / Lighting / Cinematic", zh: "Unreal Engine 5 / 灯光 / Cinematic" },
    synopsis: {
      en: "A transmission from a probe that never came home — a study of what remains when signal outlives purpose.",
      zh: "一段来自永不归航的探测器的信号——一场关于「当信号比使命活得更久，还剩下什么」的研究。",
    },
    process: [
      { title: { en: "Lighting", zh: "灯光" },
        text: { en: "One sun, one planet-shine, one starfield. Restraint became the aesthetic.",
                zh: "一颗太阳，一行行星光，一片星野。克制本身成为美学。" },
        image: "assets/img/poster_03.jpg" },
      { title: { en: "Rendering", zh: "渲染" },
        text: { en: "Filmic tonemapping, halation, sensor dust — the engine graded like a camera.",
                zh: "胶片色调映射、光晕、传感器灰尘——引擎按摄影机的方式调色。" },
        image: "assets/img/poster_08.jpg" },
      { title: { en: "Sequencer", zh: "Sequencer" },
        text: { en: "Ninety seconds of falling, rendered as a spline — the camera path dictated everything.",
                zh: "九十秒的坠落，渲染成一条曲线——镜头路径决定一切。" },
        image: "assets/img/poster_02.jpg" },
    ],
    credits: [
      { role: { en: "Direction / Unreal Engine", zh: "导演 / 虚幻引擎" }, name: "Xianglin Qu" },
    ],
  },
  {
    id: "monolith",
    title: "MONOLITH",
    year: "2025",
    discipline: "rtcinematics",
    case: true,
    poster: "assets/img/poster_07.jpg",
    film: { src: "assets/video/film_cyan.mp4", poster: "assets/img/poster_07.jpg" },
    meta: { en: "Unreal Engine 5 / Environment / Lighting", zh: "Unreal Engine 5 / 场景 / 灯光" },
    synopsis: {
      en: "A cathedral of black stone at the edge of a dead sea — how little light a scene needs before it becomes a memory.",
      zh: "死海边缘的一座黑色石头圣殿——一个场景需要多少光，才会从场所变成记忆。",
    },
    process: [
      { title: { en: "Environment", zh: "场景" },
        text: { en: "Every surface tilts away from the sun; the composition locked on day one.",
                zh: "每一块表面都背对太阳；构图在第一天锁定。" },
        image: "assets/img/poster_05.jpg" },
      { title: { en: "Atmosphere", zh: "大气" },
        text: { en: "Volumetric fog earned the silence. Dust at 0.2 m/s — geology, not weather.",
                zh: "体积雾营造寂静。尘埃以 0.2 米每秒移动——像地质，不像天气。" },
        image: "assets/img/poster_06.jpg" },
    ],
    credits: [
      { role: { en: "Environment / Lighting", zh: "场景 / 灯光" }, name: "Xianglin Qu" },
    ],
  },
  {
    id: "neon-division",
    title: "NEON DIVISION",
    year: "2024",
    discipline: "rtcinematics",
    case: true,
    poster: "assets/img/poster_02.jpg",
    film: { src: "assets/video/film_blue.mp4", poster: "assets/img/poster_02.jpg" },
    meta: { en: "Unreal Engine 5 / Cinematic / VFX", zh: "Unreal Engine 5 / Cinematic / 视效" },
    synopsis: {
      en: "Rain, reflection, restraint — a city that never shows its hero, only the streets that made him.",
      zh: "雨、反射、克制——一座从不展示主角的城市，只有塑造了他的街道。",
    },
    process: [
      { title: { en: "Sequence", zh: "序列" },
        text: { en: "Twelve shots, one continuous camera. The boards were the contract.",
                zh: "十二个镜头，一台连续的摄影机。分镜即契约。" },
        image: "assets/img/poster_04.jpg" },
      { title: { en: "Look", zh: "视觉" },
        text: { en: "Wet asphalt as the mirror of the film. Everything neon is authored.",
                zh: "湿沥青是影片的镜子。所有霓虹都是绘制的。" },
        image: "assets/img/poster_06.jpg" },
    ],
    credits: [
      { role: { en: "VFX / Compositing", zh: "视效 / 合成" }, name: "Xianglin Qu" },
    ],
  },
  {
    id: "kiln",
    title: "KILN",
    year: "2024",
    discipline: "rtcinematics",
    case: true,
    poster: "assets/img/poster_04.jpg",
    film: { src: "assets/video/film_gold.mp4", poster: "assets/img/poster_04.jpg" },
    meta: { en: "Unreal Engine 5 / Product / Lighting", zh: "Unreal Engine 5 / 产品 / 灯光" },
    synopsis: {
      en: "Heat as a material — the object revealed the way a kiln reveals it: slowly, from the inside out.",
      zh: "把热度当作材料——物件像窑揭示它那样被揭示：缓慢地，由内而外。",
    },
    process: [
      { title: { en: "Material", zh: "材质" },
        text: { en: "Honest at 4K macro distance. The clay had to survive the close-up.",
                zh: "在 4K 微距距离下经得起凝视。陶土必须扛住特写。" },
        image: "assets/img/poster_03.jpg" },
      { title: { en: "Camera", zh: "镜头" },
        text: { en: "One continuous push-in. The highlight breathes at 0.1 Hz.",
                zh: "一次连续推近。高光以 0.1 赫兹呼吸。" },
        image: "assets/img/poster_01.jpg" },
    ],
    credits: [
      { role: { en: "Direction / CG", zh: "导演 / CG" }, name: "Xianglin Qu" },
    ],
  },
  {
    id: "spectra",
    title: "SPECTRA",
    year: "2023",
    discipline: "rtcinematics",
    case: true,
    poster: "assets/img/poster_08.jpg",
    film: { src: "assets/video/film_gold.mp4", poster: "assets/img/poster_08.jpg" },
    meta: { en: "Unreal Engine 5 / Title Design", zh: "Unreal Engine 5 / 标题设计" },
    synopsis: {
      en: "Titles for a festival of light — read by spectrum before letters.",
      zh: "为一个光影影展打造的片头字幕——先被光谱读到，再被字母读到。",
    },
    process: [
      { title: { en: "System", zh: "系统" },
        text: { en: "One prism rig, infinite credits — a physical setup duplicated by math.",
                zh: "一套棱镜装置，无限名单——被数学复制的同一个物理装置。" },
        image: "assets/img/poster_04.jpg" },
    ],
    credits: [
      { role: { en: "Design / Animation", zh: "设计 / 动画" }, name: "Xianglin Qu" },
    ],
  },
  {
    id: "drift",
    title: "DRIFT",
    year: "2023",
    discipline: "rtcinematics",
    case: true,
    poster: "assets/img/poster_06.jpg",
    film: { src: "assets/video/film_cyan.mp4", poster: "assets/img/poster_06.jpg" },
    meta: { en: "Real-Time / Motion / Typography", zh: "实时 / 动态 / 字体" },
    synopsis: {
      en: "A visual album cut to the waveform of a night drive — typography like tail lights.",
      zh: "剪进夜间车程波形里的视觉专辑——字体像尾灯。",
    },
    process: [
      { title: { en: "System", zh: "系统" },
        text: { en: "Seven frequency bands mapped to seven layers of fog and type. Nothing keyframed.",
                zh: "七个频段映射到雾与字的七层。没有关键帧。" },
        image: "assets/img/poster_05.jpg" },
    ],
    credits: [
      { role: { en: "Direction / Motion Design", zh: "导演 / 动态设计" }, name: "Xianglin Qu" },
    ],
  },

  /* ========== AI FILM / AIGC · 实验（网格条目 + 案例页） ========== */
  {
    id: "lin-aigc-ident",
    title: "LIN AIGC",
    year: "2026",
    discipline: "aifilm",
    group: "experiment",
    selected: true,
    case: true,
    poster: "assets/img/lin-aigc-poster.jpg",
    film: { src: "assets/video/lin-aigc-ident.mp4", poster: "assets/img/lin-aigc-poster.jpg" },
    meta: { en: "AI Filmmaking / Ident", zh: "AI 影像 / 品牌片头" },
    synopsis: {
      en: "An ident for the age of generated images — crystal typography machined out of darkness, struck by sparks, locked into place.",
      zh: "为生成影像时代打造的一片头——水晶字体自黑暗中被车削而出，火星迸溅，最终落位锁定。",
    },
    process: [
      { title: { en: "Concept", zh: "概念" },
        text: { en: "A brand about AI content should behave like AI content: refractive, multiplicative, inevitable.",
                zh: "一个关于 AI 内容的品牌，理应像 AI 内容一样行事：折射、倍增、势不可挡。" },
        image: "assets/img/poster_01.jpg" },
      { title: { en: "Generation", zh: "生成" },
        text: { en: "Directed text-to-video passes, curated for refraction clarity until the glass felt manufactured.",
                zh: "执导文生视频镜头，只为折射的通透筛选，直到玻璃感像是被制造的。" },
        image: "assets/img/poster_03.jpg" },
      { title: { en: "Assembly", zh: "剪辑" },
        text: { en: "Conformed, speed-ramped, graded: the blacks stay black, the glass burns warm.",
                zh: "整编、变速、调色：黑色保持漆黑，玻璃灼热发亮。" },
        image: "assets/img/poster_08.jpg" },
    ],
    credits: [
      { role: { en: "AI Direction / Edit", zh: "AI 导演 / 剪辑" }, name: "Xianglin Qu" },
    ],
  },
  {
    id: "seedance-demo",
    title: "SEEDANCE DEMO",
    year: "2026",
    discipline: "aifilm",
    group: "experiment",
    case: false,
    poster: "assets/img/poster_04.jpg",
    video: { src: "assets/video/film_gold.mp4", poster: "assets/img/poster_04.jpg" },
    meta: { en: "Video Generation Test", zh: "视频生成测试" },
  },
  {
    id: "minimax-h3-demo",
    title: "MINIMAX H3 DEMO",
    year: "2026",
    discipline: "aifilm",
    group: "experiment",
    case: false,
    poster: "assets/img/poster_03.jpg",
    video: { src: "assets/video/film_gold.mp4", poster: "assets/img/poster_03.jpg" },
    meta: { en: "Video Generation Test", zh: "视频生成测试" },
  },
  {
    id: "ai-battle-test",
    title: "AI BATTLE TEST",
    year: "2026",
    discipline: "aifilm",
    group: "experiment",
    case: false,
    poster: "assets/img/poster_02.jpg",
    video: { src: "assets/video/film_blue.mp4", poster: "assets/img/poster_02.jpg" },
    meta: { en: "Action Sequence Test", zh: "动作序列测试" },
  },
  {
    id: "i2v-study",
    title: "I2V STUDY",
    year: "2026",
    discipline: "aifilm",
    group: "experiment",
    case: false,
    poster: "assets/img/poster_05.jpg",
    video: { src: "assets/video/film_cyan.mp4", poster: "assets/img/poster_05.jpg" },
    meta: { en: "Image-to-Video Test", zh: "图生视频测试" },
  },
  {
    id: "v2v-study",
    title: "V2V STUDY",
    year: "2026",
    discipline: "aifilm",
    group: "experiment",
    case: false,
    poster: "assets/img/poster_06.jpg",
    video: { src: "assets/video/film_cyan.mp4", poster: "assets/img/poster_06.jpg" },
    meta: { en: "Video-to-Video Test", zh: "视频转绘测试" },
  },
];

/* ============================================================
   INFO — About 页（艺术家陈述式，不做软件展示）
   ============================================================ */
const INFO = {
  intro: {
    en: "I make images that behave like light — real-time films, simulation-driven motion, and stories built with generative models. The tools change; the discipline of the frame doesn't.",
    zh: "我制作像光一样行事的影像——实时影片、解算驱动的动态，以及用生成模型构建的故事。工具会变，画面的纪律不会。",
  },
  disciplines: [
    { label: "01", name: { en: "AI Film / AIGC", zh: "AI 影像 / AIGC" },
      detail: { en: "Original series · generative experiments · direction", zh: "原创系列 · 生成实验 · 导演" } },
    { label: "02", name: { en: "Real-Time VFX", zh: "实时视效" },
      detail: { en: "Niagara · Houdini · FX studies", zh: "Niagara · Houdini · FX 研究" } },
    { label: "03", name: { en: "Real-Time Cinematics", zh: "实时影像" },
      detail: { en: "Unreal Engine 5 · lighting / rendering / sequencer", zh: "Unreal Engine 5 · 灯光 / 渲染 / Sequencer" } },
  ],
  recognition: [
    { year: "2026", what: { en: "Epic MegaGrant", zh: "Epic MegaGrant" } },
    { year: "2025", what: { en: "Site of the Day — Awwwards", zh: "Awwwards 每日最佳站点" } },
    { year: "2024", what: { en: "Best VFX — Festival Name", zh: "最佳视效 — 影展名称" } },
  ],
};
