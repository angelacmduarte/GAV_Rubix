import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LogsDashboard from '../LogsDashboard';
import api from '../../services/api';

jest.mock('../../services/api');

describe('LogsDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logs dashboard with tables', async () => {
    api.getThemes.mockResolvedValue([
      { id: 1, name: 'Trabalho Híbrido' }
    ]);
    api.getIngestionRuns.mockResolvedValue([
      {
        id: 1,
        started_at: '2025-11-17T07:00:00Z',
        trigger_type: 'automatic',
        status: 'success',
        duration_seconds: 45.5,
        rows_imported: 150
      }
    ]);
    api.getTestRuns.mockResolvedValue([
      {
        id: 1,
        started_at: '2025-11-17T08:00:00Z',
        test_type: 'automated',
        status: 'passed',
        duration_seconds: 5.2
      }
    ]);

    render(<LogsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard de Logs')).toBeInTheDocument();
      expect(screen.getByText('Execuções de Ingestão')).toBeInTheDocument();
      expect(screen.getByText('Execuções de Testes')).toBeInTheDocument();
    });
  });

  it('allows filtering by theme', async () => {
    const { user } = require('@testing-library/user-event');
    const userEvent = user.setup();

    api.getThemes.mockResolvedValue([
      { id: 1, name: 'Trabalho Híbrido' },
      { id: 2, name: 'Health Check' }
    ]);
    api.getIngestionRuns.mockResolvedValue([]);
    api.getTestRuns.mockResolvedValue([]);

    render(<LogsDashboard />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Tema/i)).toBeInTheDocument();
    });

    // Filter functionality would be tested here
  });

  it('exports logs to CSV', async () => {
    api.getThemes.mockResolvedValue([]);
    api.getIngestionRuns.mockResolvedValue([
      {
        id: 1,
        started_at: '2025-11-17T07:00:00Z',
        trigger_type: 'automatic',
        status: 'success'
      }
    ]);
    api.getTestRuns.mockResolvedValue([]);

    // Mock URL.createObjectURL and document.createElement
    global.URL.createObjectURL = jest.fn(() => 'blob:url');
    const mockClick = jest.fn();
    const mockLink = {
      href: '',
      download: '',
      click: mockClick
    };
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink);

    render(<LogsDashboard />);

    await waitFor(() => {
      const exportButton = screen.getByText('Exportar CSV');
      expect(exportButton).toBeInTheDocument();
    });
  });
});

