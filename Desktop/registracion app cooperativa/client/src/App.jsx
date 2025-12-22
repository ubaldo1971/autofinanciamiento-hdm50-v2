import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import MainLayout from './layouts/MainLayout';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Community, Services, Governance, Profile } from './pages/SecondaryPages';

const Login = () => <div className="p-4 transition-all duration-300 dark:text-gray-100">Login (WIP)</div>;

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/community" element={<Community />} />
                <Route path="/services" element={<Services />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
