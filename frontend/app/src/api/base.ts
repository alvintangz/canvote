import axios from 'axios';

const errorListeners = [];

function onError() {
  errorListeners.push(errorListeners);
}

function notifyErrorListeners(error) {
  errorListeners.forEach(listener => {
    listener(error);
  });
}

axios.interceptors.response.use(null, (error) => {
  notifyErrorListeners(error);
});

export default { onError, axios };
