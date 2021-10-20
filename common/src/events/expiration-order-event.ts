import { Subjects } from './subjects';

export interface ExpirationOrder {
  subject: Subjects.ExpirationOrder;
  data: {
    orderId: string;
  };
}
