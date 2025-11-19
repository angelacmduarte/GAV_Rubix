/**
 * API service for backend communication
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/admin';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Verificar se a resposta é JSON válida
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(
          `Servidor retornou resposta não-JSON. ` +
          `Verifique se o backend está rodando em http://127.0.0.1:5000. ` +
          `Resposta: ${text.substring(0, 100)}`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Melhorar mensagem de erro para problemas de conexão
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error(
          'Não foi possível conectar ao servidor. ' +
          'Verifique se o backend está rodando em http://127.0.0.1:5000'
        );
      }
      
      if (error.message.includes('Proxy erro') || error.message.includes('Unexpected token')) {
        throw new Error(
          'Erro de comunicação com o servidor. ' +
          'Verifique se o backend Flask está rodando. ' +
          'Execute: cd backend && python run.py'
        );
      }
      
      throw error;
    }
  }

  // Themes
  async getThemes() {
    return this.request('/themes');
  }

  async getTheme(themeId) {
    return this.request(`/themes/${themeId}`);
  }

  async createTheme(themeData) {
    return this.request('/themes', {
      method: 'POST',
      body: themeData
    });
  }

  async updateTheme(themeId, themeData) {
    return this.request(`/themes/${themeId}`, {
      method: 'PUT',
      body: themeData
    });
  }

  async deleteTheme(themeId) {
    return this.request(`/themes/${themeId}`, {
      method: 'DELETE'
    });
  }

  // Data Sources
  async addDataSource(themeId, dataSource) {
    return this.request(`/themes/${themeId}/data-sources`, {
      method: 'POST',
      body: dataSource
    });
  }

  async updateDataSource(dataSourceId, dataSource) {
    return this.request(`/data-sources/${dataSourceId}`, {
      method: 'PUT',
      body: dataSource
    });
  }

  async deleteDataSource(dataSourceId) {
    return this.request(`/data-sources/${dataSourceId}`, {
      method: 'DELETE'
    });
  }

  // Ingestion
  async triggerIngestion(themeId = null, triggeredBy = 'system') {
    return this.request('/ingest', {
      method: 'POST',
      body: {
        theme_id: themeId,
        triggered_by: triggeredBy
      }
    });
  }

  // Tests
  async runTest(themeId, testParams = null) {
    return this.request(`/themes/${themeId}/test`, {
      method: 'POST',
      body: { test_params: testParams }
    });
  }

  async recordManualTest(themeId, triggeredBy, passed = true, notes = null) {
    return this.request(`/themes/${themeId}/test/manual`, {
      method: 'POST',
      body: {
        triggered_by: triggeredBy,
        passed,
        notes
      }
    });
  }

  async canPublish(themeId) {
    return this.request(`/themes/${themeId}/can-publish`);
  }

  async publishTheme(themeId, publishedBy) {
    return this.request(`/themes/${themeId}/publish`, {
      method: 'POST',
      body: { published_by: publishedBy }
    });
  }

  // Status & History
  async getSystemStatus() {
    return this.request('/status');
  }

  async getIngestionRuns(themeId = null, limit = 50, status = null) {
    const params = new URLSearchParams();
    if (themeId) params.append('theme_id', themeId);
    if (limit) params.append('limit', limit);
    if (status) params.append('status', status);
    
    return this.request(`/ingestion-runs?${params.toString()}`);
  }

  async getTestRuns(themeId = null, limit = 50, status = null) {
    const params = new URLSearchParams();
    if (themeId) params.append('theme_id', themeId);
    if (limit) params.append('limit', limit);
    if (status) params.append('status', status);
    
    return this.request(`/test-runs?${params.toString()}`);
  }

  // Tribes and Squads
  async getTribes(includeSquads = false) {
    const params = new URLSearchParams({ active_only: 'true' });
    if (includeSquads) params.append('include_squads', 'true');
    return this.request(`/tribes?${params.toString()}`);
  }

  async getTribe(tribeId) {
    return this.request(`/tribes/${tribeId}`);
  }

  async getSquads(tribeId = null, includeTribe = false) {
    const params = new URLSearchParams({ active_only: 'true' });
    if (tribeId) params.append('tribe_id', tribeId);
    if (includeTribe) params.append('include_tribe', 'true');
    return this.request(`/squads?${params.toString()}`);
  }

  async getSquad(squadId) {
    return this.request(`/squads/${squadId}`);
  }
}

export default new ApiService();

