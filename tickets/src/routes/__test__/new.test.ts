import { response } from 'express';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets for post request', async () => {
  const res= await request(app)
    .post('/api/tickets')
    .send({});
    
    expect(res.status).not.toEqual(404);
});

it('it can only accessed if user is loggedin', async () => {
  const res= await request(app)
  .post('/api/tickets')
  .send({});
  
  expect(res.status).toEqual(401);
});

it('returns other than 401 if user loged in', async () => {
  const res= await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});
    
    expect(res.status).not.toEqual(401);
});

it('returns error if invalid title is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({title:'', price:10})
      .expect(400);
    
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ price:10})
      .expect(400);
});

it('returns error if invalid price is provided', async () => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({title:'mytitle', price:0})
  .expect(400);
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({title:'mytitle', price:0})
  .expect(400);
});

it('creates ticket with valid values', async () => {
  let tickets= await Ticket.find({});
  expect(tickets.length).toEqual(0);

  // add check for saving ticket
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({title:'mytitle', price:20})


  tickets= await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual('20');
  expect(tickets[0].title).toEqual('mytitle');

  
});
