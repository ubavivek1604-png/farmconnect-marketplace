import { Response } from 'express';
import { dataStore } from '../utils/dataStore.ts';
import { AuthRequest } from '../middleware/auth.ts';

export function createOrder(req: AuthRequest, res: Response): void {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required to place an order.' });
      return;
    }

    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Your cart is empty. Please add products.' });
      return;
    }

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.street || !deliveryAddress.city) {
      res.status(400).json({ success: false, message: 'Complete delivery address and contact phone are required.' });
      return;
    }

    const validPaymentMethods = ['Cash on Delivery', 'UPI / NetBanking (Test Mode)'];
    const chosenPayment = validPaymentMethods.includes(paymentMethod) ? paymentMethod : 'Cash on Delivery';

    const customer = dataStore.findUserById(req.user.id);
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer account not found.' });
      return;
    }

    const orderResult = dataStore.createOrder({
      customerId: req.user.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: deliveryAddress.phone || customer.phone,
      items,
      deliveryAddress,
      paymentMethod: chosenPayment as 'Cash on Delivery' | 'UPI / NetBanking (Test Mode)'
    });

    if (!orderResult.success) {
      res.status(400).json({
        success: false,
        message: orderResult.error || 'Could not complete order checkout.'
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! The farmer has received your request.',
      data: orderResult.order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Order processing failed.', error: (error as Error).message });
  }
}

export function getMyOrders(req: AuthRequest, res: Response): void {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (req.user.role === 'customer') {
      const orders = dataStore.getCustomerOrders(req.user.id);
      res.status(200).json({ success: true, data: orders });
      return;
    }

    if (req.user.role === 'farmer') {
      const farmerOrders = dataStore.getFarmerOrders(req.user.id);
      res.status(200).json({ success: true, data: farmerOrders });
      return;
    }

    if (req.user.role === 'admin') {
      const allOrders = dataStore.getAllOrders();
      res.status(200).json({ success: true, data: allOrders });
      return;
    }

    res.status(403).json({ success: false, message: 'Invalid role.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.', error: (error as Error).message });
  }
}

export function getOrderById(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const order = dataStore.getOrderById(id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // Auth check
    const isOwner = req.user?.id === order.customerId;
    const isFarmerWithItems = order.items.some(i => i.farmerId === req.user?.id);
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isFarmerWithItems && !isAdmin) {
      res.status(403).json({ success: false, message: 'You are not authorized to view this order.' });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order details.', error: (error as Error).message });
  }
}

export function updateOrderStatus(req: AuthRequest, res: Response): void {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
      return;
    }

    const order = dataStore.getOrderById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const isFarmer = req.user?.role === 'farmer';
    const isAdmin = req.user?.role === 'admin';

    if (!isFarmer && !isAdmin) {
      res.status(403).json({ success: false, message: 'Only farmers and administrators can update order fulfillment status.' });
      return;
    }

    const updateResult = dataStore.updateFulfillmentStatus(
      id,
      isFarmer ? (req.user?.id || null) : null,
      status
    );

    if (!updateResult.success) {
      res.status(400).json({ success: false, message: updateResult.error });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Fulfillment status updated to ${status}.`,
      data: updateResult.order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status.', error: (error as Error).message });
  }
}
