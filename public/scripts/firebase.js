import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, ref, onValue } from "@firebase/database";

// FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyDWH1fObpVBQqO_M1jhTLz8HoQbocK1ZGU",
    authDomain: "cisc474-stocks4me.firebaseapp.com",
    databaseURL: "https://cisc474-stocks4me-default-rtdb.firebaseio.com",
    projectId: "cisc474-stocks4me",
    storageBucket: "cisc474-stocks4me.appspot.com",
    messagingSenderId: "419878406960",
    appId: "1:419878406960:web:2e936e8bdae8fd8dacd6f5"
};

// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
console.log(db)


console.log(document.getElementById('login'))
document.getElementById('login').addEventListener("click", googleSignIn())

// HANDLES LOGIN
function googleSignIn(){
  console.log("Login button triggered")
  signInWithPopup (auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = provider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
  });
}

// console.log(document.getElementById('logout'))
// document.getElementById('logout').addEventListener("click", googleLogOut)


// THIS TRIGGERS CERTAIN ACTIONS BASED ON THE USERS LOGIN STATUS 
onAuthStateChanged(auth, (user) => {
  // IF USER IS LOGGED IN THEN DO...
  if (user) {
    // console.log(user);
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;

    // PRINTING ON CONSOLE FOR TESTING 
    console.log(displayName)
    console.log(photoURL)

    document.getElementById("userInfo").innerHTML = `<img src="${photoURL}">`
    document.getElementById("usrNm").innerHTML = `<p>Name: ${displayName}</p>`

    // ELSE DO...
  } else {
    // User is signed out
    console.log("User signed out")
  }
});

// HANDLES LOGOUT
// function googleLogOut(){
//   console.log("Logout button triggered")
//   signOut(auth).then(() => {

//   })
//   .catch((error) =>{
//     console.log(error)
//   })
// }


