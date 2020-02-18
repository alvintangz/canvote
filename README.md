# CanVote

## Team Members
- Dharmik Shah - shahdha2 - 1003417153
- Alvin Tang - tangalvi - 1003414325
- Mikhail Makarov - makarovm - 1003401525

## Description of Web Application
**CanVote**, short for Canada Vote, is a web application that allows Canadian voters to vote for a political party in their riding in a quick and efficient fashion. Similar to a real election, there will be a cutoff time where all the voting stops. 

A public view of real-time riding results and which parties are leading in the polls can be viewed through graphs in the application. When the voting period is over, a map can be accessed to view who has won majority in each riding, and the overall results (similar to what you would see at the end of an election).

The voters will be presented their riding, and be given the opportunity to vote for a single party in that riding.


Security will be a major factor which is discussed in the technical challenges.

Administrative Officer
- Create political parties
- Control the amount of ridings (set name, create/delete ridings)
- Set the voting period (when the voting should end). 
- They should be able to create an election officer (username, password)

Election Officer
- Create a voter for a specific riding (name, email, password [must be changed on first use], photo [used for facial recognition], riding)

Voter
- Vote for a specific political party in their riding

Anyone
- View the voting results in bar graph and map form (map form only available once voting period is over)

## Key Features to be Completed by Beta Version
Due: March 15, 2020

- Ability for Admin Officer to create, update abd delete Election Officers, Political parties, and the rest of its actions mentioned above
- Ability for Election Officers to create, update, and delete Voters
- User authentication completed without facial and voice recoginition
- Ability for the voter to vote and see result in basic text format (no graphs yet)

## Key Features to be Completed by Final Version
Due: March 29, 2020

- Bar graph display that updates with every vote
- Map that shows the final results
- Facial recognition login for the voters only

## Description of Technologies to be Utilized

1. **Frontend**
    - CSS Framework: Web Experience Toolkit (WET) (https://github.com/wet-boew/GCWeb)
    - JavaScript Libraries: React, Axios, Chart.js
2. **Backend**
    - Voting Microservice: A service that exposes APIs to create, read, update and delete voting resources such as political parties, candidates, votes, and ridings.
        - Language: JavaScript (NodeJS)
        - Framework: ExpressJS + graphQL
        - Persistence: MongoDB
        - Message Broker: RabbitMQ
    - Authentication Microservice: A service that enables authentication, and manages user resources.
        - Language: Python
        - Framework: FastAPI (Python)
        - Persistence: PostgreSQL
    - Websocket Microservice: A service that broadcasts votes in real-time by subscribing to a RabbitMQ queue.
        - Language: JavaScript (NodeJS)
        - Framework: ws
        - Message Broker: RabbitMQ
3. **Deployment**
    - Docker
    - Kubernetes (with Helm)

## Top 5 Technical Challenges
1. **Security and Authentication:** As an application to be used for an election, it is very important that the application is to be implemented with strong security as a consideration. Therefore, the way the application is deployed, how to store data, and how data can be accessed must be carefully considered. In the next bullet point, we discuss how security will be a challenge in the microservices. Furthermore, when dealing with authentication, we plan to utilize a combination of facial and voice recognition as a means for two factor authentication. The transition between first logging in with a username and password to the second factor of authentication will need to be carefully considered.
2. **Microservices:** Connecting all the services together will be a challenge. In class, we deal with monolithic applications, but in this project we hope to split everything into independent services and fuse it all in the end. Effectively combining all these services securely in production will add another challenge to our plate, such as stateless tokens.
3. **Charts and Maps:** This library is new to all of us, and we are hoping to use it for the map generation in the end. This does not seem trivial, and that is why it is a technical challenge.
4. **WebSockets:** WebSockets will be utilized to display data in real-time. As it is a different method of communicating to the server, there will be some challenges as not all members have dealt with continuous communication.
5. **React:** The team members have little to no experience in this library. We are trying to learn this over the reading week, so it will be easier to create the frontend.
