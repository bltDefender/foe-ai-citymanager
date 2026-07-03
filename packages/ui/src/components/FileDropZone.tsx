import React, { useCallback, useRef, useState } from 'react';

interface FileDropZoneProps {
  readonly onFile: (file: File, content: string) => void;
  readonly onError?: (error: string) => void;
  readonly accept?: string;
  readonly label?: string;
  readonly disabled?: boolean;
}

export function FileDropZone({
  onFile,
  onError,
  accept = '.json,application/json',
  label = 'Drop a JSON file here, or click to browse',
  disabled = false,
}: FileDropZoneProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const processFile = useCallback(
    (file: File) => {
      setIsLoading(true);
      setProgress(0);
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      reader.onerror = () => {
        const message = reader.error?.message ?? 'Failed to read file';
        setIsLoading(false);
        setProgress(0);
        onError?.(message);
      };
      reader.onload = (event) => {
        setIsLoading(false);
        const content = event.target?.result;
        if (typeof content === 'string') {
          onFile(file, content);
        }
      };
      reader.readAsText(file);
    },
    [onFile, onError],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (disabled || isLoading) return;
      const file = event.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [disabled, isLoading, processFile],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled && !isLoading) setIsDragging(true);
    },
    [disabled, isLoading],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && !isLoading) inputRef.current?.click();
  }, [disabled, isLoading]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) processFile(file);
      if (inputRef.current) inputRef.current.value = '';
    },
    [processFile],
  );

  const isInteractive = !disabled && !isLoading;

  return (
    <div
      role="button"
      tabIndex={isInteractive ? 0 : -1}
      aria-busy={isLoading}
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
        cursor: isInteractive ? 'pointer' : 'not-allowed',
        background: isDragging ? 'rgba(34,139,230,0.1)' : 'rgba(255,255,255,0.02)',
        color: isInteractive ? '#adb5bd' : '#555',
        transition: 'all 0.2s',
        outline: 'none',
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
      <div style={{ fontSize: 14 }}>{label}</div>
      {isLoading ? (
        <div style={{ marginTop: 12 }}>
          {progress > 0 && (
            <div
              style={{
                background: '#333',
                borderRadius: 4,
                height: 6,
                overflow: 'hidden',
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  background: '#228be6',
                  height: '100%',
                  width: `${progress}%`,
                  transition: 'width 0.2s',
                }}
              />
            </div>
          )}
          <div style={{ fontSize: 12, color: '#adb5bd' }}>
            {progress === 0
              ? 'Reading file\u2026'
              : progress < 100
                ? `Reading\u2026 ${progress}%`
                : 'Done reading\u2026'}
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 12, marginTop: 4, color: '#555' }}>Supports: {accept}</div>
      )}
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
