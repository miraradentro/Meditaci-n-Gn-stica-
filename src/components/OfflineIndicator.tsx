import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-lg border border-[#D6CEBE] bg-[#78350F] px-3.5 py-2 text-xs font-medium text-[#FBF9F5] shadow-md">
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      <span>Modo sin conexión activo · Reproduciendo audios desde memoria local</span>
    </div>
  );
};
