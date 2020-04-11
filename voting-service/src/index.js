/* eslint-disable no-debugger, no-console */
import express from 'express';
import cookieParser from 'cookie-parser';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import schema from './schemas';
import connectDB from './db';
import mediaRoutes from './media';
import { IN_PRODUCTION, JWT_SECRET_KEY, PORT } from './config';

connectDB();

const app = express();
app.use(cookieParser());

const server = new ApolloServer({
  schema,
  introspection: !IN_PRODUCTION,
  // playground: {
  //   settings: {
  //     "request.credentials": "include"
  //   },
  // },
  playground: true,
  debug: !IN_PRODUCTION,
  context: ({ req }) => {
    const token = req.cookies['cv.token'];
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET_KEY, (err, me) => {
      if (err) throw new AuthenticationError('The JWT provided is not valid or no longer valid.');
      return { me, jwt: token };
    });
  },
});

server.applyMiddleware({
  app,
  cors: {
    credentials: true,
    origin: 'http://localhost:3000',
  },
});

app.use('/', mediaRoutes);

app.listen({ port: PORT }, () => {
  console.log(
    `  ___        __   __   _       
 / __|__ _ _ \\ \\ / /__| |_ ___ 
| (__/ _\` | ' \\ V / _ \\  _/ -_)
 \\___\\__,_|_||_\\_/\\___/\\__\\___|`,
    '\nDharmik Shah; Alvin Tang; Mikhail Makarov\n',
  );
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
