import { Publisher } from '@infoset.co/common';
import { OrderCreatedEvent } from '@infoset.co/common';
import { Subjects } from '@infoset.co/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
