import React, { useCallback, useRef, useState } from 'react';

interface FileDropZoneProps {
  readonly onFile: (file: File, content: string) => void;
  readonly accept?: string;
  readonly label?: string;
  readonly disabled?: boolean;
}

export function FileDropZone({
  onFile,
  accept = '.json,application/json',
  label = 'Drop a JSON file here, or click to browse',
  disabled = false,
}: FileDropZoneProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          onFile(file, content);
        }
      };
      reader.readAsText(file);
    },
    [onFile],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = event.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [disabled, processFile],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) processFile(file);
      if (inputRef.current) inputRef.current.value = '';
    },
    [processFile],
  );

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') handleClick();
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      aria-label={label}
      style={{
        border: `2px dashed ${isDragging ? '#228be6' : '#495057'}`,
        borderRadius: 8,
        padding: '32px 16px',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: isDragging ? 'rgba(34,139,230,0.1)' : 'rgba(255,255,255,0.02)',
        color: disabled ? '#555' : '#adb5bd',
        transition: 'all 0.2s',
        outline: 'none',
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
      <div style={{ fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 12, marginTop: 4, color: '#555' }}>Supports: {accept}</div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}
