import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Breadcrumbs,
  Link,
  Typography,
  Box
} from '@mui/material';
import {
  Home as HomeIcon
} from '@mui/icons-material';
import { colors } from '../../theme/palette';

/**
 * Contextual Breadcrumbs Component
 * Breadcrumbs dinâmicos baseados na rota atual
 */
const ContextualBreadcrumbs = ({ items = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Mapeamento de rotas para breadcrumbs
  const routeMap = {
    '/': [{ label: 'GAV Rubix', path: '/' }],
    '/admin': [
      { label: 'GAV Rubix', path: '/' },
      { label: 'Admin Console', path: '/admin' }
    ],
    '/managers': [
      { label: 'GAV Rubix', path: '/' },
      { label: 'Dashboards Gestores', path: '/managers' }
    ],
    '/reports': [
      { label: 'GAV Rubix', path: '/' },
      { label: 'Relatórios', path: '/reports' }
    ],
    '/gav': [
      { label: 'GAV Rubix', path: '/' },
      { label: 'GAV Rubix Dashboards', path: '/gav' }
    ]
  };

  // Se items foram fornecidos, usar eles; caso contrário, usar o mapeamento
  const breadcrumbItems = items || routeMap[location.pathname] || [
    { label: 'GAV Rubix', path: '/' }
  ];

  const handleClick = (event, path) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator="›"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: colors.azulMarinho,
            fontWeight: 600
          }
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          if (isLast) {
            return (
              <Typography
                key={item.path}
                color="text.primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: colors.azulMarinho,
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
              >
                {index === 0 && <HomeIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />}
                {item.label}
              </Typography>
            );
          }
          
          return (
            <Link
              key={item.path}
              color="inherit"
              href={item.path}
              onClick={(e) => handleClick(e, item.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: colors.azulTeal,
                textDecoration: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  textDecoration: 'underline',
                  color: colors.azulVioleta
                }
              }}
            >
              {index === 0 && <HomeIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />}
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default ContextualBreadcrumbs;

