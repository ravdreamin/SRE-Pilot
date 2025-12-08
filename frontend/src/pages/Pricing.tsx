import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';

const Pricing = () => {
    return (
        <Container sx={{ pt: 15 }}>
            <Typography variant="h2" component="h1" align="center" gutterBottom>
                Simple, Transparent Pricing
            </Typography>
            <Grid container spacing={4} sx={{ mt: 4 }}>
                {[
                    { title: 'Community', price: '$0', features: ['10 Queries / Day', 'Gemini 2.5 Flash Model', 'Local Audit Log', 'Community Support'] },
                    { title: 'Pro', price: '$49', features: ['Unlimited Queries', 'Gemini 2.5 Pro Model', 'Priority Watchtower', 'Email Support'] },
                    { title: 'Enterprise', price: 'Custom', features: ['Custom Models', 'SSO / SAML', 'SLA Guarantee', 'Dedicated Solutions Engineer'] }
                ].map((tier) => (
                    <Grid item xs={12} md={4} key={tier.title}>
                        <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center' }} elevation={3}>
                            <Typography variant="h4" component="h2" gutterBottom>{tier.title}</Typography>
                            <Typography variant="h3" color="primary" sx={{ my: 2 }}>{tier.price}</Typography>
                            <Box sx={{ flexGrow: 1 }}>
                                {tier.features.map(f => (
                                    <Typography key={f} variant="body1" sx={{ my: 1 }}>{f}</Typography>
                                ))}
                            </Box>
                            <Button variant="contained" sx={{ mt: 3 }}>Choose Plan</Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Pricing;
