import Stripe from 'stripe';


export const stripe = new Stripe(process.env.stripe_key!,  {
  apiVersion: '2020-08-27',
});

// export const stripe = new Stripe('sk_test_GaP9HZLfBRbV0uyezxol1YY300OrETeuAm'!,  {
//   apiVersion: '2020-08-27',
// });

