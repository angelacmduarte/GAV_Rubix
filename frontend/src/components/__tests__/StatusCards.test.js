import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StatusCards from '../StatusCards';
import api from '../../services/api';

jest.mock('../../services/api');

describe('StatusCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders status cards with system information', async () => {
    api.getSystemStatus.mockResolvedValue({
      last_automatic_run: {
        started_at: '2025-11-17T07:00:00Z',
        status: 'success',
        duration_seconds: 45.5,
        rows_imported: 150
      },
      recent_alerts: [],
      themes_total: 4,
      themes_published: 2
    });

    render(<StatusCards />);

    await waitFor(() => {
      expect(screen.getByText('Rotina 07h')).toBeInTheDocument();
      expect(screen.getByText('Alertas Recentes')).toBeInTheDocument();
      expect(screen.getByText('Temas')).toBeInTheDocument();
    });

    expect(screen.getByText('2')).toBeInTheDocument(); // Published themes
    expect(screen.getByText('de 4 publicados')).toBeInTheDocument();
  });

  it('displays alerts when present', async () => {
    api.getSystemStatus.mockResolvedValue({
      last_automatic_run: null,
      recent_alerts: [
        {
          started_at: '2025-11-17T07:00:00Z',
          error_message: 'Falha ao conectar com SharePoint'
        }
      ],
      themes_total: 4,
      themes_published: 2
    });

    render(<StatusCards />);

    await waitFor(() => {
      expect(screen.getByText(/Falha ao conectar/)).toBeInTheDocument();
    });
  });
});

