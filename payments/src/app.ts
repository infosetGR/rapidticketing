import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@infoset.co/common';
import cookieSession from 'cookie-session';
import { createChargeRouter } from './routes/new';

// if (process.env.NODE_ENV =='test'){
//   const dotenv =require('dotenv');
//   const result = dotenv.config();


//   if (result.error) {
//       throw result.error;
// }
// }

const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(cookieSession({
  signed:false,
  secure: false // process.env.NODE_ENV !='test'
}))



// app.all('*', async (req,res,next)=> {
//   next(new NotFoundError());
// });

// app.all('*', async (req,res)=> {
//   throw new NotFoundError();
// });

app.use(currentUser);
app.use(createChargeRouter);



app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};
