import { Container, Typography, Box, TextField, Button, Paper } from '@mui/material';

const SignIn = () => {
    return (
        <Container maxWidth="xs" sx={{ pt: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper sx={{ p: 4, width: '100%' }} elevation={3}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Sign In
                </Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default SignIn;
