import {
    Listener,
    Subjects,
    ExpirationOrderEvent,
    OrderStatus,
  } from '@infoset.co/common';
  import { Message } from 'node-nats-streaming';
  import { queueGroupName } from './queue-group-name';
  import { Order } from '../../models/order';
  import { OrderDeletedPublisher } from '../publishers/order-deleted-publisher';
  
  export class ExpirationOrderListener extends Listener<ExpirationOrderEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.ExpirationOrder = Subjects.ExpirationOrder;
  
    async onMessage(data: ExpirationOrderEvent['data'], msg: Message) {
      const order = await Order.findById(data.orderId).populate('ticket');
  
      if (!order) {
        throw new Error('Order not found');
      }
  
      if (order.status===OrderStatus.Complete) {
        msg.ack();
      }
      order.set({
        status: OrderStatus.Cancelled,
      });
      await order.save();
      await new OrderDeletedPublisher(this.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });
  
      msg.ack();
    }
  }
  