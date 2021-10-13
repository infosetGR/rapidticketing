import axios from 'axios';

const buildclient = ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    console.log('window undefined');
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    console.log('on browser');
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
};

export default buildclient;