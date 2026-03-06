import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import Altar from './pages/Altar';
import Hub from './pages/Hub';
import Manage from './pages/Manage';
import AddMemorial from './pages/AddMemorial';
import MemorialDetail from './pages/MemorialDetail';
import { AppProvider } from './context/AppContext';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<Altar />} />
          <Route path="/hub" element={<Hub />} />
        </Route>
        <Route path="/manage" element={<Manage />} />
        <Route path="/add" element={<AddMemorial />} />
        <Route path="/edit/:id" element={<AddMemorial />} />
        <Route path="/memorial/:id" element={<MemorialDetail />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

