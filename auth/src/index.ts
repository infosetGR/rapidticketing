import  mongoose  from 'mongoose';
import {app} from './app';

const start = async () => {
  console.log('starting up 1..! ');
  if (!process.env.jwt_key){
        throw new Error('Environment variable jwt key is missing');
    }
  if (!process.env.MONGO_URI){
      throw  new Error('MONGO_URI variable is missing');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI );
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }


  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();