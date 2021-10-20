process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
 
const cookie =
  'express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall4Tm1WaFpqVXpZekpoTkRVMk5qVTROV1F3TURrMU9DSXNJbVZ0WVdsc0lqb2labTkwYVhOQVoyMWhhV3d1WTI5dElpd2lhV0YwSWpveE5qTTBOalF6TnprMWZRLmZpOVd1VUZwdDJLb3F2OElFNGxEbE1hRkZBdnlPSXN3a3hXeTQySEdwQU0ifQ==';
 
const doRequest = async () => {
  const { data } = await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'ticket', price: 5 },
    {
      headers: { cookie },
    }
  );
 
  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 10 },
    {
      headers: { cookie },
    }
  );
 
  axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 15 },
    {
      headers: { cookie },
    }
  );
 
  console.log('Request complete');
};
 
(async () => {
  for (let i = 0; i < 400; i++) {
    doRequest();
  }
})();
 