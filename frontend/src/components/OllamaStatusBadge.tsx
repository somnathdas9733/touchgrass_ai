import React from 'react';
import { Cpu, WifiOff } from 'lucide-react';
import type { OllamaStatus } from '../types';

interface Props {
  status: OllamaStatus | null;
  loading: boolean;
  onRefresh: () => void;
}

export const OllamaStatusBadge: React.FC<Props> = ({ status, loading, onRefresh }) => {
  const isOnline = status?.ollama_connected ?? false;
  const modelName = status?.active_model || 'gemma4:latest';

  return (
    <div
      onClick={onRefresh}
      title="Click to check Ollama connection status"
      style={{ cursor: 'pointer' }}
      className="status-pill"
    >
      <div className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
      <span style={{ color: isOnline ? '#a7f3d0' : '#fcd34d', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {isOnline ? (
          <>
            <Cpu size={13} style={{ color: '#34d399' }} />
            <span>{modelName}</span>
          </>
        ) : (
          <>
            <WifiOff size={13} style={{ color: '#f59e0b' }} />
            <span>{loading ? 'Checking Ollama...' : 'Ollama Offline (Using Fallback)'}</span>
          </>
        )}
      </span>
    </div>
  );
};
