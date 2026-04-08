import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building2, CheckCircle2, AlertCircle, Eye, EyeOff, ChevronLeft } from 'lucide-react';

const MockPaymentModal = ({ isOpen, onClose, amount = 500, onPaymentSuccess }) => {
    const [tab, setTab] = useState('card');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [showCVV, setShowCVV] = useState(false);
    const [cardData, setCardData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardName: '',
    });
    const [upiId, setUpiId] = useState('');

    const handleCardChange = (field, value) => {
        let formattedValue = value;
        
        if (field === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').slice(0, 16);
            if (formattedValue.length > 0) {
                formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim();
            }
        } else if (field === 'expiry') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
            if (formattedValue.length >= 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
            }
        } else if (field === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 3);
        }
        
        setCardData({
            ...cardData,
            [field]: formattedValue
        });
    };

    const handlePayment = async () => {
        if (tab === 'card') {
            if (!cardData.cardNumber || !cardData.expiry || !cardData.cvv || !cardData.cardName) {
                alert('Please fill in all card details');
                return;
            }
        } else if (tab === 'upi') {
            if (!upiId) {
                alert('Please enter your UPI ID');
                return;
            }
        }

        setProcessing(true);
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2500));

        const txnId = `TXN${Date.now()}`;
        setTransactionId(txnId);
        setSuccess(true);
        setProcessing(false);
    };

    const handleSuccess = () => {
        if (onPaymentSuccess) {
            onPaymentSuccess({
                transactionId,
                amount,
                method: tab === 'card' ? 'Credit/Debit Card' : tab === 'upi' ? 'UPI' : 'Net Banking',
                timestamp: new Date().toISOString()
            });
        }
        handleClose();
    };

    const handleClose = () => {
        setCardData({ cardNumber: '', expiry: '', cvv: '', cardName: '' });
        setUpiId('');
        setTab('card');
        setProcessing(false);
        setSuccess(false);
        setTransactionId('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <AnimatePresence mode="wait">
                {!success ? (
                    <motion.div
                        key="payment"
                        initial={{ scale: 0.92, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.92, opacity: 0 }}
                        className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={handleClose}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                                >
                                    <ChevronLeft size={14} /> Back
                                </button>
                                <div className="text-center flex-1">
                                    <h2 className="font-bold text-slate-800 text-sm">Complete Payment</h2>
                                </div>
                                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Amount: ₹{amount}</div>
                            </div>

                            {/* Payment method tabs */}
                            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                                {[
                                    { id: 'card', name: 'Card', icon: CreditCard },
                                    { id: 'upi', name: 'UPI', icon: Smartphone },
                                    { id: 'netbanking', name: 'Net Banking', icon: Building2 },
                                ].map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => setTab(method.id)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-[10px] font-bold transition-all ${
                                            tab === method.id
                                                ? 'bg-white text-emerald-600 shadow-sm'
                                                : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        <method.icon size={13} />
                                        <span className="hidden sm:inline">{method.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Test credentials hint */}
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2">
                                <AlertCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] text-blue-700 font-medium">
                                    {tab === 'card' && 'Use any card number (e.g., 4111111111111111)'}
                                    {tab === 'upi' && 'Enter any UPI ID (e.g., user@upi)'}
                                    {tab === 'netbanking' && 'Netbanking payment simulation'}
                                </p>
                            </div>

                            {/* Card Payment */}
                            {tab === 'card' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                    {/* Card preview */}
                                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-4 text-white h-32 flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 opacity-10">
                                            <CreditCard size={120} />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-[11px] font-medium opacity-75">Card Number</p>
                                            <p className="text-lg font-black tracking-widest">{cardData.cardNumber || '•••• •••• •••• ••••'}</p>
                                        </div>
                                        <div className="relative z-10 flex justify-between items-end">
                                            <div>
                                                <p className="text-[9px] opacity-70">Card Holder</p>
                                                <p className="text-xs font-bold">{cardData.cardName || 'YOUR NAME'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] opacity-70">Expires</p>
                                                <p className="text-xs font-bold">{cardData.expiry || 'MM/YY'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card inputs */}
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Card Number</label>
                                            <input
                                                type="text"
                                                placeholder="4111 1111 1111 1111"
                                                value={cardData.cardNumber}
                                                onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-mono transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Card Holder Name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter full name"
                                                value={cardData.cardName}
                                                onChange={(e) => handleCardChange('cardName', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expiry (MM/YY)</label>
                                                <input
                                                    type="text"
                                                    placeholder="12/25"
                                                    value={cardData.expiry}
                                                    onChange={(e) => handleCardChange('expiry', e.target.value)}
                                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-mono transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CVV</label>
                                                <div className="relative">
                                                    <input
                                                        type={showCVV ? 'text' : 'password'}
                                                        placeholder="123"
                                                        maxLength="3"
                                                        value={cardData.cvv}
                                                        onChange={(e) => handleCardChange('cvv', e.target.value)}
                                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-mono transition-all pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCVV(!showCVV)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showCVV ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* UPI Payment */}
                            {tab === 'upi' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center h-40">
                                        <Smartphone size={40} className="text-slate-300 mb-2" />
                                        <p className="text-xs text-slate-400 text-center font-medium">UPI Payment Gateway</p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">UPI ID</label>
                                        <input
                                            type="email"
                                            placeholder="yourname@upi"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                                        />
                                    </div>

                                    <div className="text-center">
                                        <p className="text-xs text-slate-400 font-medium">You will receive a payment prompt on your registered phone number</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Net Banking */}
                            {tab === 'netbanking' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center h-40">
                                        <Building2 size={40} className="text-slate-300 mb-2" />
                                        <p className="text-xs text-slate-400 text-center font-medium">Select Your Bank</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'BOB', 'Punjab Bank'].map((bank, i) => (
                                            <button
                                                key={i}
                                                className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-600 transition-all"
                                            >
                                                {bank}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Amount summary */}
                            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-600">Amount to Pay:</span>
                                    <span className="text-lg font-black text-emerald-600">₹{amount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50/50">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-bold text-xs border border-slate-200 hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                {processing ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay ₹{amount}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.93, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                    >
                        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                        <div className="p-8 text-center">
                            <motion.div
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', delay: 0.1 }}
                                className="h-20 w-20 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            >
                                <CheckCircle2 size={40} className="text-emerald-600" strokeWidth={2} />
                            </motion.div>

                            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">Payment Successful!</h3>
                            <p className="text-sm text-slate-500 font-medium mb-6">Your appointment will be confirmed shortly</p>

                            <div className="bg-slate-50 rounded-lg border border-slate-100 p-4 mb-6 text-left space-y-2.5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-medium">Transaction ID</span>
                                    <span className="font-mono font-bold text-slate-700">{transactionId}</span>
                                </div>
                                <div className="flex justify-between text-xs border-t border-slate-200 pt-2.5">
                                    <span className="text-slate-400 font-medium">Amount</span>
                                    <span className="font-bold text-emerald-600">₹{amount}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-medium">Time</span>
                                    <span className="font-bold text-slate-700">{new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSuccess}
                                className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MockPaymentModal;
