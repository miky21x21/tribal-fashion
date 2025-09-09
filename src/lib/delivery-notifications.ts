// Delivery notification utilities
// This file contains functions to send notifications to delivery agents

export interface DeliveryNotification {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface OrderData {
  id: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  total: number;
  items?: Array<{
    product?: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

/**
 * Creates a delivery notification from order data
 */
export function createDeliveryNotification(order: OrderData): DeliveryNotification {
  const deliveryAddress = `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} ${order.shippingZipCode}, ${order.shippingCountry}`;
  
  return {
    orderId: order.id,
    customerName: order.shippingName,
    customerPhone: order.shippingPhone,
    deliveryAddress,
    totalAmount: order.total,
    items: order.items?.map(item => ({
      name: item.product?.name || 'Unknown Product',
      quantity: item.quantity,
      price: item.price
    })) || [],
    createdAt: order.createdAt,
    priority: 'NORMAL'
  };
}

/**
 * Sends delivery notification to delivery agents
 * This is a simulated function - in production, you would integrate with:
 * - SMS service (Twilio, AWS SNS)
 * - Email service (SendGrid, AWS SES)
 * - Push notification service
 * - Internal notification system
 * - WhatsApp Business API
 */
export async function sendDeliveryNotification(notification: DeliveryNotification): Promise<boolean> {
  try {
    // Log the notification (in production, this would be sent to actual services)
    console.log('🚚 DELIVERY NOTIFICATION:', JSON.stringify(notification, null, 2));
    
    // Simulate API calls to different notification services
    const promises = [
      sendSMSNotification(notification),
      sendEmailNotification(notification),
      sendPushNotification(notification),
      sendWhatsAppNotification(notification)
    ];
    
    // Wait for all notifications to be sent (or fail)
    const results = await Promise.allSettled(promises);
    
    // Check if at least one notification was successful
    const successCount = results.filter(result => result.status === 'fulfilled').length;
    
    console.log(`📱 Delivery notifications sent: ${successCount}/${promises.length} successful`);
    
    return successCount > 0;
  } catch (error) {
    console.error('Failed to send delivery notifications:', error);
    return false;
  }
}

/**
 * Simulates sending SMS notification to delivery agent
 */
async function sendSMSNotification(notification: DeliveryNotification): Promise<void> {
  // In production, this would use Twilio, AWS SNS, or similar service
  const message = `New delivery order #${notification.orderId}
Customer: ${notification.customerName}
Phone: ${notification.customerPhone}
Address: ${notification.deliveryAddress}
Amount: ₹${notification.totalAmount}
Priority: ${notification.priority}`;
  
  console.log('📱 SMS Notification:', message);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simulate success/failure (90% success rate)
  if (Math.random() < 0.9) {
    console.log('✅ SMS notification sent successfully');
  } else {
    throw new Error('SMS service unavailable');
  }
}

/**
 * Simulates sending email notification to delivery agent
 */
async function sendEmailNotification(notification: DeliveryNotification): Promise<void> {
  // In production, this would use SendGrid, AWS SES, or similar service
  const emailData = {
    to: 'delivery@tribalfashion.com',
    subject: `New Delivery Order #${notification.orderId}`,
    html: `
      <h2>New Delivery Order</h2>
      <p><strong>Order ID:</strong> ${notification.orderId}</p>
      <p><strong>Customer:</strong> ${notification.customerName}</p>
      <p><strong>Phone:</strong> ${notification.customerPhone}</p>
      <p><strong>Address:</strong> ${notification.deliveryAddress}</p>
      <p><strong>Total Amount:</strong> ₹${notification.totalAmount}</p>
      <p><strong>Priority:</strong> ${notification.priority}</p>
      <p><strong>Items:</strong></p>
      <ul>
        ${notification.items.map(item => `<li>${item.name} x${item.quantity} - ₹${item.price}</li>`).join('')}
      </ul>
      <p><strong>Order Date:</strong> ${new Date(notification.createdAt).toLocaleString()}</p>
    `
  };
  
  console.log('📧 Email Notification:', emailData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Simulate success/failure (95% success rate)
  if (Math.random() < 0.95) {
    console.log('✅ Email notification sent successfully');
  } else {
    throw new Error('Email service unavailable');
  }
}

/**
 * Simulates sending push notification to delivery agent app
 */
async function sendPushNotification(notification: DeliveryNotification): Promise<void> {
  // In production, this would use Firebase Cloud Messaging, OneSignal, or similar service
  const pushData = {
    to: 'delivery_agents_topic',
    notification: {
      title: `New Delivery Order #${notification.orderId}`,
      body: `${notification.customerName} - ${notification.deliveryAddress}`,
      icon: '/images/delivery-icon.png',
      badge: '/images/badge-icon.png'
    },
    data: {
      orderId: notification.orderId,
      customerName: notification.customerName,
      customerPhone: notification.customerPhone,
      deliveryAddress: notification.deliveryAddress,
      totalAmount: notification.totalAmount.toString(),
      priority: notification.priority
    }
  };
  
  console.log('🔔 Push Notification:', pushData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Simulate success/failure (85% success rate)
  if (Math.random() < 0.85) {
    console.log('✅ Push notification sent successfully');
  } else {
    throw new Error('Push notification service unavailable');
  }
}

/**
 * Simulates sending WhatsApp notification to delivery agent
 */
async function sendWhatsAppNotification(notification: DeliveryNotification): Promise<void> {
  // In production, this would use WhatsApp Business API
  const message = `🚚 *New Delivery Order*

*Order ID:* ${notification.orderId}
*Customer:* ${notification.customerName}
*Phone:* ${notification.customerPhone}
*Address:* ${notification.deliveryAddress}
*Amount:* ₹${notification.totalAmount}
*Priority:* ${notification.priority}

*Items:*
${notification.items.map(item => `• ${item.name} x${item.quantity} - ₹${item.price}`).join('\n')}

*Order Date:* ${new Date(notification.createdAt).toLocaleString()}

Please confirm receipt of this order.`;
  
  console.log('💬 WhatsApp Notification:', message);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulate success/failure (80% success rate)
  if (Math.random() < 0.8) {
    console.log('✅ WhatsApp notification sent successfully');
  } else {
    throw new Error('WhatsApp service unavailable');
  }
}

/**
 * Gets delivery agent contact information
 * In production, this would fetch from a database or configuration service
 */
export function getDeliveryAgentContacts(): Array<{
  id: string;
  name: string;
  phone: string;
  email: string;
  area: string;
  isActive: boolean;
}> {
  return [
    {
      id: 'agent-001',
      name: 'Rajesh Kumar',
      phone: '+91-9876543210',
      email: 'rajesh@tribalfashion.com',
      area: 'Delhi NCR',
      isActive: true
    },
    {
      id: 'agent-002',
      name: 'Priya Sharma',
      phone: '+91-9876543211',
      email: 'priya@tribalfashion.com',
      area: 'Mumbai',
      isActive: true
    },
    {
      id: 'agent-003',
      name: 'Amit Singh',
      phone: '+91-9876543212',
      email: 'amit@tribalfashion.com',
      area: 'Bangalore',
      isActive: true
    }
  ];
}
