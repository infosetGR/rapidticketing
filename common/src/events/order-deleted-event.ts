import { Subjects } from './subjects';

export interface OrderDeletedEvent {
  subject: Subjects.OrderDeleted;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
