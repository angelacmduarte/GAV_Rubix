import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Navigation Context
 * Gerencia estado global de navegação, sessões ativas e filtros
 */
const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

/**
 * Navigation Provider
 * Fornece contexto de navegação para toda a aplicação
 */
export const NavigationProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Estado da sessão atual
  const [currentSession, setCurrentSession] = useState('admin');
  
  // Filtros globais (será usado na Fase 3)
  const [filters, setFilters] = useState({
    tribe: null,
    squad: null,
    theme: null
  });

  // Breadcrumbs customizados (pode ser sobrescrito por páginas específicas)
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState(null);

  // Mapeamento de rotas para sessões
  const sessionMap = {
    '/': 'admin',
    '/admin': 'admin',
    '/managers': 'managers',
    '/reports': 'reports',
    '/gav': 'gav'
  };

  // Atualizar sessão atual baseado na rota
  useEffect(() => {
    const session = sessionMap[location.pathname] || 'admin';
    setCurrentSession(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Navegar para uma sessão específica
  const navigateToSession = (sessionId) => {
    const routeMap = {
      admin: '/admin',
      managers: '/managers',
      reports: '/reports',
      gav: '/gav'
    };
    
    const route = routeMap[sessionId];
    if (route) {
      navigate(route);
    }
  };

  // Atualizar filtros
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      tribe: null,
      squad: null,
      theme: null
    });
  };

  // Definir breadcrumbs customizados
  const setBreadcrumbs = (items) => {
    setCustomBreadcrumbs(items);
  };

  // Limpar breadcrumbs customizados
  const clearBreadcrumbs = () => {
    setCustomBreadcrumbs(null);
  };

  const value = {
    // Estado
    currentSession,
    filters,
    customBreadcrumbs,
    
    // Ações
    navigateToSession,
    updateFilters,
    clearFilters,
    setBreadcrumbs,
    clearBreadcrumbs,
    
    // Utilitários
    location,
    navigate
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;

