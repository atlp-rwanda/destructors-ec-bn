
const apiKey = 'your_api_key';
const apiSecret = 'your_api_secret';

const generateAuthToken = () => {
  const credentials = `${apiKey}:${apiSecret}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');
  return encodedCredentials;
};

export { generateAuthToken };
