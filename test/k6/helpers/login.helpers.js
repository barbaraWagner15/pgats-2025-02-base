import http from 'k6/http';
import { check } from 'k6';
import { getBase } from './config.base.helpers.js';
import { Trend } from 'k6/metrics';

const trendRegister = new Trend('register_duration');
const trendLogin = new Trend('login_duration');

export function registerUser(name, email, password) {
  const baseURL = getBase();
  const url = `${baseURL}/api/users/register`;
  const userData = { name, email, password };
  const payload = JSON.stringify(userData);

  const response = http.post(url, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  trendRegister.add(response.timings.duration);

  check(response, {
    'registerUser: status code is 201': (r) => r.status === 201
  });

  return response;
}

export function login(email, password) {
  const baseURL = getBase();
  const url = `${baseURL}/api/users/login`;
  const payload = JSON.stringify({ email, password });

  const response = http.post(url, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  trendLogin.add(response.timings.duration);

  check(response, {
    'login: status code is 200': (r) => r.status === 200
  });

 const { token = null } = response.json() || {};
 return token;
}

