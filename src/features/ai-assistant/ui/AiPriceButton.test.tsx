import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AiPriceButton } from './AiPriceButton';
import * as ollamaApi from '../api/ollamaApi';

vi.mock('../api/ollamaApi');

const mockSuggestMarketPrice = ollamaApi.suggestMarketPrice as ReturnType<typeof vi.fn>;

describe('AiPriceButton', () => {
  const defaultProps = {
    title: 'Test Item',
    category: 'electronics' as const,
    params: {},
    onApply: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders button with correct label', () => {
    render(<AiPriceButton {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Узнать рыночную цену' })).toBeInTheDocument();
  });

  it('shows loading state when request is in progress', async () => {
    mockSuggestMarketPrice.mockImplementation(() => new Promise(() => {}));

    render(<AiPriceButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Выполняется запрос')).toBeInTheDocument();
    });
  });

  it('shows result tooltip when request succeeds', async () => {
    mockSuggestMarketPrice.mockResolvedValue('Рекомендуемая цена: 15 000 ₽');

    render(<AiPriceButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Рекомендуемая цена: 15 000 ₽')).toBeInTheDocument();
    });
  });

  it('shows error tooltip when request fails', async () => {
    mockSuggestMarketPrice.mockRejectedValue(new Error('API Error'));

    render(<AiPriceButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Произошла ошибка при запросе к AI')).toBeInTheDocument();
    });
  });

  it('parses and applies price from result', async () => {
    mockSuggestMarketPrice.mockResolvedValue('Рекомендуемая цена: 15000');

    render(<AiPriceButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Применить' }));
    });

    expect(defaultProps.onApply).toHaveBeenCalledWith(15000);
  });

  it('handles spaced numbers correctly', async () => {
    mockSuggestMarketPrice.mockResolvedValue('Цена: 15 000 рублей');

    render(<AiPriceButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Применить' }));
    });

    expect(defaultProps.onApply).toHaveBeenCalledWith(15000);
  });

  it('filters out years from price parsing', async () => {
    mockSuggestMarketPrice.mockResolvedValue('Цена: 15000, год: 2023');

    render(<AiPriceButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Применить' }));
    });

    expect(defaultProps.onApply).toHaveBeenCalledWith(15000);
  });

  it('shows repeat request label after completion', async () => {
    mockSuggestMarketPrice.mockResolvedValue('15000');

    render(<AiPriceButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Повторить запрос')).toBeInTheDocument();
    });
  });

  it('closes tooltip when close button is clicked', async () => {
    mockSuggestMarketPrice.mockResolvedValue('15000');

    render(<AiPriceButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('15000')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));

    await waitFor(() => {
      expect(screen.queryByText('15000')).not.toBeInTheDocument();
    });
  });

  it('does not call onApply when no valid price in result', async () => {
    mockSuggestMarketPrice.mockResolvedValue('No price mentioned');

    render(<AiPriceButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Применить' }));
    });

    expect(defaultProps.onApply).not.toHaveBeenCalled();
  });
});
