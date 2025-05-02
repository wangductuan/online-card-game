const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-service-account-file.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wang-2025.firebaseio.com' // URL của Firebase Realtime Database
});

const db = admin.database();
module.exports = db;
