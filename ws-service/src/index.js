const WebSocket = require('ws');
const { PORT } = require('./config');
const connectDb = require('./db');
const {
  BallotCount, PoliticalParty, PoliticalPartyCandidate, District,
} = require('./models');

// Print start up message
console.log(
  `  ___        __   __   _       
 / __|__ _ _ \\ \\ / /__| |_ ___ 
| (__/ _\` | ' \\ V / _ \\  _/ -_)
 \\___\\__,_|_||_\\_/\\___/\\__\\___|`,
  '\nDharmik Shah; Alvin Tang; Mikhail Makarov\n',
);
console.log(`Server ready at http://localhost:${PORT}`);

// Connect to MongoDB database
connectDb();

const getDataToBroadcast = () => new Promise((resolve, reject) => {
  const toBroadcast = {
    districts: [],
    parties: [],
    total: null,
    lastUpdated: null,
  };

  Promise.all([
    District.find({}),
    PoliticalParty.find({}),
    PoliticalPartyCandidate.find({}),
    BallotCount.find({}),
  ]).then(([districts, parties, candidates, ballots]) => {
    // external
    const whoWonWhichDistrict = {};

    // create district object
    toBroadcast.districts = districts.map((district) => {
      const obj = {
        id: district.id.toString(),
        name: district.name,
        leadingPartyInDistrict: [],
        candidates: [],
      };

      // find the leading party
      // 1. find all the candidates in this district
      const candInDistrict = candidates.filter((c) => (
        c.district.toString() === district.id.toString()
      ));
      const candInDistrictById = candInDistrict.map((c) => c.id.toString());

      // 2. find how many ballots each of these candidates got
      const candToBallotCount = candInDistrictById.map((c) => ({ [c]: 0 }));

      ballots.forEach((b) => {
        // see if this ballot belongs to any candidates
        const index = candInDistrictById.indexOf(b.candidate.toString());
        if (index !== -1) {
          candToBallotCount[index][b.candidate.toString()] += 1;
        }
      });

      // 3. in this district, find the candidates with the most votes
      const maxValue = Math.max.apply(0, candToBallotCount.map((c) => c[Object.keys(c)]));
      const totalSum = candToBallotCount.map((c) => c[Object.keys(c)]).reduce((a, b) => a + b, 0);

      const mostVotedCandInDist = candToBallotCount
        .filter((c) => c[Object.keys(c)] === maxValue).map((f) => Object.keys(f)[0]);

      // 4. find the party that these candidates belong to
      // expose this outside because party needs this info
      const leadingParty = mostVotedCandInDist.map((c) => {
        // find the index, it can't be -1
        const index = candInDistrictById.indexOf(c);
        return candInDistrict[index].political_party.toString();
      });
      if (maxValue !== 0) whoWonWhichDistrict[obj.id] = leadingParty;

      obj.leadingPartyInDistrict = maxValue !== 0 ? leadingParty : null;
      obj.leadingPartyName = maxValue !== 0 ? (
        parties.filter((p) => leadingParty.includes(p.id.toString())).map((f) => f.name)
      ) : null;

      // now for the candidates
      const candidatesToAdd = candInDistrictById.map((c, i) => {
        const voteCount = candToBallotCount[i][c];
        return {
          id: c,
          name: candInDistrict[i].name,
          votePercentageWithinDistrict: maxValue === 0 ? 0 : (
            ((voteCount / totalSum) * 100).toFixed(2)
          ),
          voteCount,
        };
      });

      obj.candidates = candidatesToAdd;
      return obj;
    });

    // now do parties
    toBroadcast.parties = parties.map((party) => {
      const obj = {
        id: party.id.toString(),
        name: party.name,
        voteCount: 0,
        projectedNumberOfSeats: 0,
      };

      // calculate the vote count
      // 1. from all the candidates, find the ones that belong to this party
      const candsInParty = candidates.filter((c) => (
        c.political_party.toString() === party.id.toString()));
      const candsInPartyById = candsInParty.map((c) => c.id.toString());

      // 2. out of all the ballots, see how many correspond to any of these cands
      // that's how many correspond to this party
      const votesToParty = ballots
        .filter((b) => candsInPartyById.indexOf(b.candidate.toString()) !== -1).length;
      obj.voteCount = votesToParty;

      // calculate the projected number of seats
      // use the exposed variable
      let numOfDiscWon = 0;

      Object.keys(whoWonWhichDistrict).forEach((w) => {
        // if this party is in the result, then add it
        // there is a possibility that two parties might be tied, so in this case both will benefit
        if (whoWonWhichDistrict[w].indexOf(obj.id) !== -1) {
          numOfDiscWon += 1;
        }
      });

      obj.projectedNumberOfSeats = numOfDiscWon;
      return obj;
    });

    // now do total
    toBroadcast.total = {
      districts: districts.length,
      parties: parties.length,
    };

    // now do date
    toBroadcast.lastUpdated = new Date();
    resolve(toBroadcast);
  }).catch((err) => {
    console.error(err);
    console.log('-------');
    if (err instanceof Array) {
      if (err.length > 0) return reject(err[0]);
      return reject(new Error('Something went wrong in the websocket'));
    }
    return reject(err);
  });
});

// Store last state of broadcast
let previousBroadcast = { error: 'Initial broadcast data not set.' };

const wss = new WebSocket.Server({ port: PORT });

const broadcastData = (data) => wss.clients.forEach((client) => client.send(data));

// On connection to the websocket, send the previous broadcast
wss.on('connection', (ws) => {
  ws.send(JSON.stringify(previousBroadcast));
});

// On start, set the initial state of to broadcast
getDataToBroadcast().then((data) => {
  previousBroadcast = data;

  const pollAndBroadcast = () => {
    getDataToBroadcast().then((toBroadcast) => {
      // Broadcast and store the data to broadcast for any new connections
      broadcastData(JSON.stringify(toBroadcast));
      previousBroadcast = toBroadcast;
    }).catch((err) => {
      // Broadcast error in simple terms
      broadcastData(JSON.stringify({ error: err.message ? err.message : err.toString() }));
    }).finally(() => {
      // Polling to get data to broadcast and broadcast it
      setTimeout(pollAndBroadcast, 5000);
    });
  };

  // Initialize the polling
  setTimeout(pollAndBroadcast, 5000);
}).catch((err) => console.log('Error retrieving initial broadcast data.', err));
