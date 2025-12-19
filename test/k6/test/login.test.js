import { SharedArray } from 'k6/data';
import { group } from 'k6';
import { login } from '../helpers/login.helpers.js';

const loginDataRaw = open('../helpers/users.json');
const loginData = new SharedArray('login data', function () {
  return JSON.parse(loginDataRaw);
});

export const options = {
  vus: 3,  
  duration: '90s',
  thresholds: {
   http_req_duration: ['p(90)<=500', 'p(95) < 600']
  },
};

export default function () {
    const { email, password } = loginData[__VU - 1];

    group('User Login', () => {
        login(email, password);
    });
}