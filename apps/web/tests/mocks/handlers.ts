import { http, HttpResponse } from 'msw';

const FAKE_LETTERS = {
  'funny': '我不应该这样,原谅我!(搞笑版)',
  'sincere': '对不起,这件事我做得不好,我会改正。',
  'shameless': '其实也没多大事嘛,别生气了。',
  'legal-cold': '兹就相关事宜声明,本事件不构成责任。',
  'silent-treatment': '嗯。',
};

export const handlers = [
  http.post('*/api/gen', async ({ request }) => {
    const body = (await request.json()) as { situation: string };
    if (body.situation.includes('弄死')) {
      return HttpResponse.json({ error: 'real-person', message: '拒绝' }, { status: 422 });
    }
    return HttpResponse.json({ letters: FAKE_LETTERS, meta: { model: 'workers-ai', latency_ms: 1 } });
  }),
];
