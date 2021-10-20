import { Subjects } from './subjects';

export interface ExpirationOrderEvent {
  subject: Subjects.ExpirationOrder;
  data: {
    orderId: string;
  };
}
