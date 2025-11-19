import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeCard from '../ThemeCard';
import api from '../../services/api';

jest.mock('../../services/api');

const mockTheme = {
  id: 1,
  name: 'Trabalho Híbrido',
  description: 'Relatório de trabalho híbrido',
  status: 'draft',
  display_order: 1,
  data_sources: [
    {
      id: 1,
      sharepoint_url: 'https://example.sharepoint.com/file1.xlsx',
      source_name: 'Fonte 1',
      sheets_count: 2,
      rows_count: 150,
      last_read_at: '2025-11-17T10:00:00Z'
    }
  ]
};

describe('ThemeCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders theme card with basic information', () => {
    render(<ThemeCard theme={mockTheme} />);

    expect(screen.getByText('Trabalho Híbrido')).toBeInTheDocument();
    expect(screen.getByText('Relatório de trabalho híbrido')).toBeInTheDocument();
    expect(screen.getByText('draft')).toBeInTheDocument();
  });

  it('displays data sources', () => {
    render(<ThemeCard theme={mockTheme} />);

    expect(screen.getByText(/Fontes de Dados/)).toBeInTheDocument();
  });

  it('allows adding new data source', async () => {
    const user = userEvent.setup();
    api.addDataSource.mockResolvedValue({
      id: 2,
      sharepoint_url: 'https://example.sharepoint.com/file2.xlsx',
      read_info: {
        sheets: ['Sheet1', 'Sheet2'],
        rows_count: 200,
        sheets_detail: { Sheet1: 100, Sheet2: 100 }
      }
    });

    render(<ThemeCard theme={mockTheme} />);

    // Expand accordion
    const expandButton = screen.getByLabelText(/expand/i);
    await user.click(expandButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/URL do SharePoint/i)).toBeInTheDocument();
    });

    const urlInput = screen.getByLabelText(/URL do SharePoint/i);
    await user.type(urlInput, 'https://example.sharepoint.com/file2.xlsx');

    const addButton = screen.getByText('Adicionar');
    await user.click(addButton);

    await waitFor(() => {
      expect(api.addDataSource).toHaveBeenCalledWith(1, expect.objectContaining({
        sharepoint_url: 'https://example.sharepoint.com/file2.xlsx'
      }));
    });
  });

  it('handles test button click', async () => {
    const user = userEvent.setup();
    api.runTest.mockResolvedValue({
      status: 'passed',
      duration_seconds: 5.2
    });

    render(<ThemeCard theme={mockTheme} />);

    const testButton = screen.getByText('Testar');
    await user.click(testButton);

    expect(api.runTest).toHaveBeenCalledWith(1, null);
  });

  it('handles publish button click', async () => {
    const user = userEvent.setup();
    api.canPublish.mockResolvedValue({ can_publish: true, reason: 'All tests passed' });
    api.publishTheme.mockResolvedValue({
      success: true,
      theme: { ...mockTheme, status: 'published' }
    });

    render(<ThemeCard theme={mockTheme} />);

    const publishButton = screen.getByText('Publicar');
    await user.click(publishButton);

    await waitFor(() => {
      expect(api.canPublish).toHaveBeenCalledWith(1);
      expect(api.publishTheme).toHaveBeenCalledWith(1, 'user');
    });
  });
});

