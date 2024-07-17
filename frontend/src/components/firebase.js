// src/firebase.js
import firebase from 'firebase/compat/app'; // Import the compat version for Firebase 9 or newer
import 'firebase/compat/firestore'; // Import other Firebase services as needed

const firebaseConfig = {
  apiKey: 'AIzaSyA_j4hpXESiCFO5KtmMjqcM9cCl3-QjfL0',
  authDomain: 'dalvacationhome-427921.firebaseapp.com',
  projectId: 'dalvacationhome-427921',
  storageBucket: 'dalvacationhome-427921.appspot.com',
  messagingSenderId: '606773852695',
  appId: '1:606773852695:web:6f0c1673f701a05ee07a52'
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

// Function to update a Firestore document
const updateDocument = async (collectionName, docId, newData) => {
  try {
    const docRef = db.collection(collectionName).doc(docId);
    await docRef.update(newData);
    console.log('Document updated successfully');
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

export { db, updateDocument };