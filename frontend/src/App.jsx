import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ActiveResponses from './pages/ActiveResponses';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Donate from './pages/Donate';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Training from './pages/Training';
import MapPage from './pages/MapPage'; // Still need to create this
import Tasks from './pages/Tasks';
import Unauthorized from './pages/Unauthorized';

import FakeDonationToast from './components/FakeDonationToast';

function App() {
  return (
    <div className="app">
      <FakeDonationToast />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/news" element={<ActiveResponses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/training" element={<Training />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/tasks" element={<Tasks />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Coordinator']} />}>
            <Route path="/resources" element={<Resources />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
