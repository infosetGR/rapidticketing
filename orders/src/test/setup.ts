import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';


// declare global {
//   namespace NodeJS {
//     interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }

jest.mock('../nats-wrapper')

declare global {
  var signin: () => string[];
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
  });
});

beforeEach(async () => {

  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin =  () => {
  
  // Build a JWT payload { id , email }  
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.co',
  };

  //Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  
  //Build Session object {jwt:MY_JWT}
  const session = { jwt: token };
  
  //turn session to JSON
  const sessionJSON = JSON.stringify(session);
  
  //encode JSON as Base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

    // return string (cookie with encode data)
  return [`express:sess=${base64}`];

  // const email = 'test@test.co';
  // const password = 'password';

  // const response = await request(app)
  //   .post('/api/users/signup')
  //   .send({
  //     email,
  //     password
  //   })
  //   .expect(201);

  // const cookie = response.get('Set-Cookie');

  // return cookie;
};