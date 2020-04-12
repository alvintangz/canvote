import { combineResolvers } from 'graphql-resolvers';
import { ForbiddenError, ValidationError } from 'apollo-server-express';
import Transaction from 'mongoose-transactions';
import { hardVerify, isVoter } from './auth';
import {
  Vote,
  Voter,
  PoliticalPartyCandidate,
} from '../../models';
import { rejectErrorIfNeeded } from './helpers';

const canVote = (parent, args, { me }) => new Promise((resolve, reject) => {
  Voter.findOne({ authId: me.id }, (err, res) => {
    if (rejectErrorIfNeeded(err, reject)) return;
    if (res) {
      return Vote.findOne({ voter: res.id }, (voteErr, voteRes) => {
        if (rejectErrorIfNeeded(voteErr, reject)) return;
        return resolve({
          flag: voteRes === null,
          info: voteRes === null ? null : "You have already voted.",
          voter: res
        });
      });
    }

    resolve({
      flag: false,
      info: "A district was never set for you.",
      voter: res
    });
  });
});

export default {
  canVote: combineResolvers(isVoter, canVote),
  vote: combineResolvers(isVoter, hardVerify, (parent, args, context) => new Promise((resolve, reject) => {
    canVote(parent, args, context).then(({ flag , voter }) => {
      if (flag) {
        PoliticalPartyCandidate.findById(args.candidate, (err, candidate) => {
          if (rejectErrorIfNeeded(err, reject)) return;
          if (!candidate) reject(new ValidationError('The candidate does not exist.'));
          else {
            // Roll back transaction if failure
            const transaction = new Transaction();
            transaction.insert('Vote', { voter });
            transaction.insert('BallotCount', { candidate });
            transaction.run().then(() => resolve(true)).catch(() => {
              transaction.rollback().then(() => {
                transaction.clean();
              }).catch(console.error).finally(() => resolve(false));
            });
          }
        });
      } else {
        reject(new ForbiddenError('You can not vote more than once.'));
      }
    });
  })),
};
