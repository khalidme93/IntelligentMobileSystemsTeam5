import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq1kRS37EtKEAaj8R7Z4pqKzCK67RsAJY",
  authDomain: "intelligentmobilesystemsteam5.firebaseapp.com",
  databaseURL: "https://intelligentmobilesystemsteam5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "intelligentmobilesystemsteam5",
  storageBucket: "intelligentmobilesystemsteam5.appspot.com",
  messagingSenderId: "1047517056434",
  appId: "1:1047517056434:web:08ce4813881625211b28ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);