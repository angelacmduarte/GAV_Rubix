import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RefreshButton from '../RefreshButton';
import api from '../../services/api';

jest.mock('../../services/api');

describe('RefreshButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders refresh button with last update time', async () => {
    api.getSystemStatus.mockResolvedValue({
      last_automatic_run: {
        completed_at: '2025-11-17T10:00:00Z'
      }
    });

    render(<RefreshButton />);

    expect(screen.getByText('Atualizar agora')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/Última atualização:/)).toBeInTheDocument();
    });
  });

  it('triggers refresh on button click', async () => {
    const user = userEvent.setup();
    const onRefreshComplete = jest.fn();

    api.getSystemStatus.mockResolvedValue({});
    api.triggerIngestion.mockResolvedValue({
      success: true,
      rows_imported: 100
    });

    render(<RefreshButton onRefreshComplete={onRefreshComplete} />);

    const button = screen.getByText('Atualizar agora');
    await user.click(button);

    expect(api.triggerIngestion).toHaveBeenCalledWith(null, 'user');
    
    await waitFor(() => {
      expect(onRefreshComplete).toHaveBeenCalled();
    });
  });

  it('shows loading state during refresh', async () => {
    const user = userEvent.setup();

    api.getSystemStatus.mockResolvedValue({});
    api.triggerIngestion.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );

    render(<RefreshButton />);

    const button = screen.getByText('Atualizar agora');
    await user.click(button);

    expect(screen.getByText('Atualizando...')).toBeInTheDocument();
  });
});

