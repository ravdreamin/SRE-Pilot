import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Docs from './pages/Docs';
import Pricing from './pages/Pricing';
import SignIn from './pages/SignIn';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
