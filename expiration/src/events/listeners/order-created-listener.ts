import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@infoset.co/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';
import { getJSDocDeprecatedTag } from 'typescript';



export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime()-new Date().getTime();
    await expirationQueue.add({
      orderId:data.id
    },{
      delay:delay,
    }
    );

    msg.ack();
  }
}