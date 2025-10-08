import React, { useState } from 'react';
import SettingsForm from './SettingsForm';

const SettingsPage = ({ settings: initialSettings, handleSave }) => {
  const [settings, setSettings] = useState(initialSettings || {
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    fromEmail: 'noreply@evcharging.com',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    sessionTimeout: '30',
    cancellationHours: '2',
    chargingRate: '25.50'
  });
  
  const [saved, setSaved] = useState(false);
  
  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    handleSave && handleSave(newSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure system preferences and notifications</p>
      </div>
      
      {saved && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
          Settings saved successfully!
        </div>
      )}
      
      <SettingsForm settings={settings} onSave={handleSettingsSave} />
    </div>
  );
};

export default SettingsPage