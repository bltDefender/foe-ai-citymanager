import React from 'react';

interface LoadingOverlayProps {
  readonly visible: boolean;
  readonly message?: string;
}

export function LoadingOverlay({ visible, message = 'Loading...' }: LoadingOverlayProps): React.ReactElement | null {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        borderRadius: 4,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid #444',
          borderTopColor: '#228be6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: 12,
        }}
      />
      <span style={{ color: '#c1c2c5', fontSize: 14 }}>{message}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
