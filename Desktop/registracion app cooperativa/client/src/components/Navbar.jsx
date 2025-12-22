import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Home, LayoutDashboard, UserPlus } from 'lucide-react';
import raiteLogo from '../assets/raite-logo.png';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Inicio', path: '/', icon: Home },
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Registro', path: '/register', icon: UserPlus },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <img
                                src={raiteLogo}
                                alt="RAITE Logo"
                                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300 animate-logo-10s rounded-md"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-2 font-semibold transition-all duration-200 px-3 py-2 rounded-xl ${isActive(link.path)
                                    ? 'text-orange-500 bg-orange-500/10'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-500/10 dark:hover:text-orange-400 dark:hover:bg-orange-500/20'
                                    }`}
                            >
                                <link.icon size={18} />
                                {link.name}
                            </Link>
                        ))}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-500 transition-all duration-300"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 dark:text-gray-300"
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-64 border-b dark:border-slate-800' : 'max-h-0'}`}>
                <div className="px-4 pt-2 pb-6 space-y-2 bg-white dark:bg-slate-950 shadow-xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive(link.path)
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <link.icon size={20} />
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
