import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@infoset.co/common';
import cookieSession from 'cookie-session';


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



app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};
