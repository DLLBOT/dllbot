var firebaseConfig = {
    apiKey: "AIzaSyDUTbev7QPDNszHXnmyPC8r-ILN80aJ38o",
    authDomain: "dllbot-85934.firebaseapp.com",
    databaseURL: "https://dllbot-85934-default-rtdb.firebaseio.com",
    projectId: "dllbot-85934",
    storageBucket: "dllbot-85934.appspot.com",
    messagingSenderId: "190659606318",
    appId: "1:190659606318:web:ba03d32c4059f4fa03acbf",
    measurementId: "G-MK5RQ5PHHN"
  };
  firebase.initializeApp(firebaseConfig);
//user-navbar-logout
var auth = firebase.auth();
// DISPLAY USERNAME
auth.onAuthStateChanged(function(user) {
if (user) {
// User is signed in, get their uid
var uid = user.uid;
console.log(uid);

// Get a reference to your Firestore database
var db = firebase.firestore();

// Query the "admin" collection for the current user's document
var adminRef = db.collection("admin").doc(uid);
adminRef.get().then(function(doc) {
  if (doc.exists) {
    // User's document exists, get the username field
    var username = doc.data().name;
    // Do something with the username
    console.log("Username:", username);
    document.getElementById("username").textContent = username;
  } else {
    // User's document does not exist
    console.log("User's document not found");
  }
}).catch(function(error) {
  console.log("Error getting user's document:", error);
});
} else {
// User is signed out, do something else
}
});
//dropdown
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

dropdownBtn.addEventListener('click', () => {
  dropdownMenu.classList.toggle('hidden');
  dropdownBtn.classList.toggle("active");
});

// LOGOUT
var logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", function() {
firebase.auth().signOut().then(function() {
// Sign-out successful
console.log("User signed out");
}).catch(function(error) {
// An error happened
console.log("Error signing out:", error);
});
});
