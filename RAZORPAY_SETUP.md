# Razorpay Payment Gateway Setup

## Quick Setup Guide

### 1. Get Razorpay API Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Complete KYC verification
3. Go to Settings → API Keys
4. Generate API Keys (use Test Mode for development)

### 2. Environment Variables

Add these to your `.env.local` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
```

### 3. Test Cards

For testing online payments, use these test card numbers:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`
- Expiry: Any future date
- CVV: Any 3 digits

### 4. UPI Testing

For UPI testing, use:
- UPI ID: `success@razorpay`
- Amount: Any amount

### 5. Webhook Setup (Optional)

For production, set up webhooks:
1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`

## Payment Flow

1. User selects "Online Payment" on payment page
2. Razorpay checkout opens
3. User completes payment
4. Payment is verified
5. Order is created with payment details
6. User sees order confirmation

## Security Notes

- Never expose `RAZORPAY_KEY_SECRET` in frontend code
- Always verify payment signatures
- Use HTTPS in production
- Keep API keys secure

## Troubleshooting

**Common Issues:**

1. **"Invalid Key ID"** - Check your `RAZORPAY_KEY_ID`
2. **"Signature verification failed"** - Check your `RAZORPAY_KEY_SECRET`
3. **"Order not found"** - Ensure order is created before payment

**Debug Mode:**
Set `debug: true` in Razorpay options to see detailed logs.

## Production Checklist

- [ ] Switch to Live Mode
- [ ] Update API keys to live keys
- [ ] Set up webhooks
- [ ] Test all payment methods
- [ ] Configure proper error handling
- [ ] Set up monitoring and alerts
