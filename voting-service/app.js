
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cors = require('cors')
// const { resolversList } = require('./resolversList');

require('dotenv').config();

const schema = require('./schema');
const db = require('./db');

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

const prod = parseInt(process.env.PRODUCTION, 10) !== 1;

//app.use(cors({origin: 'http://localhost:3000', credentials: true}));


app.use(bodyParser.json());
app.use(cookieParser());

const server = new ApolloServer({
  schema,
  introspection: prod,
  playground: prod,
  formatError: (err) => new Error(err.originalError),
  context: ({ req }) => {

    let payload = { role: 'externalViewer' };
    // some endpoints don't need cookies
    if (!req.cookies['cv.token']) return { payload };

    jwt.verify(req.cookies['cv.token'],
      process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) throw new AuthenticationError('The jwt token is not valid');
        if (decoded) payload = decoded;
      });

    return { payload };
  },
});

server.applyMiddleware({ app, cors : {credentials: true, origin: 'http://localhost:3000' }});
// Start Server.
const port = process.env.PORT || 3002;
app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
