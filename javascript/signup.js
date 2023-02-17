 // Handle signup form submit
 const signupLink = document.querySelector('#signup-link');
const signupModal = document.querySelector('#signup-modal');

signupLink.addEventListener('click', (event) => {
  event.preventDefault();
  signupModal.classList.remove('hidden');
});
const closeBtn = document.querySelector('#signup-modal .close-btn');

closeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  signupModal.classList.add('hidden');
});


document.querySelector('#signup-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    var email = document.querySelector('#email').value;
    var password = document.querySelector('#password').value;
    var name = document.querySelector('#name').value;

    // Save old user's email
    var oldEmail = firebase.auth().currentUser.email;
    var oldPassword = firebase.auth().currentUser.password;
    console.log(oldEmail + oldPassword);

    // Create user account
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        // Add user data to Firestore
        var userData = {
          name: name,
          email: email,
          isAdmin: true 
        };

        // Use the user ID as the document key
        firebase.firestore().collection("admin").doc(userCredential.user.uid).set(userData);

        // Logout the newly created user
        // firebase.auth().signOut().then(function() {
        //   console.log("User signed out");

        //   // Sign in the old user
        //   firebase.auth().signInWithEmailAndPassword(oldEmail, oldPassword)
        //     .then(function() {
        //       console.log("User signed in");
        //     })
        //     .catch(function(error) {
        //       console.log(error);
        //       alert('Error: ' + error.message);
        //     });
        }).catch(function(error) {
          console.log(error);
          alert('Error: ' + error.message);
        });
      })
      .catch(function(error) {
        console.log(error);
        alert('Error: ' + error.message);
      });
  
