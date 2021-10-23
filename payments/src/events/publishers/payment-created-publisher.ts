import { Subjects, Publisher, PaymentCreatedEvent } from '@infoset.co/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
