// api/_firebase.js  — partagé entre toutes les routes
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Vercel stocke les variables d'env ; les \n doivent être restaurés
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: 'https://database-5583e-default-rtdb.firebaseio.com',
  });
}

const db = admin.firestore();
module.exports = { admin, db };
