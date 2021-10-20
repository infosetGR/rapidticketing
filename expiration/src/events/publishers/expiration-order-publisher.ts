import {Publisher, Subjects, ExpirationOrderEvent } from '@infoset.co/common';

export class ExpirationOrderPublisher extends Publisher<ExpirationOrderEvent> {
  readonly subject = Subjects.ExpirationOrder;
}
