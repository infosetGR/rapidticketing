import { Publisher } from '@infoset.co/common';
import { TicketUpdatedEvent } from '@infoset.co/common';
import { Subjects } from '@infoset.co/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
