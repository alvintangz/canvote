# CanVote :canada:

[Video Link Here](https://www.youtube.com/watch?v=pdOD73GqIrU&feature=youtu.be)

Please go to respective folders to access specific API documentation.

----

## Team Members
- **[Dharmik Shah](https://github.com/dharm1k987)**
    - UTORid: shahdha2
    - Student number: 1003417153
- **[Alvin Tang](https://github.com/alvintangz)**
    - UTORid: tangalvi
    - Student Number: 1003414325
- **[Mikhail Makarov](https://github.com/AVoxyz)**
    - UTORid: makarovm
    - Student Number: 1003401525

## Description of Web Application
**CanVote** :canada:, short for Canada Vote, is a web application that allows Canadian voters to vote for a candidate in their electoral district in a quick and efficient fashion. As well, it features the ability to show real-time election results, allowing the public to understand the grasp of which direction the country is heading towards. Overall, the web application works in the confines of an election, where the election contains multiple political parties, and electoral districts (or ridings) with candidates from each political party.

To ensure the stability of the election on **CanVote**, there are a variety of [user roles](#CanVote-Roles-and-User-Types) with different responsibilities. As well, to ensure that a voter is who they say they are, they will be authenticated with two-factor authentication. The second factor of authentication will be a unique method of asking the voter to record themselves through HTML media capture saying a phrase randomly provided to them. When the recording is submitted, a combination of face and voice recognition technologies will be used to verify that the voter is indeed an individual registered to vote and is prepared to vote for themselves. With a combination of these features, it will make it harder for third-party manipulators to modify election results.

*Side Note: For the sake of this project, the application will not account for all voters in the real-world as users of the application will have to speak english; can register with [an election officer](#election-officer-authenticated-user) beforehand; has access to a device with a modern browser; and has a webcam and voice recorder on their device.*

A public view of real-time riding results and which parties are leading in the polls can be viewed through bar charts in the application. When the voting period is over (i.e. all electoral districts have closed voting), a choropleth map can be accessed to view who has won a majority in each riding, and the overall results (similar to what you would see at the end of an election).

The inspiration for this web applications comes as statistics show that elections are [disproportionately against low-income citizens](https://www.theatlantic.com/politics/archive/2014/01/why-are-the-poor-and-minorities-less-likely-to-vote/282896/) (in the United States). With an application like **CanVote**, it can remove some (but not all) barriers such as being busy or not being able to physically go to a voting station. **CanVote** allows voters to register in advance with [election officers](#election-officer-authenticated-user) anytime before an election and then cast their ballot quickly during the election period. As well, recent news from the [2020 Iowa democratic caucuses](https://www.cbc.ca/news/world/iowa-caucus-democrats-1.5450749) has inspired us for a challenge to build something that can be better implemented and simple to use.

### CanVote Roles and User Types

#### Administrative Officer (Authenticated User)
An administrative officer is a non-bias actor which manages the foundations of the election, such as political parties, ridings, candidates, and [election officers](#election-officer-authenticated-user). This role can be thought of as a member of the administrative staff in Elections Canada. The resources they create is the first step in allowing voters to vote through the system.

#### Election Officer (Authenticated User)
An election officer is a non-bias actor which is responsible for managing voters in electoral districts. This role can be thought of as a government employee in a government office that registers a voters into the system, enabling voters access to the system.

#### Voter (Authenticated User)
A voter can vote once for a specific political party within their electoral district. When a vote is added, two resources are modified to ensure a voter doesn't vote again and a vote has been added - this ensures anonymity. To create an account, a voter should present government issued id to an election officer, and then the election officer should be able to proceed with creating their account. A picture of the voter should be taken (used for facial recognition authentication) and attached to the created account during the account creation process.

#### Any Users
Like a real election, anyone can view voting results. As such, any user can view the voting results of each electoral district in real time through a bar chart. After all electoral districts have closed voting, then a choropleth map displaying parties that have won each electoral district can be viewed.

## Key Features to be Completed by Beta Version
Due: March 15, 2020

- Ability for Administrative Officers to create, update and delete Election Officers, political parties, ridings and candidates
- Ability for Election Officers to create, update, and delete Voters
- ~~User authentication completed without facial and voice recoginition~~
- Ability for the voter to vote (only vote once in their assigned electoral district)

## Key Features to be Completed by Final Version
Due: March 29, 2020

- Bar chart display that updates with every vote
- Choropleth map that shows the final results
- ~~Facial recognition login for the voters only~~

## Description of Technologies to be Utilized

1. **Frontend**
    - CSS Framework:
        - [Web Experience Toolkit (WET)](https://wet-boew.github.io/v4.0-ci/index-en.html): WET is a front-end framework designed and developed by the Government of Canada
    - JavaScript Libraries:
        - [React](https://reactjs.org/): Component based library to build repetitive UI.
        - [Axios](https://github.com/axios/axios): Promise based HTTP Client used to make HTTP ajax requests.
        - [Chart.js](https://www.chartjs.org/): Chart library used for displaying election results
2. **Backend**
    - **Voting Microservice:** A service that exposes APIs to create, read, update and delete voting resources such as political parties, candidates, votes, and ridings.
        - Language: JavaScript (NodeJS)
        - Frameworks: [ExpressJS](https://expressjs.com/) + [GraphQL.js](https://github.com/graphql/graphql-js)
        - Persistence: [MongoDB](https://www.mongodb.com/)
    - **Authentication Microservice:** A service that enables authentication, and manages user resources.
        - Language: Python
        - Framework: [FastAPI](https://github.com/tiangolo/fastapi)
        - Persistence: [PostgreSQL](https://www.postgresql.org/)
    - **Websocket Microservice:** A service that broadcasts votes in real-time through WebSockets by subscribing to data in MongoDB through Change Streams.
        - Language: JavaScript (NodeJS)
        - Framework: [ws](https://github.com/websockets/ws)
3. **Deployment**
    - [Docker](https://www.docker.com/)
    - [Kubernetes](https://kubernetes.io/) (with [Helm](https://helm.sh/))

## Top 5 Technical Challenges
1. **Security and Authentication:** As an application to be used for an election, it is very important that the application is to be implemented with strong security as a consideration. Therefore, the way the application is deployed, how to store data, and how data can be accessed must be carefully considered. In the next bullet point, we discuss how security will be a challenge with microservices. Furthermore, when dealing with authentication, we plan to utilize a combination of facial and voice recognition as a means for two factor authentication. The transition between first logging in with a username and password to the second factor of authentication will need to be carefully considered.
2. **Microservices:** Connecting all the services together will be a challenge. In class, we deal with monolithic applications, but in this project we hope to split everything into independent services and fuse it all in the end. Effectively combining all these services securely in production will add another challenge to our plate, such as stateless tokens.
3. **Charts and Maps:** This library is new to all of us, and we are hoping to use it for the map generation in the end. This does not seem trivial, and that is why it is a technical challenge.
4. **WebSockets:** WebSockets will be utilized to display data in real-time. As it is a different method of communicating to a backend compared to REST through HTTP, there will be some challenges as not all members have dealt with continuous communication.
5. **React:** The team members have little to no experience in this library. We are trying to learn this over the reading week, so it will be easier to create the frontend.
