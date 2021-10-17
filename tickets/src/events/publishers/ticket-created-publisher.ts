import { Publisher } from '@infoset.co/common';
import { TicketCreatedEvent } from '@infoset.co/common';
import { Subjects } from '@infoset.co/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
