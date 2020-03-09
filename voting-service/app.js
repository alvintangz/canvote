const express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();

const schema = require('./schema')

const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))


const app = express();

app.use(bodyParser.json());

const server = new ApolloServer({
  schema: schema
});

server.applyMiddleware({ app });

// Start Server.
let port = process.env.PORT || 3002
app.listen({ port: port}, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
);



