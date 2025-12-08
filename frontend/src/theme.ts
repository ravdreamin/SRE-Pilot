import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
            contrastText: '#000000',
        },
        background: {
            default: '#000000',
            paper: '#0a0a0a',
        },
        text: {
            primary: '#ededed',
            secondary: '#a1a1aa', // Zinc-400 equivalent
        },
        divider: '#27272a', // Zinc-800
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: {
            fontWeight: 800,
            fontSize: '4.5rem',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '-0.03em',
        },
        button: {
            fontWeight: 500,
            textTransform: 'none',
            fontSize: '0.925rem',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    fontWeight: 600,
                    textTransform: 'none',
                    padding: '10px 24px',
                    transition: 'all 0.15s ease',
                },
                contained: {
                    backgroundColor: '#fff',
                    color: '#000',
                    boxShadow: '0 0 0 1px transparent', // Placeholder for interaction
                    '&:hover': {
                        backgroundColor: '#f2f2f2',
                        boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
                    },
                },
                outlined: {
                    borderColor: '#3f3f46', // Zinc-700
                    color: '#ededed',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderColor: '#52525b', // Zinc-600
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #27272a', // Zinc-800
                    boxShadow: 'none',
                },
            },
        },
    },
});

export default theme;
