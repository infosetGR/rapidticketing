import mongoose from 'mongoose';
import { OrderStatus} from '@infoset.co/common';
import {TicketDoc} from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export {OrderStatus};

// An interface that describes the properties
// that are requried to create a new Order
interface OrderAttrs {
  userId:string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describes the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// An interface that describes the properties
// that a Order Document has
interface OrderDoc extends mongoose.Document {
  userId:string;
  version:number;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    }

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

OrderSchema.set('versionKey', 'version')
OrderSchema.plugin(updateIfCurrentPlugin);

// OrderSchema.pre('save', async function (done) {
//   if (this.isModified('password')) {
//     const hashed = await Password.toHash(this.get('password'));
//     this.set('password', hashed);
//   }
//   done();
// });

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };
