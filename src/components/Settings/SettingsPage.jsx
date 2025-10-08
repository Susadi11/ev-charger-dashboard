import React, { useState } from 'react';
import SettingsForm from './SettingsForm';

const SettingsPage = ({ settings: initialSettings, handleSave }) => {
  const [settings, setSettings] = useState(
    initialSettings || {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      fromEmail: 'noreply@evcharging.com',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      sessionTimeout: '30',
      cancellationHours: '2',
      chargingRate: '25.50'
    }
  );

  const [saved, setSaved] = useState(false);

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    handleSave && handleSave(newSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">System Settings</h1>
          <p className="mt-2 text-sm text-slate-500">
            Fine-tune notifications, sessions, and charging preferences with a refined touch.
          </p>
        </section>

        {saved && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 shadow-sm">
            Settings saved successfully!
          </div>
        )}

        <SettingsForm settings={settings} onSave={handleSettingsSave} />
      </div>
    </div>
  );
};

export default SettingsPage;
