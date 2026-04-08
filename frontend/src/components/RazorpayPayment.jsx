import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react';

const RazorpayPayment = ({ isOpen, onClose, amount = 500, doctorName = '', appointmentDetails = {}, onPaymentSuccess }) => {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                // Razorpay script loaded
            };
            script.onerror = () => {
                setError('Failed to load Razorpay. Please try again.');
            };
            document.head.appendChild(script);
        }
    }, [isOpen]);

    const handlePayment = async () => {
        setProcessing(true);
        setError('');

        try {
            // Step 1: Create order on backend
            const orderResponse = await fetch('http://localhost:5000/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    amount: amount,
                    currency: 'INR',
                    receipt: `rcpt_${Date.now()}`
                })
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create payment order');
            }

            const orderData = await orderResponse.json();

            if (!orderData.success || !orderData.order) {
                throw new Error('Invalid order response from server');
            }

            // Step 2: Open Razorpay Checkout
            const options = {
                key: orderData.key, // Razorpay Key ID from response
                amount: amount * 100, // Amount in paise
                currency: 'INR',
                order_id: orderData.order.id,
                name: 'CarePulse - Healthcare Management',
                description: `Consultation with Dr. ${doctorName}`,
                prefill: {
                    // Pre-fill user details if available
                    email: appointmentDetails?.email || '',
                    contact: appointmentDetails?.phone || ''
                },
                theme: {
                    color: '#10b981' // Emerald color
                },
                handler: async (response) => {
                    // Step 3: Verify payment on backend
                    try {
                        const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            // Payment verified successfully
                            if (onPaymentSuccess) {
                                onPaymentSuccess({
                                    transactionId: response.razorpay_payment_id,
                                    orderId: response.razorpay_order_id,
                                    amount: amount,
                                    method: 'Razorpay',
                                    timestamp: new Date().toISOString()
                                });
                            }
                            handleClose();
                        } else {
                            setError(verifyData.message || 'Payment verification failed');
                            setProcessing(false);
                        }
                    } catch (verifyErr) {
                        console.error('Verification error:', verifyErr);
                        setError('Payment verification failed. Please contact support.');
                        setProcessing(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setProcessing(false);
                        setError('Payment cancelled');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setProcessing(false);

        } catch (err) {
            console.error('Payment error:', err);
            setError(err.message || 'Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    const handleClose = () => {
        setError('');
        setProcessing(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            >
                {/* Header */}
                <div className="relative px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleClose}
                            disabled={processing}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft size={14} /> Back
                        </button>
                        <h2 className="font-bold text-slate-800 text-sm">Complete Payment</h2>
                        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            ₹{amount}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Payment info */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 font-medium">Doctor</span>
                            <span className="font-bold text-slate-800">Dr. {doctorName}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-3">
                            <span className="text-slate-600 font-medium">Amount</span>
                            <span className="font-bold text-emerald-600">₹{amount}</span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-xs font-semibold"
                        >
                            <AlertCircle size={16} /> {error}
                        </motion.div>
                    )}

                    {/* Security note */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2">
                        <AlertCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-700 font-medium">
                            You will be redirected to Razorpay's secure checkout. Your payment is encrypted and safe.
                        </p>
                    </div>

                    {/* Test mode notice */}
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                        <p className="text-[10px] text-amber-800 font-semibold">🧪 TEST MODE</p>
                        <p className="text-[9px] text-amber-700 mt-1">
                            Use test cards like <span className="font-mono font-bold">4111 1111 1111 1111</span> with any future date and CVV.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50/50">
                    <button
                        onClick={handleClose}
                        disabled={processing}
                        className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-bold text-xs border border-slate-200 hover:bg-slate-200 transition-all disabled:opacity-50"
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
                                Redirecting...
                            </>
                        ) : (
                            <>
                                Pay ₹{amount}
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default RazorpayPayment;
