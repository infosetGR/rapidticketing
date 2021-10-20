import Queue from "bull";
import { natsWrapper } from '../nats-wrapper';
import {ExpirationOrderPublisher} from '../events/publishers/expiration-order-publisher'

interface Payload {
    orderId: string;
  }
  
  const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
      host: process.env.REDIS_HOST,
    },
  });
  
  expirationQueue.process(async (job) => {
    console.log(
      'I want to publish an expiration:complete event for orderId',
      job.data.orderId
    );


    await new ExpirationOrderPublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
        
      })

  });
  
  export { expirationQueue };
  