import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AiTooltip } from './AiTooltip';

describe('AiTooltip', () => {
  const defaultProps = {
    content: 'Test content',
    onClose: () => {},
    onApply: () => {},
  };

  it('renders content correctly', () => {
    render(<AiTooltip {...defaultProps} />);
    expect(screen.getByText('Ответ AI:')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders apply and close buttons', () => {
    render(<AiTooltip {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Применить' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
  });

  it('calls onApply when apply button is clicked', () => {
    const onApply = vi.fn();
    render(<AiTooltip {...defaultProps} onApply={onApply} />);

    fireEvent.click(screen.getByRole('button', { name: 'Применить' }));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<AiTooltip {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render apply button when onApply is not provided', () => {
    render(<AiTooltip {...defaultProps} onApply={undefined} />);
    expect(screen.queryByRole('button', { name: 'Применить' })).not.toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    render(<AiTooltip {...defaultProps} isError={true} />);
    expect(screen.getByText('Произошла ошибка при запросе к AI')).toBeInTheDocument();
    expect(
      screen.getByText('Попробуйте повторить запрос или закройте уведомление'),
    ).toBeInTheDocument();
  });

  it('does not render apply button in error state', () => {
    render(<AiTooltip {...defaultProps} isError={true} />);
    expect(screen.queryByRole('button', { name: 'Применить' })).not.toBeInTheDocument();
  });

  it('uses custom apply label when provided', () => {
    render(<AiTooltip {...defaultProps} applyLabel="Custom Apply" />);
    expect(screen.getByRole('button', { name: 'Custom Apply' })).toBeInTheDocument();
  });
});
