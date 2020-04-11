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
      Vote.findOne({ voter: res.id }, (voteErr, voteRes) => {
        if (rejectErrorIfNeeded(voteErr, reject)) return;
        resolve(voteRes === null);
      });
    }
    resolve(false);
  });
});

export default {
  canVote: combineResolvers(isVoter, canVote),
  vote: combineResolvers(isVoter, hardVerify, (parent, args, context) => new Promise((resolve, reject) => {
    canVote(parent, args, context).then((ableToVote) => {
      if (ableToVote) {
        PoliticalPartyCandidate.findById({ id: args.candidate }, (err, res) => {
          if (rejectErrorIfNeeded(err, reject)) return;
          if (!res) reject(new ValidationError('The candidate does not exist.'));
          else {
            // Roll back transaction if failure
            const transaction = new Transaction();
            transaction.insert('Vote', { voter: args.voter });
            transaction.insert('BallotCount', { candidate: args.candidate });
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
