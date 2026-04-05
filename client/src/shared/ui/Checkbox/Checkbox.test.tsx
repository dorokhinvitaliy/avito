import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Accept terms" checked={false} onChange={onChange} />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('renders checked state correctly', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Checked" checked={true} onChange={onChange} />);
    expect(screen.getByLabelText('Checked')).toBeChecked();
  });

  it('renders unchecked state correctly', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Unchecked" checked={false} onChange={onChange} />);
    expect(screen.getByLabelText('Unchecked')).not.toBeChecked();
  });

  it('calls onChange with true when clicked from unchecked', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Test" checked={false} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('Test'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when clicked from checked', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Test" checked={true} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('Test'));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
