import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PaymentCreatedEvent } from '@infoset.co/common';
import { queueGroupName } from './queue-group-name';
import { Order,OrderStatus } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {

    const order = await Order.findById(data.orderId);
 
    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });

//needs an order update event(version changed_), but omit due to order is completed (no other action)

    await order.save(); 

    msg.ack(); 
  }
}
