module.exports = [
  {
    title: 'Authentication Microservice',
    from: '/api/ams',
    to: 'http://localhost:3001/api/v1',
  },
  {
    title: 'Voting Microservice',
    from: '/api/vms',
    to: 'http://localhost:3002/api/v1',
  },
  {
    title: 'WebSocket Microservice',
    from: '/broadcast',
    to: 'http://localhost:3003/broadcast',
  },
];
