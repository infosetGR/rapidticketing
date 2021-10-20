import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@infoset.co/common';
import { Order, OrderStatus } from '../models/order';
import {OrderDeletedPublisher} from '../events/publishers/order-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {

    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.set({
     status: OrderStatus.Cancelled
    });
    await order.save();

    new OrderDeletedPublisher(natsWrapper.client).publish({
          id: order.id,  
          version: order.version,
          ticket:{
            id: order.ticket.id
          }
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
