# CanVote: Voting Microservice :ballot_box_with_check:

A service that exposes a GraphQL server to run queries and mutations on voting resources such as political parties, candidates, votes, and districts.

## Development

### Prerequisites

1. [NodeJs](https://nodejs.org/)
2. One (or both) of the following<sup>*</sup>:
    - [Docker](https://www.docker.com): Desktop, or Engine
    - [MongoDB](https://www.mongodb.com/download-center/community)
3. An authentication service to issue JWT tokens in order to make GraphQL mutations

<small>***\*With Docker, you can easily create a MongoDB container on the fly. This is recommended for fast development.***</small>

### General Setup

Please follow the steps in order.

1. Install all dependencies, including development dependencies
    ```bash
    $ npm install
    ```
2. [Setup MongoDB](#mongodb-setup)
3. [Environment variables set up](#environment-variables-set-up)
4. [Run the auth service](#auth-service)
5. [Run the voting service](#voting-service)


### MongoDB Setup

With Docker, you can set MongoDB up quickly:

```bash
docker run -p 27017:27017 --env MONGO_INITDB_ROOT_USERNAME=canvote -e MONGO_INITDB_ROOT_PASSWORD=Password@123 -e MONGO_INITDB_DATABASE=canvote --name canvote-vote --detach mongo
```
This will spin up a docker container for a MongoDB server which can be accessed through port 27017.

### Environment Variables Set up

`src/config.js` sets up all the configuration variables used throughout the app. If you look in there, it reads from a set of environment variables.

- Production :shipit:
    - `PRODUCTION` - Either `0` or `1` with `0` being in debug mode which provides a stacktrace in cases of errors; set to `1` by default
- Port
    - `PORT` - The port to run the server on; set to `3002` by default
- JWT Secret Key
    - `JWT_SECRET_KEY` - A secret key for JWT validation and should be set to the same key in `auth-service`
- Database: Should use MongoDB
    - `MONGO_HOST` - Host of MongoDB server; set to `localhost` by default
    - `MONGO_PORT` - Port of MongoDB server; set to `27017` by default
    - `MONGO_USERNAME` - Username of user of MongoDB server; set to `canvote` by default
    - `MONGO_PASSWORD` - Password of user of MongoDB server
    - `MONGO_DATABASE` - Name of database of MongoDB server; set to `canvote` by default
- Authentication Service
    - `AUTH_SERVICE_BASE_URL` - The base url of authentication service; set to `http://localhost:3001/api/v1` by default
    - `INTERNAL_API_KEY` - Internal API Key to access specific resources in authentication service, puts this in `internal_auth` header of an HTTP request to authentication service when necessary

Make sure to set up your environment variables correctly.

Optionally, you can create a `.env` file in the `voting-service` directory to set the environment variables easily. If you have chosen to keep the same values as given in the [MongoDB Setup](#mongodb-setup) instructions, the MongoDB configuration in the `.env` file should look like this:

```
PRODUCTION=0
PORT=3002
JWT_SECRET_KEY=<JWT_SECRET_KEY>
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_USERNAME=canvote
MONGO_PASSWORD=Password@123
MONGO_DATABASE=canvote
AUTH_SERVICE_BASE_URL=http://localhost:3001/api/v1
INTERNAL_API_KEY=<INTERNAL_API_KEY>
```

`JWT_SECRET_KEY` and `INTERNAL_API_KEY` should be the same values set in `auth-service`.

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

```bash
curl -X POST "http://localhost:3001/api/v1/auth/login/first" \
    -H "accept: application/json" -H "Content-Type: application/json" \
    -d "{\"email\":\"admin@can-vote.works\",\"password\":\"Password@123\"}" \
    -c cookie.txt
```

This logs in the admin user, and stores their cookie in `cookie.txt` (with the information that they are an admin)

### Voting Service

Now it is time to run the voting service. 

run ```npm run serve:dev```, and you should see a `Connected to db` output in the console. Then run

```bash
curl -v -X POST http://localhost:3002/graphql \
    -H "Content-Type: application/json" \
    --data '{"query":"query { districts { id } } "}' \
    -b cookie.txt
```

Notice how we are passing our `cookie.txt` that we got from the `auth-service`.

Depending on what is in the database, we might get back `{"data":{"getDistricts":[]}}`, or something like `{"data":{"districts":[{"id":"5e9238b84a4ae16e385bb9dc"},{"id":"5e9239254a4ae16e385bb9dd"}]}}` if there is data inside.

Now, navigate to `http://localhost:3002/graphql` and try entering your queries. There is more information on the graphQL playground that will guide you.

If you want to actually see data in the database, go back to your docker container and run `mongo --port 27017 --authenticationDatabase "c09" -u "username" -p "password"`

## Security
With GraphQL scalars and types, we don't need to validate user input. However, any strings provided has been sanitized in resolvers to prevent XSS. There's a maximum depth of 4.
