import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders with label', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('renders without label when not provided', () => {
    render(<Textarea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    render(<Textarea label="Test" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders correctly when disabled', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
