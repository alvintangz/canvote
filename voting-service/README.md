# CanVote: Voting Microservice :ballot_box_with_check:

A service that exposes APIs to create, read, update and delete voting resources such as political parties, candidates, votes, and ridings.

### General Setup

Please follow the steps in order.

1. ```npm install```
2. [Setup mongoDB on docker](#mongodb-setup)
3. [Environment variables set up](#environment-variables-set-up)
4. [Run the auth service](#auth-service)
5. [Run the voting service](#voting-service)


### MongoDB Setup

With Docker, you can set MongoDB up quickly:

```bash
docker run -d --name canvote-vote \
    --publish 2000:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
    -e MONGO_INITDB_ROOT_PASSWORD=secret \
    -e MONGO_INITDB_DATABASE=c09 \
    mongo

# you could set "mongoadmin", "secret", and "c09" to what you want
```
This will spin up a docker container with is accessed from our application using port 2000.

Let's set up a admin user. The admin user is allowed to define other users. We will define a user "username" with password "password" that is the owner of the "c09" database. You can change the "username" and "password" fields.
```bash
docker exec -it $(docker ps -aqf 'name=canvote-vote') bash

root@51f5158c4fae:/# mongo --port 27017 --authenticationDatabase "admin" -u "mongoadmin" -p "secret"

> use c09

> db.createUser(
  {
    user: "username",
    pwd:  "password",
    roles: [ { role: "dbOwner", db: "c09" }]
  }
)

// you could set "username" and "password" to what you want

> exit
> exit
```

### Environment Variables Set up

Create a `.env` in the `voting-service` directory with the following fields:

- Production
    - `PRODUCTION` - Either `0` or `1`; if `0` then we have debug mode, meaning you can test queries using the GraphQL GUI
- Port
    - `PORT` - `3002`
- JWT Secret Key
    - `JWT_SECRET_KEY` - set to whatever the signing key is in `auth-service`; it must be the same
- Mongo Host
    - `MONGO_HOST` - `127.0.0.1`
- Mongo Port
    - `MONGO_PORT` - this is the port that is exposed from the docker container, in our case it is `2000`
- Mongo Username
    - `MONGO_USERNAME` - this is whatever you set as the username for the `c09` database
- Mongo Password
    - `MONGO_PASSWORD` - this is whatever you set as the password for the `c09` database
- Mongo Database
    - `MONGO_DATABASE` - `c09`

If you have chosen to keep the same values as given in these instructions, your `.env` file should look like this:

```
PRODUCTION=0
PORT=3002
JWT_SECRET_KEY=12345
MONGO_HOST=127.0.0.1
MONGO_PORT=2000
MONGO_USERNAME=username
MONGO_PASSWORD=password
MONGO_DATABASE=c09
```

This is the `JWT_SECRET_KEY` that I used while also running the `auth-service`

### Auth Service

The backend needs access to the `auth-service` in order to authenticate users. GraphQL allows certain `resolvers` (think of them as endpoints), accessible to only certain users. Depending on the JWT token passed in from the `auth-service`, we will either be allowed, or rejected from accessing certain endpoints.


Head over to `auth-service` and follow the instructions. **Note the JWT key that you sign with**. The configuration I used for the `auth-service` was:

```
JWT_SESSION_SECRET_KEY=12345
JWT_ACTIVATION_SECRET_KEY=12345
EMAIL_MAILGUN_API_KEY=<GivenFromAlvin>
ADMIN_ACCOUNT_PASSWORD=Password@123
```

Start the `auth-service`, then run from the ```voting-service``` directory:

```curl -X POST "http://localhost:3001/api/v1/auth/login/first" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"email\":\"admin@can-vote.works\",\"password\":\"Password@123\"}" -c cookie.txt```

This logs in the admin user, and stores their cookie in `cookie.txt` (with the information that they are an admin)

### Voting Service

Now it is time to run the voting service. 

run ```npm run serve:dev```, and you should see a `Connected to db` output.

```curl -v  -X POST -H "Content-Type: application/json" --data '{ "query": "{ getDistricts { id } }" }' http://localhost:3002/graphql -b cookie.txt```

You will get `{"data":{"getDistricts":[]}}` back, since there is no data, but it works.

Now, navigate to `http://localhost:3002/graphql` and try entering the query:
```
{
  getDistricts {
    id
  }
}
```
in the box. There is **no cookie** yet. After you hit play, the message back is `"User externalViewer cannot access resolver getDistricts"`. Since our resolvers have protected access, meaning that only certain roles can access certain methods, the role `externalViewer`, meaning someone who is not logged in, does not have access to this resolver.

**For testing purposes**, look at `authRoles.js` on how to allow `externalViewer` access to everything.

## Deployment

TODO.
