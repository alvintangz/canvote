module.exports = [
  {
    title: 'Authentication Microservice',
    context: 'auth',
    proxyTo: 'http://localhost:3001',
  },
  {
    title: 'Voting Microservice',
    context: 'voting',
    proxyTo: 'http://localhost:3002',
  },
  {
    title: 'WebSocket Microservice',
    context: 'ws',
    proxyTo: 'http://localhost:3003',
  },
];
