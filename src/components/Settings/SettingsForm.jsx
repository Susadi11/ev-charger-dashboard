import React, { useState } from 'react';
import Button from '../common/Button';

const inputClasses =
  'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/60';

const SettingsForm = ({ settings, onSave }) => {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleCheckboxChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.type === 'number' ? e.target.value : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="text-lg font-semibold text-slate-900">Email Configuration</h3>
        <p className="mt-1 text-sm text-slate-500">
          Keep transactional emails polished and reliable.
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              SMTP Host
            </label>
            <input
              type="text"
              value={formData.smtpHost}
              onChange={handleInputChange('smtpHost')}
              className={inputClasses}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
                SMTP Port
              </label>
              <input
                type="number"
                value={formData.smtpPort}
                onChange={handleInputChange('smtpPort')}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
                From Email
              </label>
              <input
                type="email"
                value={formData.fromEmail}
                onChange={handleInputChange('fromEmail')}
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="text-lg font-semibold text-slate-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-slate-500">
          Choose how operators and drivers stay in the loop.
        </p>
        <div className="mt-5 space-y-3">
          {[
            { field: 'emailNotifications', label: 'Enable email notifications' },
            { field: 'smsNotifications', label: 'Enable SMS notifications' },
            { field: 'pushNotifications', label: 'Enable push notifications' }
          ].map((option) => (
            <label key={option.field} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <input
                type="checkbox"
                checked={formData[option.field]}
                onChange={handleCheckboxChange(option.field)}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm text-slate-600">{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="text-lg font-semibold text-slate-900">System Settings</h3>
        <p className="mt-1 text-sm text-slate-500">
          Define the guardrails for every charging experience.
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={formData.sessionTimeout}
              onChange={handleInputChange('sessionTimeout')}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Cancellation Allowed (hours before)
            </label>
            <input
              type="number"
              value={formData.cancellationHours}
              onChange={handleInputChange('cancellationHours')}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
              Default Charging Rate (per kWh)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.chargingRate}
              onChange={handleInputChange('chargingRate')}
              className={inputClasses}
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Save Settings
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
