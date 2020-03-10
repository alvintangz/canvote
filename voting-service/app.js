const resolversList = require('./resolversList').resolversList
const authRoles = require('./authRoles').resolverToRole

const express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const jwt = require('jsonwebtoken');


require("dotenv").config();

const schema = require('./schema')

const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))


const app = express();

app.use(bodyParser.json());

function getAllResolvers(query) {
  query = query.replace(/[{}]|query|mutation|[()]|"|:/g, " ")
  queryList = query.split(" ")
  return queryList.filter((a) => a !== "" && resolversList.includes(a))
}

const server = new ApolloServer({
  schema: schema,
  context: ({ req, res }) => {
    let payload = {role: "administrator"};

    // jwt.verify('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzZXNzaW9uIiwiaWQiOjEsImVtYWlsIjoiYWRtaW5AY2FuLXZvdGUud29ya3MiLCJuYW1lIjp7ImZ1bGwiOiJUZWFtIERNQSIsImZpcnN0IjoiVGVhbSIsImxhc3QiOiJETUEifSwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJleHAiOjE1ODM3MjQ2MTMsIm5iZiI6MTU4MzcyMjgxM30.-H-D2DAd1DRhbQidkUH4UtSXsrORt1Qq5h8A63qalEQ',
    // process.env.JWT_KEY, (err, decoded) => {
    //   console.log(req);
    //   if (err) { res.status(500).send({err: "You must be authenticated first"})}
    //   payload = decoded;
    // });

    // what we essentially do is take the query, parse which resolvers are being called, and see if the role has access to each
    // let resolvers = getAllResolvers(JSON.stringify(req.body))
    // resolvers.forEach(resolver => {
    //   if (!authRoles[payload.role].includes(resolver)) {
    //     return res.status(401).send({err: `${payload.role} is not authenticated for action ${resolver}`})
    //   }      
    // });

    // if we reach here, we are good    
  },
});

server.applyMiddleware({ app });

// Start Server.
let port = process.env.PORT || 3002
app.listen({ port: port}, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
);



