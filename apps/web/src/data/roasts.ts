import type { SceneId, StyleId } from './prompts';

// 5 styles x 6 scenes = 30 损友点评, 每句 ≤ 16 字
export const ROASTS: Record<StyleId, Record<SceneId, string>> = {
  funny: {
    apology: '这封最像朋友圈段子手',
    thanks: '这封能让你朋友笑半年',
    rejection: '这封不伤人但有理由',
    confession: '这封像真心话大冒险',
    resignation: '这封能让你 HR 翻白眼',
    roast: '这封够狠够阴',
  },
  sincere: {
    apology: '这封能让你妈感动 0.5 秒',
    thanks: '这封像写进年终总结',
    rejection: '这封一读就知道没戏',
    confession: '这封能直接当结婚誓词',
    resignation: '这封老板看了会内疚',
    roast: '这封骂人都很有教养',
  },
  deflect: {
    apology: '这封读完对方更生气',
    thanks: '这封像顺便的小恩惠',
    rejection: '这封拒绝得理直气壮',
    confession: '这封表白还说一半',
    resignation: '这封离职像出门散步',
    roast: '这封撕完还装无辜',
  },
  legal: {
    apology: '这封能让对方请律师',
    thanks: '这封像盖了公章的感谢',
    rejection: '这封像法院传票',
    confession: '这封像签了合同的告白',
    resignation: '这封能直接当证据',
    roast: '这封撕完还能反告你',
  },
  silent: {
    apology: '这封是空的(真的没回)',
    thanks: '这封发完等于没发',
    rejection: '已读不答 = 高级拒绝',
    confession: '已读不回 = 暗送秋波',
    resignation: '沉默即离职宣言',
    roast: '已读不答 = 顶级撕逼',
  },
};
