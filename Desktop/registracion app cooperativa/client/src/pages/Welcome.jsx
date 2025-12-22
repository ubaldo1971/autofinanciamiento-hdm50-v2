import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Handshake, Car, DollarSign, Vote, Shield, ChevronRight, Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, X, Wrench, CircleDollarSign, Truck, Building, Stethoscope } from 'lucide-react';
import choferesDuenosImg from '../assets/choferes-duenos.png';
import raiteLogo from '../assets/raite-logo.png';

const Welcome = () => {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const servicesData = [
        { icon: '🛞', label: 'Llantera', color: 'orange', desc: 'Neumáticos de calidad con montaje y balanceo GRATIS para socios.' },
        { icon: '🔧', label: 'Taller', color: 'blue', desc: 'Servicio mecánico integral con 30% de descuento en mano de obra.' },
        { icon: '🔩', label: 'Refacciones', color: 'red', desc: 'Autopartes a precios de flotilla (costo + 5%).' },
        { icon: '🏗️', label: 'Grúas', color: 'yellow', desc: 'Remolque y asistencia vial 24/7. 2 servicios gratis al año.' },
        { icon: '💰', label: 'Préstamos', color: 'green', desc: 'Liquidez inmediata para emergencias. Aprobación en 24 horas.' },
        { icon: '🚑', label: 'Seguro', color: 'teal', desc: 'Protección total para ti, tu unidad y pasaje. Deducible $0.' },
        { icon: '🔌', label: 'Financiamiento EV', color: 'purple', desc: 'Créditos para transición a vehículos eléctricos. Tasa 4% anual.' },
        { icon: '🏡', label: 'Hipotecario', color: 'indigo', desc: 'El camino a tu patrimonio familiar. Enganche financiado.' }
    ];

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Floating particles
    const particles = Array(8).fill(null).map((_, i) => ({
        id: i,
        size: Math.random() * 6 + 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        duration: Math.random() * 3 + 4,
    }));

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);

        // Simulate login - replace with actual API call
        setTimeout(() => {
            setIsLoggingIn(false);
            navigate('/dashboard');
        }, 1500);
    };

    const handleGoogleLogin = () => {
        // Implement Google OAuth
        console.log('Google login clicked');
        // For now, navigate to dashboard
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col overflow-hidden transition-colors duration-500">
            {/* Header - Minimalist */}
            <header className={`py-4 px-6 fixed top-0 w-full z-50 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                {/* Header content removed to avoid duplication with Navbar */}
            </header>

            {/* Main Hero Section */}
            <main className="flex-1 relative">
                {/* Compact Animated Gradient Background Card */}
                <div className={`mx-4 mt-4 rounded-2xl overflow-hidden relative transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <div className="bg-hero-gradient p-4 pb-6 relative flex flex-col items-center justify-center">

                        {/* Content Section - Compact */}
                        <div className="max-w-4xl mx-auto px-2 py-4 flex flex-col items-center">
                            {/* Compact Hero Logo & Branding */}
                            <div className={`text-center mb-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <img
                                    src={raiteLogo}
                                    alt="RAITE"
                                    className="h-14 w-auto mx-auto mb-3 object-contain animate-logo-10s rounded-lg"
                                />
                                <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white mb-2 tracking-tight">
                                    Los Choferes Son <span className="text-orange-500 dark:text-orange-400" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>Dueños</span>
                                </h2>
                                <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
                                    Primera cooperativa digital de transporte donde tú tomas el control.
                                </p>
                            </div>

                            {/* Compact Orbit with Services Animation */}
                            <div className={`relative w-56 h-56 md:w-64 md:h-64 mb-4 transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                {/* Outer Orbit Ring */}
                                <div className="absolute inset-0 border-2 border-dashed border-orange-500/20 rounded-full animate-spin" style={{ animationDuration: '30s' }} />

                                {/* Orbiting Services */}
                                {servicesData.slice(0, 8).map((service, idx) => {
                                    const angle = (idx * 45) * (Math.PI / 180);
                                    const radius = 100;
                                    return (
                                        <div
                                            key={idx}
                                            className="absolute w-9 h-9 md:w-10 md:h-10 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center justify-center text-lg cursor-pointer hover:scale-125 transition-transform border border-gray-100 dark:border-slate-700"
                                            style={{
                                                left: `calc(50% + ${Math.cos(angle) * radius}px - 18px)`,
                                                top: `calc(50% + ${Math.sin(angle) * radius}px - 18px)`,
                                                animation: `orbit-service 25s linear infinite`,
                                                animationDelay: `${idx * -3.125}s`,
                                            }}
                                            onClick={() => setSelectedService(service)}
                                            title={service.label}
                                        >
                                            {service.icon}
                                        </div>
                                    );
                                })}

                                {/* Central Character */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full flex items-center justify-center shadow-xl">
                                        <img
                                            src={choferesDuenosImg}
                                            alt="Choferes Dueños"
                                            className="w-24 h-24 md:w-28 md:h-28 object-contain animate-float"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Service Popup Modal */}
                            {selectedService && (
                                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in" onClick={() => setSelectedService(null)}>
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 w-full max-w-xs shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => setSelectedService(null)}
                                            className="absolute top-3 right-3 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full text-gray-500 hover:bg-gray-200 transition"
                                        >
                                            <X size={16} />
                                        </button>
                                        <div className="flex flex-col items-center text-center">
                                            <span className="text-5xl mb-3">{selectedService.icon}</span>
                                            <h3 className={`text-lg font-black text-${selectedService.color}-500 mb-1`}>{selectedService.label}</h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{selectedService.desc}</p>
                                            <button
                                                onClick={() => { setSelectedService(null); navigate('/services'); }}
                                                className={`mt-4 w-full py-2.5 rounded-lg font-bold text-white text-sm bg-${selectedService.color}-500 hover:bg-${selectedService.color}-600 transition active:scale-95`}
                                            >
                                                Ver Más
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Compact Savings Emphasis + CTA */}
                            <div className={`w-full text-center transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <p className="text-lg md:text-xl font-black text-gray-800 dark:text-white leading-tight">
                                    Ahorra hasta <span className="text-2xl md:text-3xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">90%</span> de las comisiones que hoy pagas a Uber y Didi
                                </p>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="mt-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-base px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Regístrate Ahora
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compact Login Section */}
                <div className={`mx-4 mt-4 bg-white dark:bg-slate-900 rounded-xl shadow-lg border dark:border-slate-800 overflow-hidden transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {/* Compact Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 px-4 py-3 border-b dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span className="font-bold text-gray-800 dark:text-white text-sm">¿Ya eres miembro?</span>
                        </div>
                        <span className="text-xs text-gray-400">Inicia sesión</span>
                    </div>

                    <div className="p-4">
                        {/* Compact Login Form */}
                        <form onSubmit={handleLogin} className="space-y-3">
                            {/* Email & Password in row on larger screens */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Correo electrónico"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="relative flex-1">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Contraseña"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        className="w-full pl-10 pr-10 py-3 text-sm bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all dark:text-white"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Login Button + Forgot Password inline */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={isLoggingIn}
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-lg shadow hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                                >
                                    {isLoggingIn ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Iniciar Sesión
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                                <button type="button" className="text-xs text-orange-500 hover:text-orange-600 font-medium whitespace-nowrap">
                                    ¿Olvidaste?
                                </button>
                            </div>
                        </form>

                        {/* Compact Divider */}
                        <div className="flex items-center gap-3 my-3">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                            <span className="text-xs text-gray-400">o continúa con</span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
                        </div>

                        {/* Social Buttons - Horizontal */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleGoogleLogin}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="font-medium text-gray-700 dark:text-gray-200">Google</span>
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black dark:bg-slate-950 text-white rounded-lg hover:bg-gray-900 transition-all text-sm border border-transparent dark:border-slate-800">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                <span className="font-medium">Apple</span>
                            </button>
                        </div>

                        {/* Create Account - Inline */}
                        <p className="mt-3 text-center text-xs text-gray-500">
                            ¿No tienes cuenta? <button onClick={() => navigate('/register')} className="text-orange-500 font-bold">Crear cuenta gratis</button>
                        </p>
                    </div>
                </div>

                {/* Compact About Section */}
                <div className={`mx-4 mt-4 mb-6 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border dark:border-slate-800 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Handshake className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                <span className="font-bold text-gray-800 dark:text-white">Acerca de RAITE:</span> Cooperativa digital donde cada chofer tiene voz, voto y comparte los beneficios.
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                <span className="text-[10px] font-medium text-orange-500">#CooperativismoDigital</span>
                                <span className="text-[10px] font-medium text-purple-500">#RAITE</span>
                                <span className="text-[10px] font-medium text-blue-500">#ConductoresDueños</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Welcome;
