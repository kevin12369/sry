'use client';
import { SettingsPage } from '@/components/SettingsPage';
import { useSettings } from '@/hooks/useSettings';

export default function SettingsRoute() {
  const [settings, setSettings] = useSettings();
  return (
    <main className="min-h-screen bg-paper">
      <SettingsPage settings={settings} onChange={setSettings} />
    </main>
  );
}
