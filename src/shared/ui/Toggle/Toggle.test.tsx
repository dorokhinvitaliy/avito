import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders with label', () => {
    const onChange = vi.fn();
    render(<Toggle label="Enable feature" checked={false} onChange={onChange} />);
    expect(screen.getByText('Enable feature')).toBeInTheDocument();
  });

  it('renders in checked state', () => {
    const onChange = vi.fn();
    render(<Toggle label="On" checked={true} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('renders in unchecked state', () => {
    const onChange = vi.fn();
    render(<Toggle label="Off" checked={false} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('calls onChange when clicked', () => {
    const onChange = vi.fn();
    render(<Toggle label="Test" checked={false} onChange={onChange} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
