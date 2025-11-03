# 🔄 FLOW KHI THANH TOÁN THÀNH CÔNG - PHÂN TÍCH

## 📋 Timeline Chi Tiết

### T=0s: User Click "Purchase"
- File: `app/(root)/order/[id]/stripe-payment.tsx`
- Action: `stripe.confirmPayment()` được gọi
- Stripe xử lý payment với test card `4242 4242 4242 4242`

### T=1-2s: Payment Thành Công
- Stripe tạo PaymentIntent với status = `succeeded`
- Stripe tạo Charge với status = `succeeded`
- User được redirect đến: `/order/[id]/stripe-payment-success?payment_intent=pi_xxx&redirect_status=succeeded`

### T=2-3s: Success Page Load
- File: `app/(root)/order/[id]/stripe-payment-success/page.tsx`
- Action: 
  - Verify PaymentIntent
  - Check status = `succeeded`
  - Hiển thị "Thanks for your purchase"
- ❌ **VẤN ĐỀ**: Order CHƯA được update (isPaid = false)

### T=3-5s: Webhook Được Gọi (Production)
- File: `app/api/webhooks/stripe/route.ts`
- Stripe tự động POST đến: `https://your-domain.com/api/webhooks/stripe`
- Event: `charge.succeeded`
- Action:
  - Verify webhook signature
  - Gọi `updateOrderToPaid()`
  - Update order: `isPaid = true`, `paidAt = now()`
  - Giảm product stock
  - Gửi email ✅

### T=5-6s: Email Được Gửi
- File: `email/index.tsx` → `sendPurchaseReceipt()`
- Resend gửi email đến `order.user.email`
- Email chứa: Order details, items, prices

### T=6s+: User Refresh Page
- Order hiển thị "Paid" ✅
- Email đã được nhận ✅

## 🚨 VẤN ĐỀ

### Local Testing (không có Stripe CLI):
- ❌ Webhook KHÔNG hoạt động (localhost không nhận được webhook)
- ❌ Order không được update
- ❌ Email không được gửi

### Production (có webhook):
- ✅ Webhook hoạt động
- ✅ Order được update
- ✅ Email được gửi

## 💡 GIẢI PHÁP

Thêm fallback code vào Success Page để:
- Local: Tự động update order khi vào success page
- Production: Webhook vẫn xử lý bình thường (idempotent - không update 2 lần)

