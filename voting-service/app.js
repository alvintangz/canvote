const express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");

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
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);



