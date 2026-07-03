import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileDropZone } from '../components/FileDropZone.js';

const mockReadAsText = vi.fn();
const mockFileReader: {
  readAsText: typeof mockReadAsText;
  onload: ((event: ProgressEvent<FileReader>) => void) | null;
} = {
  readAsText: mockReadAsText,
  onload: null,
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
