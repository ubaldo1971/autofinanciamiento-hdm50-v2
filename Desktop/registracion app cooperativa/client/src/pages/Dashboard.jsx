import React, { useState, useEffect } from 'react';
import { TrendingUp, Car, Wallet, AlertCircle, CheckCircle, X, ArrowRight, Users } from 'lucide-react';
import TokenWidget from '../components/TokenWidget';
import EarningsModal from '../components/EarningsModal';

const StatCard = ({ icon, title, value, subtext, color }) => (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
            {React.cloneElement(icon, { size: 18, className: `text-${color.split('-')[1]}-600` })}
        </div>
        <div className="flex-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase">{title}</p>
            <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
        <span className="text-[10px] text-gray-400">{subtext}</span>
    </div>
);

const TOKEN_PRICE = 25.50;

const Dashboard = () => {
    const [isEarningsOpen, setIsEarningsOpen] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(150);
    const [buyAmount, setBuyAmount] = useState('');
    const [buyTokens, setBuyTokens] = useState('');
    const [sellAmount, setSellAmount] = useState('');
    const [sellMxn, setSellMxn] = useState('');
    const [sellMode, setSellMode] = useState('exchange'); // 'exchange' or 'p2p'
    const [recipientId, setRecipientId] = useState('');
    const [transactionSuccess, setTransactionSuccess] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [lastTransactionAmount, setLastTransactionAmount] = useState(0);

    const [earnings, setEarnings] = useState({
        taller: 1250.50,
        llantera: 850.20,
        autofin: 3400.00,
        fin_ev: 150.00,
        gruas: 320.40,
        refaccionaria: 640.80,
        prestamos_pers: 1200.00,
        prestamos_hipo: 2100.00,
        seguro: 450.50
    });

    const [voteStats, setVoteStats] = useState({
        favor: 1240,
        contra: 415,
        abstencion: 85,
        total: 1740
    });

    // Calculate tokens from MXN amount (for display when using MXN input)
    const tokensFromAmount = buyAmount ? Math.floor(parseFloat(buyAmount) / TOKEN_PRICE) : 0;
    // Calculate MXN from tokens (for display when using tokens input)
    const mxnFromBuyTokens = buyTokens ? (parseFloat(buyTokens) * TOKEN_PRICE) : 0;
    // Final token count to buy (prioritize direct token input)
    const finalBuyTokens = buyTokens ? parseInt(buyTokens) : tokensFromAmount;
    const mxnFromTokens = sellAmount ? (parseFloat(sellAmount) * TOKEN_PRICE) : 0;

    // Handle MXN input change - sync with tokens
    const handleBuyAmountChange = (value) => {
        setBuyAmount(value);
        if (value) {
            setBuyTokens(Math.floor(parseFloat(value) / TOKEN_PRICE).toString());
        } else {
            setBuyTokens('');
        }
    };

    // Handle tokens input change - sync with MXN
    const handleBuyTokensChange = (value) => {
        setBuyTokens(value);
        if (value) {
            setBuyAmount((parseFloat(value) * TOKEN_PRICE).toFixed(2));
        } else {
            setBuyAmount('');
        }
    };

    const handleBuyTokens = () => {
        if (finalBuyTokens > 0) {
            setLastTransactionAmount(finalBuyTokens);
            setTokenBalance(prev => prev + finalBuyTokens);
            setTransactionType('buy');
            setTransactionSuccess(true);
            setBuyAmount('');
            setBuyTokens('');
            setTimeout(() => {
                setTransactionSuccess(false);
                setShowBuyModal(false);
            }, 3000);
        }
    };

    const handleSellTokens = () => {
        const amount = parseInt(sellAmount);
        if (amount > 0 && amount <= tokenBalance) {
            setLastTransactionAmount(amount);
            setTokenBalance(prev => prev - amount);
            setTransactionType(sellMode === 'exchange' ? 'sell-exchange' : 'sell-p2p');
            setTransactionSuccess(true);
            setSellAmount('');
            setSellMxn('');
            setRecipientId('');
            setTimeout(() => {
                setTransactionSuccess(false);
                setShowSellModal(false);
            }, 3000);
        }
    };

    // Handle Sell tokens input - sync with MXN
    const handleSellAmountChange = (value) => {
        setSellAmount(value);
        if (value) {
            setSellMxn((parseFloat(value) * TOKEN_PRICE).toFixed(2));
        } else {
            setSellMxn('');
        }
    };

    // Handle Sell MXN input - sync with tokens
    const handleSellMxnChange = (value) => {
        setSellMxn(value);
        if (value) {
            setSellAmount(Math.floor(parseFloat(value) / TOKEN_PRICE).toString());
        } else {
            setSellAmount('');
        }
    };

    // Simulate live voting updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly increment one of the vote categories
            const rand = Math.random();
            let key = 'abstencion';
            if (rand < 0.6) key = 'favor';
            else if (rand < 0.9) key = 'contra';

            setVoteStats(prev => {
                const newState = { ...prev };
                newState[key] += 1;
                newState.total += 1;
                return newState;
            });
        }, 2000); // New vote every 2 seconds
        return () => clearInterval(interval);
    }, []);

    // Simulate live ticking of earnings
    useEffect(() => {
        const interval = setInterval(() => {
            setEarnings(prev => ({
                taller: prev.taller + Math.random() * 0.4,
                llantera: prev.llantera + Math.random() * 0.3,
                autofin: prev.autofin + Math.random() * 0.8,
                fin_ev: prev.fin_ev + Math.random() * 0.9,
                gruas: prev.gruas + Math.random() * 0.2,
                refaccionaria: prev.refaccionaria + Math.random() * 0.4,
                prestamos_pers: prev.prestamos_pers + Math.random() * 0.5,
                prestamos_hipo: prev.prestamos_hipo + Math.random() * 0.7,
                seguro: prev.seguro + Math.random() * 0.1
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const totalShared = Object.values(earnings).reduce((acc, curr) => acc + curr, 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <EarningsModal
                isOpen={isEarningsOpen}
                onClose={() => setIsEarningsOpen(false)}
                earnings={earnings}
                totalShared={totalShared}
            />

            {/* Compact Header */}
            <div className="bg-coop-blue text-white p-4 pb-14 rounded-b-[2rem] shadow-md relative z-0">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Hola, Juan</h1>
                        <p className="text-blue-200 text-xs">Socio #12345 • Activo</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                        <div>
                            <p className="text-blue-300 text-[9px] uppercase font-semibold">Ganancias Coop</p>
                            <div className="flex items-center gap-1">
                                <span className="text-xl font-bold">
                                    ${totalShared.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <TrendingUp size={14} className="text-coop-green" />
                            </div>
                        </div>
                        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-coop-blue text-sm font-bold shadow">JP</div>
                    </div>
                </div>
            </div>

            {/* Overlapping Token Widget */}
            <div className="px-4 -mt-10 relative z-10">
                <TokenWidget
                    onOpenDetails={() => setIsEarningsOpen(true)}
                    tokens={tokenBalance}
                    setTokens={setTokenBalance}
                />
            </div>

            {/* Compact Buy/Sell Section */}
            <div className="px-4 mt-3">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-3 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold text-sm flex items-center gap-1">💎 Tokens RAITE</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-white text-xs font-bold">{tokenBalance} tokens</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowBuyModal(true)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 text-sm transition-all shadow"
                        >
                            📈 Comprar
                        </button>
                        <button
                            onClick={() => setShowSellModal(true)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 text-sm transition-all shadow"
                        >
                            📉 Vender
                        </button>
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-indigo-200">
                        <span>Precio: <span className="text-white font-bold">${TOKEN_PRICE.toFixed(2)} MXN</span></span>
                        <span className="text-green-300">+2.5% hoy</span>
                    </div>
                </div>
            </div>

            {/* Buy Tokens Modal */}
            {showBuyModal && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg">📈 Comprar Tokens</h3>
                            <button onClick={() => setShowBuyModal(false)} className="text-white/80 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {!transactionSuccess ? (
                            <div className="p-5">
                                {/* Two input options */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Monto (MXN)</label>
                                        <input
                                            type="number"
                                            value={buyAmount}
                                            onChange={(e) => handleBuyAmountChange(e.target.value)}
                                            placeholder="Ej: 1000"
                                            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base font-bold focus:border-green-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tokens (RTE)</label>
                                        <input
                                            type="number"
                                            value={buyTokens}
                                            onChange={(e) => handleBuyTokensChange(e.target.value)}
                                            placeholder="Ej: 50"
                                            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base font-bold focus:border-green-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="bg-green-50 p-3 rounded-lg mb-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] text-gray-500">Recibirás:</p>
                                            <p className="text-2xl font-black text-green-600">{finalBuyTokens} tokens</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500">Costo:</p>
                                            <p className="text-lg font-bold text-gray-700">${(finalBuyTokens * TOKEN_PRICE).toFixed(2)} MXN</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Precio: ${TOKEN_PRICE} MXN por token</p>
                                </div>

                                <button
                                    onClick={handleBuyTokens}
                                    disabled={finalBuyTokens <= 0}
                                    className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 ${finalBuyTokens > 0
                                        ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg'
                                        : 'bg-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    Confirmar Compra <ArrowRight size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4 animate-bounce">
                                    <CheckCircle className="text-green-500" size={48} />
                                </div>
                                <h4 className="text-2xl font-black text-gray-800">¡Compra Exitosa!</h4>
                                <div className="bg-green-50 rounded-xl p-4 mt-4 mb-2">
                                    <p className="text-sm text-gray-500">Tokens acreditados:</p>
                                    <p className="text-4xl font-black text-green-600">+{lastTransactionAmount}</p>
                                </div>
                                <div className="bg-gray-100 rounded-xl p-3">
                                    <p className="text-xs text-gray-400">Nuevo balance en billetera:</p>
                                    <p className="text-2xl font-bold text-gray-800">{tokenBalance} tokens 💎</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Sell Tokens Modal */}
            {showSellModal && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg">📉 Vender Tokens</h3>
                            <button onClick={() => setShowSellModal(false)} className="text-white/80 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {!transactionSuccess ? (
                            <div className="p-5">
                                {/* Mode Selector */}
                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={() => setSellMode('exchange')}
                                        className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${sellMode === 'exchange'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        💱 Exchange
                                    </button>
                                    <button
                                        onClick={() => setSellMode('p2p')}
                                        className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${sellMode === 'p2p'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Users size={16} /> P2P Chofer
                                    </button>
                                </div>

                                {/* Two input options */}
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tokens (RTE)</label>
                                        <input
                                            type="number"
                                            value={sellAmount}
                                            onChange={(e) => handleSellAmountChange(e.target.value)}
                                            placeholder="Ej: 50"
                                            max={tokenBalance}
                                            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base font-bold focus:border-red-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Monto (MXN)</label>
                                        <input
                                            type="number"
                                            value={sellMxn}
                                            onChange={(e) => handleSellMxnChange(e.target.value)}
                                            placeholder="Ej: 1275"
                                            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base font-bold focus:border-red-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mb-3">Tienes {tokenBalance} tokens disponibles</p>

                                {sellMode === 'p2p' && (
                                    <div className="mb-3">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">ID del Comprador</label>
                                        <input
                                            type="text"
                                            value={recipientId}
                                            onChange={(e) => setRecipientId(e.target.value)}
                                            placeholder="Ej: PXLXJU19850519806"
                                            className="w-full p-3 border-2 border-gray-200 rounded-lg font-mono text-sm focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                )}

                                <div className={`p-3 rounded-lg mb-4 ${sellMode === 'exchange' ? 'bg-red-50' : 'bg-purple-50'}`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] text-gray-500">Vender:</p>
                                            <p className="text-xl font-black text-gray-800">{sellAmount || 0} tokens</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500">{sellMode === 'exchange' ? 'Recibirás:' : 'Te pagarán:'}</p>
                                            <p className={`text-xl font-black ${sellMode === 'exchange' ? 'text-red-600' : 'text-purple-600'}`}>
                                                ${mxnFromTokens.toFixed(2)} MXN
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSellTokens}
                                    disabled={parseInt(sellAmount) <= 0 || parseInt(sellAmount) > tokenBalance || (sellMode === 'p2p' && !recipientId)}
                                    className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 ${parseInt(sellAmount) > 0 && parseInt(sellAmount) <= tokenBalance && (sellMode !== 'p2p' || recipientId)
                                        ? `bg-gradient-to-r ${sellMode === 'exchange' ? 'from-red-500 to-orange-500' : 'from-purple-500 to-indigo-500'} hover:shadow-lg`
                                        : 'bg-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    {sellMode === 'exchange' ? 'Vender al Exchange' : 'Transferir a Chofer'} <ArrowRight size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${transactionType === 'sell-exchange' ? 'bg-red-100' : 'bg-purple-100'
                                    }`}>
                                    <CheckCircle className={transactionType === 'sell-exchange' ? 'text-red-500' : 'text-purple-500'} size={40} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800">
                                    {transactionType === 'sell-exchange' ? '¡Venta Exitosa!' : '¡Transferencia Exitosa!'}
                                </h4>
                                <p className="text-gray-500 mt-2">
                                    {transactionType === 'sell-exchange' ? 'Fondos acreditados a tu cuenta' : 'Tokens enviados al comprador'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )
            }

            {/* Compact Stats Row */}
            <div className="px-4 mt-3 space-y-2">
                <StatCard
                    icon={<TrendingUp />}
                    title="Ingresos (Mes)"
                    value="$8,200"
                    subtext="+15%"
                    color="bg-green-100"
                />
                <StatCard
                    icon={<Car />}
                    title="Viajes"
                    value="42"
                    subtext="Esta semana"
                    color="bg-blue-100"
                />
            </div>

            {/* Compact Live Voting */}
            <div className="px-4 mt-3">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="font-bold text-gray-800 text-sm">Votación en Vivo 🔴</span>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold text-gray-800">{voteStats.total.toLocaleString()}</span>
                            <span className="text-[9px] text-gray-400 uppercase ml-1">votos</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mb-2">Presupuesto General 2024</p>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] w-14 text-gray-600">A Favor</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${(voteStats.favor / voteStats.total) * 100}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold w-10 text-right">{Math.round((voteStats.favor / voteStats.total) * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] w-14 text-gray-600">En Contra</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                <div className="bg-red-500 h-1.5 rounded-full transition-all" style={{ width: `${(voteStats.contra / voteStats.total) * 100}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold w-10 text-right">{Math.round((voteStats.contra / voteStats.total) * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] w-14 text-gray-600">Abstención</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                <div className="bg-gray-400 h-1.5 rounded-full transition-all" style={{ width: `${(voteStats.abstencion / voteStats.total) * 100}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold w-10 text-right">{Math.round((voteStats.abstencion / voteStats.total) * 100)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <h3 className="font-bold text-gray-800 text-lg">Estado del Vehículo</h3>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold">Verificación Vigente</h4>
                            <p className="text-sm text-gray-500">Próxima: 12 Dic 2024</p>
                        </div>
                    </div>
                </div>

                <h3 className="font-bold text-gray-800 text-lg">Próximos Pagos</h3>
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <Wallet className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold">Cuota Cooperativa</h4>
                            <p className="text-sm text-gray-500">Vence en 5 días</p>
                        </div>
                    </div>
                    <span className="font-bold text-gray-800">-$500</span>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
