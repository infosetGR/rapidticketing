import {
  OrderDeletedEvent,
  Subjects,
  Listener,
  OrderStatus,
} from '@infoset.co/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderDeletedListener extends Listener<OrderDeletedEvent> {
  subject: Subjects.OrderDeleted = Subjects.OrderDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderDeletedEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
