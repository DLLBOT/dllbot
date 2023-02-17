
const db = firebase.firestore();
const form = document.querySelector('form');

// Select the announcement list container
const announcementList = document.getElementById('announcement-list');

// Save announcement to Firestore
const saveAnnouncement = (title, message) => {
  // Get the current timestamp as a string with the desired format
  const date = new Date();
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const amPm = date.getHours() >= 12 ? "PM" : "AM";
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.toLocaleString("en-US", { weekday: "short", month: 'short', date: 'numeric', year: 'numeric' });
  const timestamp = `${day}, ${hours}:${minutes} ${amPm}`;
  // Save the announcement to Firestore with a count and timestamp field
  db.collection('announcement').add({
    count: Date.now(),
    message: message,
    timestamp: timestamp,
    title: title
  })
  .then((docRef) => {
    console.log('Announcement saved with ID: ', docRef.id);
  })
  .catch((error) => {
    console.error('Error adding announcement: ', error);
  });
};

// Handle form submission
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  // Get the title and announcement values from the form
  const title = document.getElementById('title').value;
  const announcement = document.getElementById('announcement').value;
  
  // Save the announcement to Firestore
  saveAnnouncement(title, announcement);
  
  // Reset the form
  form.reset();
});

// Listen for changes to the announcements collection and update the UI
db.collection('announcement').orderBy('count', 'desc').onSnapshot((querySnapshot) => {
    // Clear the announcement list container
    announcementList.innerHTML = '';
    
    // Loop through the announcements and add them to the UI
    querySnapshot.forEach((doc) => {
      const announcement = doc.data();

      
      // Create a new announcement element
      const announcementElement = document.createElement('div');
      announcementElement.classList.add('bg-white','relative', 'p-4', 'my-4', 'rounded-lg', 'shadow');
      // Create delete button element
      
      // Create title element
      const titleElement = document.createElement('h2');
      titleElement.textContent = announcement.title;
      titleElement.classList.add('text-xl', 'font-bold', 'mb-2');
      announcementElement.appendChild(titleElement);
      
      // Create message element
      const messageElement = document.createElement('p');
      messageElement.textContent = announcement.message;
      messageElement.classList.add('text-gray-700', 'text-base');
      announcementElement.appendChild(messageElement);
      
      // Create timestamp element
      const timestampElement = document.createElement('p');
      timestampElement.textContent = announcement.timestamp;
      timestampElement.classList.add('text-gray-500', 'text-xs', 'mt-2');
      announcementElement.appendChild(timestampElement);
      
    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.innerHTML = '<i class="far fa-trash-alt"></i>';
    deleteButtonElement.classList.add('text-red-500', 'text-sm', 'ml-2', 'p-3', 'focus:outline-none', 'absolute', 'top-0', 'right-0', 'hover:text-black');

    deleteButtonElement.addEventListener('click', () => {
    // Create a confirmation modal
    const confirmationModal = document.createElement('div');
    confirmationModal.innerHTML = `
        <div class="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-lg">
            <h2 class="text-lg font-regular mb-4">Are you sure you want to delete this announcement?</h2>
            <div class="flex justify-end">
            <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-4" type="button" id="cancel-delete">Cancel</button>
            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="button" id="confirm-delete">Delete</button>
            </div>
        </div>
        </div>
    `;
    document.body.appendChild(confirmationModal);

    // Add event listeners for cancel and confirm buttons
    const cancelDeleteButton = confirmationModal.querySelector('#cancel-delete');
    cancelDeleteButton.addEventListener('click', () => {
        document.body.removeChild(confirmationModal);
    });
    const confirmDeleteButton = confirmationModal.querySelector('#confirm-delete');
    confirmDeleteButton.addEventListener('click', () => {
        db.collection('announcement').doc(doc.id).delete();
        document.body.removeChild(confirmationModal);
    });
    });

    // Add the delete button to the announcement element
    announcementElement.appendChild(deleteButtonElement);


      // Add the announcement element to the UI
      announcementList.appendChild(announcementElement);
    });
  });
  
  