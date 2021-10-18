import { Publisher } from '@infoset.co/common';
import { OrderDeletedEvent } from '@infoset.co/common';
import { Subjects } from '@infoset.co/common';

export class OrderDeletedPublisher extends Publisher<OrderDeletedEvent> {
  readonly subject = Subjects.OrderDeleted;
}
