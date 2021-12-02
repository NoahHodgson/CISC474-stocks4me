// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWH1fObpVBQqO_M1jhTLz8HoQbocK1ZGU",
  authDomain: "cisc474-stocks4me.firebaseapp.com",
  databaseURL: "https://cisc474-stocks4me-default-rtdb.firebaseio.com",
  projectId: "cisc474-stocks4me",
  storageBucket: "cisc474-stocks4me.appspot.com",
  messagingSenderId: "419878406960",
  appId: "1:419878406960:web:2e936e8bdae8fd8dacd6f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

signInWithPopup(auth, provider)
    .then((result) =>{
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
});