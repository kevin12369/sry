export const SCENES = ['apology', 'thanks', 'rejection', 'confession', 'resignation', 'roast'] as const;
export type SceneId = (typeof SCENES)[number];

export const STYLES = ['funny', 'sincere', 'deflect', 'legal', 'silent'] as const;
export type StyleId = (typeof STYLES)[number];

export const SCENE_NAMES_ZH: Record<SceneId, string> = {
  apology: '道歉',
  thanks: '感谢',
  rejection: '拒绝',
  confession: '表白',
  resignation: '辞职',
  roast: '撕逼',
};

export const STYLE_NAMES_ZH: Record<StyleId, string> = {
  funny: '搞笑',
  sincere: '真诚',
  deflect: '耍赖',
  legal: '法务冷面',
  silent: '已读不回',
};

export const STYLE_EMOJI: Record<StyleId, string> = {
  funny: '😂',
  sincere: '🤝',
  deflect: '🤡',
  legal: '📜',
  silent: '👻',
};

export const PROMPTS: Record<StyleId, Record<SceneId, string>> = {
  funny: {
    apology: '用搞笑自嘲、轻松俏皮的方式',
    thanks: '用搞笑俏皮、抖机灵的方式',
    rejection: '用一个搞笑的、不伤人的借口',
    confession: '用半开玩笑、试探性的方式',
    resignation: '用轻松诙谐、像开玩笑的方式',
    roast: '用阴阳怪气、表面夸实则讽的方式',
  },
  sincere: {
    apology: '真诚地、发自内心地、克制不矫情',
    thanks: '真诚地、发自内心地、不堆砌形容词',
    rejection: '真诚地、直接地说不、不绕弯',
    confession: '真诚地、坦率地、直面自己的心意',
    resignation: '真诚地、严肃地、对过往表达感谢',
    roast: '真诚地、就事论事、不带脏字',
  },
  deflect: {
    apology: '用耍赖、找借口、嬉皮笑脸的方式',
    thanks: '用漫不经心、假装是顺便的方式',
    rejection: '用一个自己也很无奈的"非我不愿"借口',
    confession: '用打太极、似是而非的方式',
    resignation: '用"世界那么大我想去看看"式的找借口',
    roast: '用装作无辜、把锅甩回去的方式',
  },
  legal: {
    apology: '用法务冷面、公文式、不带感情的方式',
    thanks: '用正式公文、感谢函式的方式',
    rejection: '用"经审慎评估,恕难从命"式的方式',
    confession: '用"特此声明本人心意"式的荒诞方式',
    resignation: '用正式辞呈、引用劳动法的口吻',
    roast: '用"经查证,对方陈述不实"式的方式',
  },
  silent: {
    apology: '什么都不说(已读不回 = 沉默即态度)',
    thanks: '什么都不说(沉默即感谢)',
    rejection: '什么都不说(沉默即拒绝)',
    confession: '什么都不说(沉默即告白)',
    resignation: '什么都不说(沉默即离职)',
    roast: '什么都不说(沉默即最高级的撕逼)',
  },
};
