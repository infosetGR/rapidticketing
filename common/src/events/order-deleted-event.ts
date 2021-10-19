import { Subjects } from './subjects';

export interface OrderDeletedEvent {
  subject: Subjects.OrderDeleted;
  data: {
    id: string;
    version:number;
    ticket: {
      id:string;
    }
  };
}
