import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import { AppProvider } from './context/AppContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function AnimatedRoutes() {
  const location = useLocation();
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div {...pageTransition}><Dashboard /></motion.div>} />
        <Route path="/products" element={<motion.div {...pageTransition}><Products /></motion.div>} />
        <Route path="/orders" element={<motion.div {...pageTransition}><Orders /></motion.div>} />
        <Route path="/transactions" element={<motion.div {...pageTransition}><Transactions /></motion.div>} />
        <Route path="/reports" element={<motion.div {...pageTransition}><Reports /></motion.div>} />
        <Route path="/alerts" element={<motion.div {...pageTransition}><Alerts /></motion.div>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <AppProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Router>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ marginLeft: 220, padding: 20, flexGrow: 1 }}>
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App;
