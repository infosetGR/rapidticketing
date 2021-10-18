import mongoose from 'mongoose';
import { isJsxAttributes, isThisTypeNode } from 'typescript';
import { Order, OrderStatus } from './order';

// An interface that describes the properties
// that are requried to create a new Ticket
interface TicketAttrs {
  title: string;
  price: number;
}

// An interface that describes the properties
// that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// An interface that describes the properties
// that a Ticket Document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },

  },
  {
    toJSON: {
      transform(doc, ret) {
        //delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      }

    }
  }
);

// TicketSchema.pre('save', async function (done) {
//   if (this.isModified('password')) {
//     const hashed = await Password.toHash(this.get('password'));
//     this.set('password', hashed);
//   }
//   done();
// });

TicketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

TicketSchema.methods.isReserved = async function() {
  
   const existingOrder = await Order.findOne({
    //ticket: this.id,
    ticket:this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });
  
  return  !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema);

export { Ticket };
