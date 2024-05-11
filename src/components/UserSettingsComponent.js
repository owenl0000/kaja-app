import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

function UserSettingsComponent() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    async function fetchSettings() {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    }
    if (session) {
      fetchSettings();
    }
  }, [session]);

  const handleUpdateSettings = async (newSettings) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ settings: newSettings }),
    });
    const updatedSettings = await res.json();
    setSettings(updatedSettings);
  };

  // Ensure to check if session exists to handle unauthorized states
  if (!session) return <p>Please log in to manage your settings.</p>;

  return (
    <div>
      <h1>User Settings</h1>
      {/* Render and allow updates to settings */}
    </div>
  );
}

export default UserSettingsComponent;
