import axios, { AxiosError } from 'axios';

const errorListeners: ((error: AxiosError) => void)[] = [];

function onError(listener: (error: AxiosError) => void) {
  errorListeners.push(listener);
}

function notifyErrorListeners(error: AxiosError) {
  errorListeners.forEach(listener => {
    listener(error);
  });
}

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  notifyErrorListeners(error);
});

export default { onError, axios };
