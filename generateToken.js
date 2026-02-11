const fs = require('fs');
const { google } = require('googleapis');

console.log('Starting Gmail OAuth token generation...');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const credentials = JSON.parse(
  fs.readFileSync('credentials.json', 'utf8')
);

const { client_id, client_secret, redirect_uris } =
  credentials.installed;

const auth = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const url = auth.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('\nOPEN THIS URL IN YOUR BROWSER:\n');
console.log(url);
