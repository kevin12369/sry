import { SURNAMES } from '../ethics/keywords.js';

const MAX_LEN = 500;
const PHONE_RE = /1[3-9]\d{9}/g;
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const WECHAT_RE = /(wechat|微信|wx)[:：\s]*[A-Za-z0-9_-]{4,}/gi;

export function scrubPii(text: string): string {
  return text
    .replace(PHONE_RE, '[联系方式]')
    .replace(EMAIL_RE, '[联系方式]')
    .replace(WECHAT_RE, '[联系方式]');
}

export function maskNames(text: string): string {
  let out = text;
  for (const sn of SURNAMES) {
    const re = new RegExp(`${sn}[一-龥]{1,2}`, 'g');
    out = out.replace(re, '[某人]');
  }
  return out;
}

export interface SanitizeArgs {
  letter: string;
  input: string;
}

export function sanitize({ letter, input }: SanitizeArgs): string {
  let out = scrubPii(letter);
  out = maskNames(out);
  if (out.length > MAX_LEN) out = out.slice(0, MAX_LEN);
  // If the input contains echoed surnames we want them masked too — but only
  // when the LLM output literally repeats them; covered by maskNames(letter) above.
  void input;
  return out;
}
