# CanVote: WebSockets Microservice :eyes:

A service that broadcasts votes in real-time through WebSockets by subscribing to data in MongoDB through Change Streams.

There is a websocket connection through the frontend-app and in this repo. This repo will periodically pull vote related information from the database, and pass it through the websocket for the frontend to manage. The frontend will take this data and display it under the ELECTION RESULTS page. This information is public, so security for the websocket is not a big deal.

## Prerequisites

1. [NodeJs](https://nodejs.org/)
2. [Google Chrome](https://www.google.com/chrome/)
3. [Browser WebSocket Client](https://chrome.google.com/webstore/detail/browser-websocket-client/mdmlhchldhfnfnkfmljgeinlffmdgkjo?hl=en)

### General Setup

Please follow the steps in order.

1. Install all dependencies, including development dependencies
    ```bash
    $ npm install
    ```
2. [Run the auth service](https://github.com/UTSCC09/project-team_dma/tree/master/auth-service)
3. [Run the voting service](https://github.com/UTSCC09/project-team_dma/tree/master/voting-service)
3. [Run the frontend](https://github.com/UTSCC09/project-team_dma/tree/master/frontend)
4. [Run the WS service](#ws-setup)
5. [Understanding the Data](#data)
6. [Visualizing the Data](#visualize)

### WS Setup

First we need to setup a `.env` file inside the `ws-service` directory.

Here are the contents:

```
PRODUCTION=0
PORT=3003
JWT_SECRET_KEY=12345
MONGO_HOST=127.0.0.1
MONGO_PORT=2000
MONGO_USERNAME=username
MONGO_PASSWORD=password
MONGO_DATABASE=c09
AUTH_API_KEY=12345
AUTH_SERVICE_BASE_URL=http://localhost:3001/api/v1
INTERNAL_API_KEY=12345
```

If you have ran the voting service before as you should have, most of theys variables should not be surprising. Make sure that your `voting-service` env file matches this one, except on the `PORT` field.


After you have created the `.env` file, run ```npm run serve:dev```, and you should see `Connected to db`

Now head over to `Google Chrome`, and open the `Browser WebSocket Client` extension that you downloaded earlier.

Under the `Client` section, you should see a `URL` field. Enter the following: `ws://localhost:3003` and press Connect.

If you switch back to the ws-service console, you should see another message pop up which says `Connected to websocket`.

### Data

Now that we have a websocket with two connections, it is time to understand the data that is being passed through.

Go back to the Browser WebSocketet Client in Google Chrome, and you should see data under the Recieved Messages section.

Click one of these, and something like the following will open up.

```
{
  "districts": [
    {
      "id": "5e9238b84a4ae16e385bb9dc",
      "name": "Toronto",
      "leadingPartyInDistrict": [
        "5e9239a84a4ae16e385bb9e0"
      ],
      "candidates": [
        {
          "id": "5e923f4fc5ffe070b6a05936",
          "name": "changed",
          "votePercentageWithinDistrict": "60.00",
          "voteCount": 3
        },
        {
          "id": "5e923f72c5ffe070b6a05938",
          "name": "Jsaon",
          "votePercentageWithinDistrict": "20.00",
          "voteCount": 1
        },
        ...
      ],
      "leadingPartyName": [
        "Liberals"
      ]
    },
    ...
  ],
  "parties": [
    {
      "id": "5e9239a84a4ae16e385bb9e0",
      "name": "Liberals",
      "voteCount": 4,
      "projectedNumberOfSeats": 1
    },
    {
      "id": "5e9239b84a4ae16e385bb9e2",
      "name": "Green Party",
      "voteCount": 2,
      "projectedNumberOfSeats": 0
    },
    ...
  ],
  "total": {
    "districts": 2,
    "parties": 5
  },
  "lastUpdated": "2020-04-12T21:26:45.283Z"
}
```
Although it may seem like a lot of data, it is very simple to understand.

For each district, we record it's id, name, and which party is leading in the district. We also record the candidates in that district, each with their own id, name, and information about their votes like how many they have, and the percentage of votes in the district.

For each party, we record it's id, name, the total number of votes across all the districts, and how many seats its projected to win, depending on how many districts it is currently winning.

A party is said to win a district if the candidate which represents it has the most votes in that district.

### Visualize

We have seen how the websockets work and the data they exchange. Now it is time to see the visual representation of this data. Open the home page `http://localhost:3000` and click the `ELECTION RESULTS` nav tab.

The sections here are populated based on the websocket which transfers data every 5 seconds. These sections are self-explanatory, as they have a small description written on the side bar.
