export const Colors = {
  primary: {
    main: '#3c8dbc',
    light: '#80b5d3',
    dark: '#357ca5',
  },
  danger: '#f56954',
  success: '#00a65a',
  warning: '#f39c12',
  info: '#00c0ef',
  navy: '#001F3F',
  background: '#f4f6f9',
  inputBg: '#e2e4e9',
  white: '#ffffff',
  gray: {
    100: '#f5f7fa',
    200: '#e2e4e9',
    300: '#DDE2E8',
    400: '#999',
    500: '#666',
    600: '#555',
    700: '#444',
  },
} as const;

export const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case 'En Progreso':
      return Colors.info;
    case 'Completado':
      return Colors.success;
    case 'Suspendido':
      return Colors.warning;
    default:
      return Colors.primary.main;
  }
};