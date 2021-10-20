import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderDeletedEvent } from '@infoset.co/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import {TicketUpdatedPublisher} from '../../events/publishers/ticket-updated-publisher';

export class OrderDeletedListener extends Listener<OrderDeletedEvent> {
  subject: Subjects.OrderDeleted = Subjects.OrderDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderDeletedEvent['data'], msg: Message) {

    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket){
      throw new Error('Ticket not found');
    }

    ticket.set({orderId:null})

    await ticket.save();


    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version:ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId:ticket.userId,
      orderId:ticket.orderId
    })

    msg.ack();
  }
}
