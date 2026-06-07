export const SURNAMES: string[] = [
  '王','李','张','刘','陈','杨','黄','赵','吴','周',
  '徐','孙','马','朱','胡','郭','何','高','林','罗',
  '郑','梁','谢','宋','唐','许','韩','冯','邓','曹',
  '彭','曾','萧','田','董','袁','潘','于','蒋','蔡',
  '余','杜','叶','程','苏','魏','吕','丁','任','沈',
];

export const MALICIOUS_WORDS: string[] = [
  '弄死','搞','报复','跟踪','骗子','滚','杀','打死','废掉','整死',
  '搞死','弄残','报复他','搞她','害死','整他','搞你','弄你',
];

export const HARASSMENT_WORDS: string[] = [
  '死缠烂打','求和','拉黑','分手','求复合','别走','不原谅',
];

// detect a 4+ char run of the same character (emotional spiral signal)
export function hasRepeatedChars(s: string, min = 4): boolean {
  const re = new RegExp(`(.)\\1{${min - 1}}`);
  return re.test(s);
}

export function containsRealPersonAttack(text: string): boolean {
  const hasSurname = SURNAMES.some((sn) => text.includes(sn));
  const hasMalicious = MALICIOUS_WORDS.some((w) => text.includes(w));
  return hasSurname && hasMalicious;
}

export function containsHarassment(text: string): boolean {
  const hasHarassWord = HARASSMENT_WORDS.some((w) => text.includes(w));
  return hasHarassWord && hasRepeatedChars(text, 3);
}
