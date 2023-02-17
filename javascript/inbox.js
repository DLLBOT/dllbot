const userList = document.getElementById("userList");
const messageContainer = document.getElementById("messageContainer");
const replyForm = document.getElementById("replyForm");
const replyInput = document.getElementById("replyInput");

// Reference to your Firebase Firestore collection
const userInfoRef = firebase.firestore().collection("userInfo");
let selectedUser = null; // keep track of the selected user
let userID = null; // keep track of the selected user's ID

userInfoRef.onSnapshot(querySnapshot => {
  userList.innerHTML = "";
  querySnapshot.forEach(doc => {
    const user = doc.data();
    const id = doc.id;

    // Check if user has messages in the admin's conversation
    firebase.database().ref("messages/" + id + "_admin" + "/convo").once("value", snap => {
      if (snap.exists()) {
        const li = document.createElement("li");
        li.innerHTML = user.Firstname && user.Lastname ? `${user.Firstname} ${user.Lastname}` : user.Username;

        li.addEventListener("click", () => {
          if (selectedUser) {
            selectedUser.classList.remove("selected"); // remove selected class from previously selected user
          }
          selectedUser = li; // set the current user as the selected user
          li.classList.add("selected"); // add selected class to the current user
          userID = id;

          firebase.database().ref("messages/" + userID + "_admin" + "/convo").on("value", snap => {
            messageContainer.innerHTML = "";
            snap.forEach(childSnapshot => {
              const message = childSnapshot.val();
              const div = document.createElement("div");

              if (message.username === "Admin") {
                div.innerHTML = `
                  <h2 class=" flex justify-end m-2 font-medium">Admin</h2>          
                  <div class="flex justify-end m-2">
                    <div class="bg-blue-500 text-white p-4 rounded-lg">
                      <p>${message.message}</p>
                      <p class="text-xs">${message.timestamp}</p>
                    </div>
                  </div>
                `;
                messageContainer.appendChild(div);
              } else {
                div.innerHTML = `
                  <h2 class="text-white font-medium">${message.username}</h2>
                  <div class="flex justify-start m-4">
                    <div class="bg-gray-200 p-4 rounded-lg">
                      <p class="text-gray-700">${message.message}</p>
                      <p class="text-gray-500 text-xs">${message.timestamp}</p>
                    </div>
                  </div>
                `;
                messageContainer.appendChild(div);
              }
            });
            const latestMessage = messageContainer.lastElementChild;
            latestMessage.scrollIntoView();
          });
        });
        userList.appendChild(li);
      }
    });
  });
});

  // Count the number of new messages
// let newMessageCount = 0;
// for (let i = 0; i < messages.length; i++) {
//   if (messages[i].to === 'admin' && !messages[i].seen) {
//     newMessageCount++;
//   }
// }

// Display the new message count on the inbox page





replyForm.addEventListener("submit", e => {
  e.preventDefault();
  const reply = replyForm.replyInput.value;
  const date = new Date();
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  const timestamp = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })+ ' ' +  date.toLocaleTimeString('en-US', options);
  console.log(userID);
  // User is signed in.
  firebase.database().ref("messages/" + userID + "_admin" + "/convo").push({
    username: "Admin",
    message: reply,
    timestamp: timestamp
  });
  replyForm.reset();
});
// Get the delete conversation button and confirmation modal
    const deleteConversationBtn = document.getElementById("deleteConversationBtn");
    const confirmationModal = document.getElementById("confirmationModal");

    // Function to show the confirmation modal
    function showConfirmationModal() {
        confirmationModal.classList.remove("hidden");
    }

    // Function to hide the confirmation modal
    function hideConfirmationModal() {
        confirmationModal.classList.add("hidden");
    }

    // Function to delete the conversation
    function deleteConversation() {
    // Delete the conversation from the Firebase Realtime Database
        firebase.database().ref("messages/" + userID + "_admin").remove();
        console.log("You've deleted a conversation.")
    // Hide the delete conversation button and confirmation modal
        deleteConversationBtn.classList.add("hidden");
        hideConfirmationModal();
        replyInput.value = "";
        
        // Hide the confirmation modal
        confirmationModal.classList.add("hidden");
        // Clear the message container
        messageContainer.innerHTML = "";
    }

    // Add click event listeners to the delete conversation button and cancel button in the confirmation modal
    deleteConversationBtn.addEventListener("click", showConfirmationModal);
    document.getElementById("cancelBtn").addEventListener("click", hideConfirmationModal);

    // Add click event listener to the confirm button in the confirmation modal
    document.getElementById("confirmBtn").addEventListener("click", deleteConversation);

    // Update the delete conversation button visibility based on whether a conversation is selected
    function updateDeleteConversationBtn() {
    if (selectedUser) {
    deleteConversationBtn.classList.remove("hidden");
    } else {
    deleteConversationBtn.classList.add("hidden");
    }
    }

    // Call the updateDeleteConversationBtn function when the selected user changes
    userList.addEventListener("click", updateDeleteConversationBtn);


