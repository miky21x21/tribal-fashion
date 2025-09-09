# Payment Integration Setup Guide

## Overview
The Tribal Fashion e-commerce platform now supports two payment methods:
1. **Cash on Delivery (COD)** - Pay when your order is delivered
2. **Online Payment** - Secure payment through Razorpay gateway

## Features Implemented

### ✅ Payment Methods
- **Cash on Delivery**: Traditional payment method for customers who prefer to pay upon delivery
- **Online Payment**: Secure payment processing through Razorpay with support for:
  - Credit/Debit Cards
  - UPI (Unified Payments Interface)
  - Net Banking
  - Digital Wallets
  - EMI options

### ✅ Payment Flow
1. User fills delivery address on checkout page
2. User selects payment method on payment page
3. For COD: Order is placed directly
4. For Online Payment: Razorpay gateway opens for payment processing
5. Payment verification and order confirmation
6. Delivery agent notifications sent

### ✅ Security Features
- Payment signature verification
- Secure API endpoints
- SSL encryption
- PCI DSS compliant payment processing

## Setup Instructions

### 1. Razorpay Account Setup
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Complete KYC verification
3. Get your API keys from the dashboard

### 2. Environment Variables
Add the following to your `.env.local` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
```

### 3. Database Migration
The payment fields have been added to the Order model:
- `paymentMethod` - Payment method used (COD/ONLINE)
- `paymentId` - Razorpay payment ID (for online payments)
- `paymentOrderId` - Razorpay order ID (for online payments)
- `paymentStatus` - Payment status (PENDING/COMPLETED)

### 4. Testing
- Use Razorpay test mode for development
- Test cards are available in Razorpay documentation
- COD orders can be tested without payment processing

## API Endpoints

### Payment Order Creation
```
POST /api/payments/create-order
```
Creates a Razorpay order for online payments.

### Payment Verification
```
POST /api/payments/verify
```
Verifies payment signature and creates the order.

### Order Creation
```
POST /api/orders
```
Creates order with payment information.

## User Experience

### Checkout Flow
1. **Cart Page** → "Proceed to Checkout"
2. **Checkout Page** → Fill delivery address → "Proceed to Payment"
3. **Payment Page** → Select payment method → Place order/Pay
4. **Order Confirmation** → View order details and payment status

### Payment Page Features
- Clear payment method selection
- Order summary with delivery address
- Secure payment processing
- Real-time payment status updates
- Error handling and user feedback

## Delivery Agent Integration

When an order is placed, delivery agents receive notifications via:
- SMS notifications
- Email notifications
- Push notifications
- WhatsApp notifications (simulated)

The notification includes:
- Customer contact information
- Complete delivery address
- Order items and quantities
- Payment method and status
- Total amount

## Security Considerations

1. **Payment Data**: Never store sensitive payment information
2. **API Keys**: Keep Razorpay keys secure and use environment variables
3. **Signature Verification**: Always verify payment signatures
4. **HTTPS**: Ensure all payment flows use HTTPS
5. **PCI Compliance**: Razorpay handles PCI DSS compliance

## Production Deployment

1. Switch to Razorpay live mode
2. Update environment variables with live keys
3. Configure webhook endpoints for payment status updates
4. Set up proper error monitoring
5. Test all payment flows thoroughly

## Support

For payment-related issues:
- Check Razorpay dashboard for transaction details
- Review server logs for API errors
- Verify environment variables are correctly set
- Test with Razorpay test cards first

## Future Enhancements

Potential improvements:
- Multiple payment gateways (PayU, Paytm, etc.)
- Subscription payments
- Installment payments
- International payment support
- Payment analytics and reporting
