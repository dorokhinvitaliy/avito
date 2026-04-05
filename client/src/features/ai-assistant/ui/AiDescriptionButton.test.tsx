import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AiDescriptionButton } from './AiDescriptionButton';
import * as ollamaApi from '../api/ollamaApi';

vi.mock('../api/ollamaApi');

const mockGenerateDescription = ollamaApi.generateDescription as ReturnType<typeof vi.fn>;

describe('AiDescriptionButton', () => {
  const defaultProps = {
    title: 'Test Item',
    category: 'electronics' as const,
    price: 1000,
    params: {},
    onApply: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders button with correct initial label', () => {
    render(<AiDescriptionButton {...defaultProps} />);
    expect(screen.getByRole('button', { name: /придумать описание/i })).toBeInTheDocument();
  });

  it('renders improve description label when currentDescription exists', () => {
    render(<AiDescriptionButton {...defaultProps} currentDescription="Existing description" />);
    expect(screen.getByRole('button', { name: /улучшить описание/i })).toBeInTheDocument();
  });

  it('shows loading state when request is in progress', async () => {
    mockGenerateDescription.mockImplementation(() => new Promise(() => {}));

    render(<AiDescriptionButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Выполняется запрос')).toBeInTheDocument();
    });
  });

  it('shows result tooltip when request succeeds', async () => {
    mockGenerateDescription.mockResolvedValue('Generated description text');

    render(<AiDescriptionButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Generated description text')).toBeInTheDocument();
    });
  });

  it('shows error tooltip when request fails', async () => {
    mockGenerateDescription.mockRejectedValue(new Error('API Error'));

    render(<AiDescriptionButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Произошла ошибка при запросе к AI')).toBeInTheDocument();
    });
  });

  it('calls onApply with result when apply button is clicked', async () => {
    mockGenerateDescription.mockResolvedValue('New description');

    render(<AiDescriptionButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Применить' }));
    });

    expect(defaultProps.onApply).toHaveBeenCalledWith('New description');
  });

  it('shows repeat request label after completion', async () => {
    mockGenerateDescription.mockResolvedValue('Description');

    render(<AiDescriptionButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Повторить запрос')).toBeInTheDocument();
    });
  });

  it('closes tooltip when close button is clicked', async () => {
    mockGenerateDescription.mockResolvedValue('Description');

    render(<AiDescriptionButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));

    await waitFor(() => {
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });
  });
});
