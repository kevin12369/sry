'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GenerateRequestSchema, type GenerateRequest, PERSONALITIES } from '@sry/shared';
import { Button } from './ui/button.js';
import { countChars } from '@/lib/wordCount.js';

const FormSchema = GenerateRequestSchema.extend({
  situation: z
    .string()
    .min(5, '至少 5 个字')
    .max(300, '最多 300 字'),
});

const PERSONALITY_LABELS = {
  sensitive: '敏感型(易察觉语气,需要共情)',
  direct: '直率型(反感绕弯,要结论)',
  cold: '冷淡型(简短事实,零情绪)',
} as const;

export function ApologyForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (r: GenerateRequest) => void;
}) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<GenerateRequest>({
    resolver: zodResolver(FormSchema),
    defaultValues: { situation: '', personality: 'direct' },
  });
  const situation = watch('situation') ?? '';
  const chars = countChars(situation);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="道歉输入">
      <div>
        <label htmlFor="situation" className="block text-sm font-medium text-slate-700">
          我做了什么
        </label>
        <textarea
          id="situation"
          rows={4}
          maxLength={300}
          placeholder="我做了什么"
          className="mt-1 w-full rounded border border-slate-300 p-2 text-sm focus:border-slate-500 focus:outline-none"
          {...register('situation')}
        />
        <div className="mt-1 flex justify-between text-xs">
          <span className="text-rose-600">{errors.situation?.message}</span>
          <span className={chars > 300 ? 'text-rose-600' : 'text-slate-500'}>{chars}/300</span>
        </div>
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-slate-700">对方性格</legend>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PERSONALITIES.map((p) => (
            <label key={p} className="flex items-start gap-2 rounded border border-slate-200 p-2 cursor-pointer hover:bg-slate-50">
              <input type="radio" value={p} {...register('personality')} className="mt-1" />
              <span className="text-sm">
                <span className="font-medium">{PERSONALITY_LABELS[p].split('(')[0]}</span>
                <span className="block text-xs text-slate-500">{PERSONALITY_LABELS[p].match(/\((.*)\)/)?.[1]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? '生成中…' : '生成 5 种风格'}
      </Button>
    </form>
  );
}
