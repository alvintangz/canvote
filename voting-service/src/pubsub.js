import { PubSub } from '@google-cloud/pubsub';
import { Voter } from './models';

const pubSubClient = new PubSub();

const listenToCreateLocalVoters = (subscriptionName) => {
  const subscription = pubSubClient.subscription(subscriptionName);

  const messageHandler = (message) => {
    Voter.findOne({ authId: message.data.user.id }, (err, res) => {
      if (!res) {
        Voter.create();
      }
    });
    // Acknowledge receipt of the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);
};

export default listenToCreateLocalVoters;
