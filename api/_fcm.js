// api/_fcm.js — helper envoi FCM v1
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

const PROJECT_ID = 'database-5583e';
const FCM_URL = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });
  const client = await auth.getClient();
  const t = await client.getAccessToken();
  return t.token;
}

async function sendFCM(token, title, body) {
  const accessToken = await getAccessToken();
  const res = await fetch(FCM_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      message: {
        token,
        notification: { title, body },
        webpush: {
          notification: {
            title, body,
            icon: '/icon.png',
            requireInteraction: true,
          },
          fcm_options: { link: '/' },
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'FCM error');
  }
  return res.json();
}

module.exports = { sendFCM };
