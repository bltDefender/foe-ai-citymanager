import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileDropZone } from '../components/FileDropZone.js';

const mockReadAsText = vi.fn();
const mockFileReader: {
  readAsText: typeof mockReadAsText;
  onload: ((event: ProgressEvent<FileReader>) => void) | null;
  onerror: ((event: ProgressEvent<FileReader>) => void) | null;
  onprogress: ((event: ProgressEvent<FileReader>) => void) | null;
  error: DOMException | null;
} = {
  readAsText: mockReadAsText,
  onload: null,
  onerror: null,
  onprogress: null,
  error: null,
};

vi.stubGlobal(
  'FileReader',
  vi.fn(() => mockFileReader),
);

describe('FileDropZone', () => {
  it('renders with default label', () => {
    const { getByText } = render(<FileDropZone onFile={vi.fn()} />);
    expect(getByText(/Drop a JSON file here/)).toBeTruthy();
  });

  it('renders with custom label', () => {
    const { getByText } = render(<FileDropZone onFile={vi.fn()} label="Custom Label" />);
    expect(getByText('Custom Label')).toBeTruthy();
  });

  it('calls onFile when file is dropped', async () => {
    const onFile = vi.fn();
    const { container } = render(<FileDropZone onFile={onFile} />);

    const dropZone = container.firstChild as HTMLElement;
    const file = new File(['{"test": true}'], 'city.json', { type: 'application/json' });

    mockReadAsText.mockImplementation(function (this: typeof mockFileReader) {
      setTimeout(() => {
        if (this.onload) {
          this.onload({ target: { result: '{"test": true}' } } as unknown as ProgressEvent<FileReader>);
        }
      }, 0);
    });

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(mockReadAsText).toHaveBeenCalled();
  });

  it('calls onError when FileReader fails', async () => {
    const onFile = vi.fn();
    const onError = vi.fn();
    const { container } = render(<FileDropZone onFile={onFile} onError={onError} />);

    const dropZone = container.firstChild as HTMLElement;
    const file = new File(['{}'], 'city.json', { type: 'application/json' });

    mockReadAsText.mockImplementation(function (this: typeof mockFileReader) {
      setTimeout(() => {
        if (this.onerror) {
          this.onerror({} as ProgressEvent<FileReader>);
        }
      }, 0);
    });

    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(onError).toHaveBeenCalledWith('Failed to read file');
    expect(onFile).not.toHaveBeenCalled();
  });

  it('shows reading indicator while file is being loaded', async () => {
    const onFile = vi.fn();
    const { container, getByText } = render(<FileDropZone onFile={onFile} />);

    const dropZone = container.firstChild as HTMLElement;
    const file = new File(['{}'], 'city.json', { type: 'application/json' });

    // Do not resolve onload immediately so we can inspect the loading state
    mockReadAsText.mockImplementation(() => { /* pending */ });

    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

    // Component should show the "Reading file…" indicator
    expect(getByText('Reading file\u2026')).toBeTruthy();
    // Drop zone should be non-interactive while loading
    expect(dropZone.getAttribute('tabIndex')).toBe('-1');
    expect(dropZone.getAttribute('aria-busy')).toBe('true');
  });

  it('is accessible with keyboard', () => {
    const onFile = vi.fn();
    const { container } = render(<FileDropZone onFile={onFile} />);
    const dropZone = container.firstChild as HTMLElement;
    expect(dropZone.getAttribute('tabIndex')).toBe('0');
    expect(dropZone.getAttribute('role')).toBe('button');
  });

  it('is disabled when disabled prop is true', () => {
    const onFile = vi.fn();
    const { container } = render(<FileDropZone onFile={onFile} disabled />);
    const dropZone = container.firstChild as HTMLElement;
    expect(dropZone.getAttribute('tabIndex')).toBe('-1');
  });
});
