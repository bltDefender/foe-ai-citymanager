import React from 'react';

type StatusType = 'connected' | 'disconnected' | 'warning' | 'error' | 'idle';

interface StatusBadgeProps {
  readonly status: StatusType;
  readonly label?: string;
}

const STATUS_COLORS: Record<StatusType, string> = {
  connected: '#40c057',
  disconnected: '#868e96',
  warning: '#fab005',
  error: '#fa5252',
  idle: '#4dabf7',
};

const STATUS_LABELS: Record<StatusType, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  warning: 'Warning',
  error: 'Error',
  idle: 'Idle',
};

export function StatusBadge({ status, label }: StatusBadgeProps): React.ReactElement {
  const color = STATUS_COLORS[status];
  const text = label ?? STATUS_LABELS[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500,
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {text}
    </span>
  );
}
