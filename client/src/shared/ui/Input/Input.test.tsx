import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('renders without label when not provided', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    render(<Input label="Test" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error prop is provided', () => {
    render(<Input label="Test" error="Error" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with correct type', () => {
    render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('renders with suffix when provided', () => {
    const suffix = <span data-testid="input-suffix">Icon</span>;
    render(<Input suffix={suffix} />);
    expect(screen.getByTestId('input-suffix')).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn();
    render(<Input value="test" onChange={vi.fn()} onClear={onClear} />);

    fireEvent.click(screen.getByRole('button', { name: 'Очистить' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('shows required indicator when required is true', () => {
    render(<Input label="Required Field" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
