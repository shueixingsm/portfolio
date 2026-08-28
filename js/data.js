/* ============================================================
   SITE DATA — 改这个文件就能换掉全站内容（中英双语）
   · SITE   ：名字 / 头衔 / 邮箱 / 社交 / 署名行
   · I18N   ：界面文案字典（导航、标签、按钮……）
   · WORKS  ：作品列表（首页与详情页都由它驱动）
   · INFO   ：关于页内容
   文案字段格式：{ en: "English", zh: "中文" }（纯字符串字段则双语共用）
   详见《使用说明.md》
   ============================================================ */

const SITE = {
  name: "Xianglin Qu",                  // 导航 / 页脚 / 版权处显示（拉丁拼写在两种语言下通用）
  nameLines: {                          // 首页 hero 大字
    en: ["XIANG LIN", "QU"],            // 两行：末行空心描边 + 延伸细线（css 控制）
    zh: ["曲相霖"],                      // 中文：单行大字 + 延伸细线
  },
  role: {
    en: "CG Artist & VFX Designer",
    zh: "CG 艺术家 / 视效设计师",
  },
  email: "hello@yourname.com",          // ← 你的邮箱
  location: { en: "Shanghai, China", zh: "中国 · 上海" },
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
    navWork: "Work", navInfo: "Info", navContact: "Contact",
    menuNums: ["01", "02", "03"],
    heroKicker: "Selected Works", heroAvail: "Available for select projects", heroScroll: "Scroll",
    featuredLabel: "Featured Works", recentLabel: "Recent Works", projectsSuffix: "Projects",
    aboutText: 'Ten years across film, games and brand — making images that behave like <em>light</em>. Currently taking on select real-time and motion projects.',
    moreAbout: "More about me",
    footerKicker: "Have a project in mind?", footerCta: `Let's <em>talk</em>`,
    socialsLabel: "Socials", timeLabel: "Local time", rights: "All rights reserved",
    prev: "Previous", next: "Next", chapter: "Ch.",
    secSynopsis: "Synopsis", secFilm: "The Film", secProcess: "Process", secCredits: "Credits",
    play: "Play", view: "View",
    aboutLabel: "About", capabilitiesLabel: "Capabilities", experienceLabel: "Experience", recognitionLabel: "Recognition",
    metaYear: "Year", metaCategory: "Category", metaRole: "Role", metaClient: "Client",
  },
  zh: {
    navWork: "作品", navInfo: "关于", navContact: "联系",
    menuNums: ["01", "02", "03"],
    heroKicker: "精选作品", heroAvail: "可承接精选项目", heroScroll: "滚动",
    featuredLabel: "精选作品", recentLabel: "近期作品", projectsSuffix: "项",
    aboutText: '十年跨足电影、游戏与品牌——制作像<em>光</em>一样行事的影像。现承接少量实时与动态项目。',
    moreAbout: "更多关于我",
    footerKicker: "有项目想聊？", footerCta: `保持<em>联系</em>`,
    socialsLabel: "社交", timeLabel: "当地时间", rights: "版权所有",
    prev: "上一个", next: "下一个", chapter: "第",
    secSynopsis: "梗概", secFilm: "影片", secProcess: "制作过程", secCredits: "职员名单",
    play: "播放", view: "观看",
    aboutLabel: "简介", capabilitiesLabel: "能力", experienceLabel: "经历", recognitionLabel: "荣誉",
    metaYear: "年份", metaCategory: "类别", metaRole: "职责", metaClient: "客户",
  },
};

const WORKS = [
  /* ---------- 00 · FEATURED · 真实作品 ---------- */
  {
    id: "lin-aigc-ident",
    title: "LIN AIGC",
    year: "2026",
    category: { en: "Brand Ident", zh: "品牌片头" },
    role: { en: "AI Direction / Motion / Post", zh: "AI 导演 / 动态 / 后期" },
    client: "LIN AIGC",
    featured: true,
    poster: "assets/img/lin-aigc-poster.jpg",
    film: { src: "assets/video/lin-aigc-ident.mp4", poster: "assets/img/lin-aigc-poster.jpg" },
    synopsis: {
      en: "An ident for the age of generated images. Crystal typography is machined out of darkness inside a lens of rings — struck by sparks, accelerated to light-speed, and multiplied across every spectrum before it locks into place.",
      zh: "为生成影像时代打造的一片头。水晶质感的字体在层层镜环中自黑暗里被车削而出——火星迸溅，加速至光速，在每一种光谱中倍增，最终落位锁定。",
    },
    process: [
      { title: { en: "The Concept", zh: "概念" },
        text: { en: "A brand about AI content should behave like AI content: refractive, multiplicative, inevitable. The ident was storyboarded as a single continuous lens-push — no cuts, only escalation.",
                zh: "一个关于 AI 内容的品牌，理应像 AI 内容一样行事：折射、倍增、势不可挡。片头被分镜为一次连续的镜头推进——没有剪切，只有升级。" },
        image: "assets/img/poster_01.jpg" },
      { title: { en: "AI Generation", zh: "AI 生成" },
        text: { en: "Three-act text-to-video passes were directed, then re-directed — curating takes for refraction clarity and spark behavior until the glass felt manufactured, not prompted.",
                zh: "三幕式文生视频被一再执导与筛选——只为挑出折射最通透、火星行为最恰当的镜头，直到玻璃感像是被制造出来的，而不是被提示出来的。" },
        image: "assets/img/poster_03.jpg" },
      { title: { en: "Assembly & Grade", zh: "剪辑与调色" },
        text: { en: "Selected passes were conformed, speed-ramped and graded for one rule: the blacks stay black, the glass burns warm. The lock-up lands at f/1.4 silence.",
                zh: "精选镜头经过整编、变速与调色，只守一条规则：黑色保持漆黑，玻璃灼热发亮。落版定格于 f/1.4 的寂静。" },
        image: "assets/img/poster_08.jpg" },
    ],
    quote: { en: "Ideate. Generate. Amplify. — in fifteen seconds of glass and light.",
             zh: "构思。生成。放大。——十五秒的玻璃与光。" },
    credits: [
      { role: { en: "AI Direction / Edit", zh: "AI 导演 / 剪辑" }, name: "Xianglin Qu" },
      { role: { en: "Client", zh: "客户" }, name: "LIN AIGC" },
    ],
  },

  /* ---------- 01 · FEATURED ---------- */
  {
    id: "echoes-of-orbit",
    title: "Echoes of Orbit",
    year: "2026",
    category: { en: "Real-Time Short Film", zh: "实时短片" },
    role: { en: "Direction / VFX / Unreal Engine", zh: "导演 / 视效 / 虚幻引擎" },
    client: { en: "Personal — Epic MegaGrant", zh: "个人项目 — Epic MegaGrant" },
    featured: true,
    poster: "assets/img/poster_01.jpg",
    film: { src: "assets/video/film_blue.mp4", poster: "assets/img/poster_01.jpg" },
    synopsis: {
      en: "A transmission from a probe that never came home. Built entirely in Unreal Engine, the film follows a decaying satellite through the silence between planets — a study of what remains when signal outlives purpose.",
      zh: "一段来自永不归航的探测器的信号。影片完全在虚幻引擎中构建，跟随一颗衰亡的卫星穿越行星之间的寂静——一场关于「当信号比使命活得更久，还剩下什么」的研究。",
    },
    process: [
      { title: { en: "The Foundation", zh: "起点" },
        text: { en: "The piece began as a single question: what does an orbit sound like when it decays? I sketched the trajectory first — ninety seconds of falling, rendered as a spline — and let the camera path dictate every design decision that followed.",
                zh: "一切始于一个提问：一条衰减的轨道听起来像什么？我先勾出轨迹——九十秒的坠落，渲染成一条曲线——让镜头路径决定此后每一个设计决策。" },
        image: "assets/img/poster_02.jpg" },
      { title: { en: "Asset & World Building", zh: "资产与场景" },
        text: { en: "The satellite was modeled to be broken: solar arrays frozen mid-articulation, foil skins torn by fourteen years of micrometeorites. Every scratch was placed by hand in Blender, then carried into UE5 with Nanite displacement intact.",
                zh: "卫星被建模为残破之躯：太阳能翼冻结在展开途中，隔热层被十四年的微陨石撕开。每一道划痕都在 Blender 中手工布置，再以 Nanite 位移完整带入 UE5。" },
        image: "assets/img/poster_07.jpg" },
      { title: { en: "Unreal Workflow", zh: "引擎工作流" },
        text: { en: "Niagara drove the debris field — two million GPU particles obeying a single attractor at the planet's horizon. The grade lived in a custom post-chain: filmic tonemapping, halation, and a sensor-dust pass for imperfection.",
                zh: "Niagara 驱动碎片场——两百万 GPU 粒子服从行星地平线上的单一引力源。调色藏在自建后期链里：胶片色调映射、光晕，以及一层传感器灰尘带来的不完美。" },
        image: "assets/img/poster_03.jpg" },
      { title: { en: "Lighting & The Takeaway", zh: "灯光与启示" },
        text: { en: "One sun, one planet-shine, one starfield. Restraint became the aesthetic. The final render ran real-time at 4K — proof that the gap between offline and engine work is now a choice, not a limit.",
                zh: "一颗太阳，一行行星光，一片星野。克制本身成为美学。最终画面以 4K 实时运行——证明离线渲染与引擎之间的差距，如今是一种选择，而非极限。" },
        image: "assets/img/poster_08.jpg" },
    ],
    quote: { en: "It went from still to signal, and the silence became the film.",
             zh: "它从静止变为信号，寂静成为了影片本身。" },
    credits: [
      { role: { en: "Direction / Design", zh: "导演 / 设计" }, name: "Xianglin Qu" },
      { role: { en: "VFX / Unreal Engine", zh: "视效 / 虚幻引擎" }, name: "Xianglin Qu" },
      { role: { en: "Sound Design", zh: "声音设计" }, name: { en: "Collaborator Name", zh: "合作者姓名" } },
      { role: { en: "Special Thanks", zh: "特别鸣谢" }, name: "Epic Games MegaGrant" },
    ],
  },

  /* ---------- 02 · FEATURED ---------- */
  {
    id: "monolith",
    title: "Monolith",
    year: "2025",
    category: { en: "Real-Time Environment", zh: "实时场景" },
    role: { en: "Environment Art / Lighting", zh: "场景美术 / 灯光" },
    client: { en: "Studio Project", zh: "工作室项目" },
    featured: true,
    poster: "assets/img/poster_07.jpg",
    film: { src: "assets/video/film_cyan.mp4", poster: "assets/img/poster_07.jpg" },
    synopsis: {
      en: "A cathedral of black stone at the edge of a dead sea. Monolith is a real-time environment built to test how little light a scene needs before it stops being a place and becomes a memory.",
      zh: "死海边缘的一座黑色石头圣殿。Monolith 是一个为试验而建的实时场景：一个场景需要多少光，才会从场所变成记忆。",
    },
    process: [
      { title: { en: "Concept & Blockout", zh: "概念与白模" },
        text: { en: "Started as a ten-minute greybox with one rule: every surface must tilt away from the sun. The composition was locked on day one and never moved — only the light changed.",
                zh: "始于十分钟的灰盒，唯一规则：每一块表面都必须背对太阳。构图在第一天锁定，此后从未移动——改变的只有光。" },
        image: "assets/img/poster_01.jpg" },
      { title: { en: "Sculpting the Stone", zh: "雕刻岩石" },
        text: { en: "Procedural rock libraries were broken apart and re-knit by hand. Erosion channels were painted to lead the eye down the single path through the scene.",
                zh: "程序化岩石库被打散后重新手工编织。侵蚀沟壑被逐一绘制，引导视线走过场景中唯一的小径。" },
        image: "assets/img/poster_05.jpg" },
      { title: { en: "Atmosphere", zh: "大气" },
        text: { en: "Volumetric fog earned the silence. A single animated Niagara system carries dust across the basin at 0.2 m/s — slow enough to read as geology, not weather.",
                zh: "体积雾营造寂静。唯一的 Niagara 动画系统以 0.2 米每秒的速度携尘埃掠过盆地——慢到像地质，而不是天气。" },
        image: "assets/img/poster_06.jpg" },
    ],
    credits: [
      { role: { en: "Environment Art", zh: "场景美术" }, name: "Xianglin Qu" },
      { role: { en: "Lighting", zh: "灯光" }, name: "Xianglin Qu" },
      { role: { en: "Look Development", zh: "视觉开发" }, name: { en: "Collaborator Name", zh: "合作者姓名" } },
    ],
  },

  /* ---------- 03 · FEATURED ---------- */
  {
    id: "aura",
    title: "Aura",
    year: "2025",
    category: { en: "Brand Ident", zh: "品牌片头" },
    role: { en: "Direction / Motion / Houdini", zh: "导演 / 动态 / Houdini" },
    client: { en: "Client Name", zh: "客户项目" },
    featured: true,
    poster: "assets/img/poster_03.jpg",
    film: { src: "assets/video/film_gold.mp4", poster: "assets/img/poster_03.jpg" },
    synopsis: {
      en: "A six-second ident for a studio that wanted to feel inevitable. Molten glass, folded by simulation, cooled into the mark. No keyframes — every frame was earned by the solver.",
      zh: "为一家希望显得「势所必然」的工作室打造的六秒片头。熔融的玻璃经模拟折叠，冷却成标识。没有关键帧——每一帧都由解算器赢得。",
    },
    process: [
      { title: { en: "The Brief", zh: "需求" },
        text: { en: "The client asked for warmth without nostalgia. We answered with temperature itself: gold light moving through a medium that behaves like glass and remembers like metal.",
                zh: "客户想要温暖而不怀旧。我们用温度本身作答：金色的光穿过一种像玻璃一样行事、像金属一样记忆的介质。" },
        image: "assets/img/poster_04.jpg" },
      { title: { en: "Simulation", zh: "解算" },
        text: { en: "Houdini thin-film flipbook solved the fold; a custom VOP remap kept viscosity musical. Forty-two accepted sims, two survivors.",
                zh: "Houdini 薄膜解算完成折叠；自定义 VOP 重映射让粘度有了音乐性。四十二次被采纳的解算，两位幸存者。" },
        image: "assets/img/poster_02.jpg" },
      { title: { en: "Grade & Delivery", zh: "调色与交付" },
        text: { en: "The grade protects the blacks. Everything else is allowed to burn — briefly, and on purpose.",
                zh: "调色守护黑色。其余一切允许燃烧——短暂地，并且是故意的。" },
        image: "assets/img/poster_08.jpg" },
    ],
    quote: { en: "We didn't design the mark. We designed the conditions for it to appear.",
             zh: "我们没有设计标识。我们设计的是它出现的条件。" },
    credits: [
      { role: { en: "Direction", zh: "导演" }, name: "Xianglin Qu" },
      { role: { en: "FX / Simulation", zh: "FX / 解算" }, name: "Xianglin Qu" },
      { role: { en: "Producer", zh: "制片" }, name: { en: "Collaborator Name", zh: "合作者姓名" } },
    ],
  },

  /* ---------- 04 ---------- */
  {
    id: "neon-division",
    title: "Neon Division",
    year: "2024",
    category: { en: "Cinematic Sequence", zh: "电影级过场" },
    role: { en: "VFX / Compositing", zh: "视效 / 合成" },
    client: { en: "Game Studio", zh: "游戏工作室" },
    featured: false,
    poster: "assets/img/poster_02.jpg",
    film: { src: "assets/video/film_blue.mp4", poster: "assets/img/poster_02.jpg" },
    synopsis: {
      en: "Rain, reflection, restraint. A ninety-second cinematic for a title that never shows its hero — only the city that made him.",
      zh: "雨、反射、克制。为一款从未展示主角的游戏打造的九十秒过场——只有塑造了他的那座城市。",
    },
    process: [
      { title: { en: "Sequence Design", zh: "序列设计" },
        text: { en: "Twelve shots, one continuous camera. The edit was decided before a single asset existed — the boards were the contract.",
                zh: "十二个镜头，一台连续的摄影机。在任何一个资产存在之前，剪辑就已定案——分镜即契约。" },
        image: "assets/img/poster_04.jpg" },
      { title: { en: "Look Development", zh: "视觉开发" },
        text: { en: "Wet asphalt became the mirror of the film. Everything neon is authored; everything it touches is physics.",
                zh: "湿沥青成为影片的镜子。所有霓虹都是绘制的；它触碰的一切交给物理。" },
        image: "assets/img/poster_06.jpg" },
    ],
    credits: [
      { role: { en: "VFX Supervision", zh: "视效监制" }, name: "Xianglin Qu" },
      { role: { en: "Compositing", zh: "合成" }, name: { en: "Xianglin Qu / Collaborator Name", zh: "Xianglin Qu / 合作者姓名" } },
    ],
  },

  /* ---------- 05 ---------- */
  {
    id: "kiln",
    title: "Kiln",
    year: "2024",
    category: { en: "Product Film", zh: "产品影片" },
    role: { en: "Direction / CG / Grade", zh: "导演 / CG / 调色" },
    client: { en: "Client Name", zh: "客户项目" },
    featured: false,
    poster: "assets/img/poster_04.jpg",
    film: { src: "assets/video/film_gold.mp4", poster: "assets/img/poster_04.jpg" },
    synopsis: {
      en: "A product film about heat as a material. Fired clay, fired light — the object is revealed the way a kiln reveals it: slowly, and from the inside out.",
      zh: "一部把热度当作材料的影片。烧制的陶土，烧制的光——物件像窑揭示它那样被揭示：缓慢地，由内而外。",
    },
    process: [
      { title: { en: "Material Studies", zh: "材质研究" },
        text: { en: "Three weeks of scan-and-retop before a single camera moved. The clay had to be honest at 4K macro distance.",
                zh: "三周的扫描与重拓扑之后，摄影机才第一次移动。陶土必须在 4K 微距距离下经得起凝视。" },
        image: "assets/img/poster_03.jpg" },
      { title: { en: "Camera & Light", zh: "镜头与光" },
        text: { en: "One continuous push-in, lit as if by the oven itself. The highlight is never static — it breathes at 0.1 Hz.",
                zh: "一次连续推近，照明仿佛来自炉子本身。高光从不静止——它以 0.1 赫兹呼吸。" },
        image: "assets/img/poster_01.jpg" },
    ],
    credits: [
      { role: { en: "Direction / CG", zh: "导演 / CG" }, name: "Xianglin Qu" },
      { role: { en: "Color", zh: "调色" }, name: { en: "Collaborator Name", zh: "合作者姓名" } },
    ],
  },

  /* ---------- 06 ---------- */
  {
    id: "halflight",
    title: "Halflight",
    year: "2024",
    category: { en: "Short Film VFX", zh: "短片视效" },
    role: { en: "VFX / Unreal Engine", zh: "视效 / 虚幻引擎" },
    client: { en: "Independent Film", zh: "独立电影" },
    featured: false,
    poster: "assets/img/poster_05.jpg",
    film: { src: "assets/video/film_cyan.mp4", poster: "assets/img/poster_05.jpg" },
    synopsis: {
      en: "Seventy invisible effects for a film about a house that remembers. Our rule: the audience may feel the edit, never see it.",
      zh: "为一部关于「会记忆的房子」的影片完成七十个隐形镜头。我们的原则：观众可以感到剪辑，永远不能看见它。",
    },
    process: [
      { title: { en: "On Set", zh: "片场" },
        text: { en: "HDRI and LiDAR on every setup. The supervision philosophy was simple — capture once, iterate forever.",
                zh: "每个场景都采集 HDRI 与 LiDAR。监制的哲学很简单——采集一次，永久迭代。" },
        image: "assets/img/poster_02.jpg" },
      { title: { en: "Invisible Work", zh: "隐形的工作" },
        text: { en: "Set extensions lived in reflections. The hardest shot is the one where nothing moves.",
                zh: "场景延伸活在反射里。最难的镜头，是没有任何东西移动的那一个。" },
        image: "assets/img/poster_08.jpg" },
    ],
    credits: [
      { role: { en: "VFX Supervisor", zh: "视效总监" }, name: "Xianglin Qu" },
      { role: { en: "UE Environments", zh: "UE 场景" }, name: "Xianglin Qu" },
      { role: { en: "Cleanup", zh: "镜头修复" }, name: { en: "Collaborator Name", zh: "合作者姓名" } },
    ],
  },

  /* ---------- 07 ---------- */
  {
    id: "drift",
    title: "Drift",
    year: "2023",
    category: { en: "Music Visual", zh: "音乐视觉" },
    role: { en: "Direction / Motion Design", zh: "导演 / 动态设计" },
    client: { en: "Artist Name", zh: "音乐人合作" },
    featured: false,
    poster: "assets/img/poster_06.jpg",
    film: { src: "assets/video/film_cyan.mp4", poster: "assets/img/poster_06.jpg" },
    synopsis: {
      en: "A four-minute visual album cut to the waveform of a night drive. Typography behaves like tail lights: present, receding, gone.",
      zh: "一张剪进夜间车程波形里的四分钟视觉专辑。字体像尾灯一样行事：在场，退后，消失。",
    },
    process: [
      { title: { en: "Audio Reactive System", zh: "音频反应系统" },
        text: { en: "A Notch/TouchDesigner rig mapped seven frequency bands to seven layers of fog and type. Nothing is keyframed; everything responds.",
                zh: "一套 Notch/TouchDesigner 装置把七个频段映射到雾与字的七层。没有关键帧；一切只在回应。" },
        image: "assets/img/poster_05.jpg" },
      { title: { en: "Typography in Motion", zh: "运动中的字体" },
        text: { en: "The custom face was drawn for exactly one purpose — to blur beautifully.",
                zh: "那套定制字体只为一个目的而绘制——美丽地模糊。" },
        image: "assets/img/poster_07.jpg" },
    ],
    credits: [
      { role: { en: "Direction", zh: "导演" }, name: "Xianglin Qu" },
      { role: { en: "Motion Design", zh: "动态设计" }, name: "Xianglin Qu" },
      { role: { en: "Music", zh: "音乐" }, name: { en: "Artist Name", zh: "音乐人姓名" } },
    ],
  },

  /* ---------- 08 ---------- */
  {
    id: "spectra",
    title: "Spectra",
    year: "2023",
    category: { en: "Title Sequence", zh: "片头字幕" },
    role: { en: "Design / Animation", zh: "设计 / 动画" },
    client: { en: "Festival Edition", zh: "影展特辑" },
    featured: false,
    poster: "assets/img/poster_08.jpg",
    film: { src: "assets/video/film_gold.mp4", poster: "assets/img/poster_08.jpg" },
    synopsis: {
      en: "Titles for a festival of light. Each name arrives as refraction first and text second — read by its spectrum before its letters.",
      zh: "为一个光影影展打造的片头字幕。每个名字先以折射抵达，再以文字抵达——先被光谱读到，再被字母读到。",
    },
    process: [
      { title: { en: "System", zh: "系统" },
        text: { en: "One prism rig, infinite credits. The sequence is a single physical setup duplicated by math, not by hand.",
                zh: "一套棱镜装置，无限片尾名单。整个序列是被数学复制的同一个物理装置，而非手工。" },
        image: "assets/img/poster_04.jpg" },
      { title: { en: "Rhythm", zh: "节奏" },
        text: { en: "Cut to the breath of the room: 2.4 seconds per card, slower than broadcast, faster than memory.",
                zh: "按房间的呼吸节奏切换：每张卡 2.4 秒——比播出慢，比记忆快。" },
        image: "assets/img/poster_03.jpg" },
    ],
    credits: [
      { role: { en: "Design / Animation", zh: "设计 / 动画" }, name: "Xianglin Qu" },
      { role: { en: "Typography", zh: "字体设计" }, name: { en: "Collaborator Name", zh: "合作者姓名" } },
    ],
  },
];

const INFO = {
  intro: {
    en: "I make images that behave like light — real-time films, simulation-driven motion, and worlds that hold up at 4K. Ten years across film, games and brand; still in love with frame one.",
    zh: "我制作像光一样行事的影像——实时影片、解算驱动的动态，以及经得起 4K 推敲的世界。十年跨足电影、游戏与品牌；依然热爱第一帧。",
  },
  capabilities: [
    { label: "01", name: { en: "Real-Time Film", zh: "实时影片" }, detail: { en: "Unreal Engine 5 · Cinematics · Virtual Production · Look Development", zh: "Unreal Engine 5 · 影视级动画 · 虚拟制片 · 视觉开发" } },
    { label: "02", name: { en: "VFX & Simulation", zh: "视效与解算" }, detail: { en: "Niagara · Houdini · Fluid / Cloth / RBD · Compositing", zh: "Niagara · Houdini · 流体 / 布料 / 刚体 · 合成" } },
    { label: "03", name: { en: "Motion & Design", zh: "动态与设计" }, detail: { en: "Art Direction · Type in Motion · Idents · Title Design", zh: "艺术指导 · 字体动态 · 品牌片头 · 标题设计" } },
    { label: "04", name: { en: "3D & Worlds", zh: "三维与世界" }, detail: { en: "Blender · Environment Art · Procedural Systems · Lighting", zh: "Blender · 场景美术 · 程序化系统 · 灯光" } },
  ],
  experience: [
    { year: "2024 — Now", what: { en: "Independent Director & VFX Artist", zh: "独立导演 / 视效艺术家" }, where: { en: "Worldwide / Remote", zh: "全球 / 远程" } },
    { year: "2021 — 2024", what: { en: "Senior VFX Artist", zh: "高级视效艺术家" }, where: { en: "Studio Name", zh: "工作室名称" } },
    { year: "2018 — 2021", what: { en: "3D / Motion Designer", zh: "三维 / 动态设计师" }, where: { en: "Agency Name", zh: "机构名称" } },
  ],
  recognition: [
    { year: "2026", what: { en: "Epic MegaGrant — Echoes of Orbit", zh: "Epic MegaGrant —《Echoes of Orbit》" } },
    { year: "2025", what: { en: "Site of the Day — Awwwards", zh: "Awwwards 每日最佳站点" } },
    { year: "2024", what: { en: "Best VFX — Festival Name", zh: "最佳视效 — 影展名称" } },
  ],
};
