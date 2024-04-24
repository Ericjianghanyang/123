import axios from 'axios';

const clientId = 'Ql6RFVXUSKI4v2bF';
const clientSecret = 'KrKcMwhP1qIcvyIJuLOuHzHPmy0JxbXbLKVuzk8iVwSRAeq7VRw5sa4JHv9a1unI';
const scope = 'camera:write room:write alert:write person:write user:write group:write invitation:write person_info:write';

let token = null;
let tokenExpiration = null;

export const fetchAccessToken = async () => {
  const url = 'https://oauth.ailecare.cn/v1.0/token';
  try {
    const response = await axios.post(url, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: scope
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, expires_in } = response.data;
    token = access_token;
    tokenExpiration = Date.now() + expires_in * 1000;
    console.log('Access token fetched successfully.');

    setTimeout(fetchAccessToken, 10 * 60 * 1000); // Refresh token every 10 minutes
  } catch (error) {
    console.error('Error fetching access token:', error);
    setTimeout(fetchAccessToken, 10 * 60 * 1000); // Retry after 10 minutes if failed
  }
};

export const getAccessToken = () => {
  if (!token || Date.now() > tokenExpiration) {
    console.warn('Token expired or missing, fetching new token.');
    fetchAccessToken(); // Fetch a new token if it's expired or not yet fetched
  }
  return token;
};
