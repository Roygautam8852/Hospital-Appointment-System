const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// ── Razorpay instance ──────────────────────────────────────────────
// Replace these with your actual Razorpay TEST keys from:
// https://dashboard.razorpay.com/app/keys  (switch to Test mode)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_REPLACE_WITH_YOUR_KEY',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'REPLACE_WITH_YOUR_SECRET',
});

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order
// @access  Private
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Amount is required' });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects paise (1 INR = 100 paise)
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID || 'rzp_test_REPLACE_WITH_YOUR_KEY',
        });
    } catch (err) {
        console.error('Payment order creation error:', err);
        res.status(500).json({ success: false, message: 'Could not create payment order', error: err.message });
    }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify', (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET || 'REPLACE_WITH_YOUR_SECRET';
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            res.status(200).json({ success: true, message: 'Payment verified successfully', payment_id: razorpay_payment_id });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed - signature mismatch' });
        }
    } catch (err) {
        console.error('Payment verification error:', err);
        res.status(500).json({ success: false, message: 'Payment verification error' });
    }
});

module.exports = router;
