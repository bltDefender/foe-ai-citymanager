import React, { useCallback, useState } from 'react';

interface JsonViewerProps {
  readonly data: unknown;
  readonly maxHeight?: number;
  readonly defaultCollapsed?: boolean;
}

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'number';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'key' : 'string';
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="json-${cls}">${match}</span>`;
    },
  );
}

export function JsonViewer({ data, maxHeight = 400, defaultCollapsed = false }: JsonViewerProps): React.ReactElement {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);
  const highlighted = syntaxHighlight(jsonString);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [jsonString]);

  return (
    <div style={{ position: 'relative', fontFamily: 'monospace', fontSize: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        <button
          onClick={() => setCollapsed((current) => !current)}
          style={{
            fontSize: 11,
            padding: '2px 8px',
            cursor: 'pointer',
            background: '#2c2e33',
            color: '#c1c2c5',
            border: '1px solid #444',
            borderRadius: 4,
          }}
        >
          {collapsed ? '▶ Expand' : '▼ Collapse'}
        </button>
        <button
          onClick={() => {
            void handleCopy();
          }}
          style={{
            fontSize: 11,
            padding: '2px 8px',
            cursor: 'pointer',
            background: '#2c2e33',
            color: copied ? '#40c057' : '#c1c2c5',
            border: '1px solid #444',
            borderRadius: 4,
          }}
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
      {!collapsed && (
        <pre
          style={{
            maxHeight,
            overflow: 'auto',
            background: '#1a1b1e',
            padding: 12,
            borderRadius: 4,
            border: '1px solid #2c2e33',
            margin: 0,
            color: '#c1c2c5',
          }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      )}
      <style>{`
        .json-key { color: #74c0fc; }
        .json-string { color: #69db7c; }
        .json-number { color: #ffa94d; }
        .json-boolean { color: #f783ac; }
        .json-null { color: #868e96; }
      `}</style>
    </div>
  );
}
