import express , {Request, Response} from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@infoset.co/common';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import mongoose from 'mongoose';




const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15*60;

router.post('/api/orders', requireAuth,[
    body('ticketId').not().isEmpty().custom((input:string)=>mongoose.Types.ObjectId.isValid(input)).withMessage('TicketId is required')
], validateRequest, 
async (req: Request, res:Response) => {
  //find ticket for order
  const {ticketId} = req.body;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket ) {
    throw new NotFoundError();
  }
  //check ticket not reserved
  
  const isReserved= await ticket.isReserved();

  if (isReserved){
    throw new BadRequestError('Ticket is already reserved');
  }

  //calculate the expiration date
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds()+EXPIRATION_WINDOW_SECONDS);

  //build and save
 
 const order = Order.build({ 
  userId: req.currentUser!.id,
  status: OrderStatus.Created,
  expiresAt:expiration,
  ticket
  
 });
 await order.save();

 //publish event

await new OrderCreatedPublisher(natsWrapper.client).publish({
  id: order.id,
  version:order.version,
  status: order.status,
  expiresAt: order.expiresAt.toISOString(),
  userId:order.userId,
  ticket:{
    id: order.ticket.id,
    price:order.ticket.price
  }
})

 res.status(201).send(order);


});

export { router as createOrderRouter };
