import { describe, it, expect } from 'vitest';
import { sanitize, scrubPii, maskNames } from '../src/sanitizer/responseSanitizer.js';
import { SURNAMES } from '../src/ethics/keywords.js';

describe('scrubPii', () => {
  it('removes Chinese mobile numbers', () => {
    expect(scrubPii('打我手机 13812345678 谢谢')).not.toContain('13812345678');
  });
  it('removes email addresses', () => {
    expect(scrubPii('邮箱 kevin@example.com 回我')).not.toContain('kevin@example.com');
  });
  it('removes WeChat-like ids', () => {
    expect(scrubPii('加我 wechat: kevin_wx_123')).toMatch(/\[联系方式\]/);
  });
});

describe('maskNames', () => {
  it('replaces surnames with [某人]', () => {
    expect(maskNames('王伟是个好人')).toContain('[某人]');
  });
  it('does not touch non-surnames', () => {
    expect(maskNames('今天天气不错')).toBe('今天天气不错');
  });
  it('handles each surname in the list at least once', () => {
    for (const sn of SURNAMES.slice(0, 10)) {
      expect(maskNames(`${sn}某在这里`)).toContain('[某人]');
    }
  });
});

describe('sanitize', () => {
  it('truncates > 500 chars to exactly 500', () => {
    const out = sanitize({ letter: 'a'.repeat(800), input: 'x' });
    expect(out.length).toBe(500);
  });
  it('strips phone numbers in output', () => {
    const out = sanitize({ letter: '打我 13900000000', input: 'x' });
    expect(out).not.toContain('13900000000');
  });
  it('masks echoed surname from input', () => {
    const out = sanitize({ letter: '关于王伟的猫', input: '我让王伟的猫跑了' });
    expect(out).not.toContain('王伟');
  });
});
