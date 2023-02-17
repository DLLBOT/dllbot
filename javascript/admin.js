

// Get a reference to the queries collection in Firestore
var queriesRef = firebase.firestore().collection('queries');


// Listen for click events on the button
const addButton = document.getElementById('addButton');
const modal = document.getElementById('modal');
const queryForm = document.getElementById('queryForm');
const newQueryInput = document.getElementById('newQuery');
const newResponseInput = document.getElementById('newResponse');
const submitButton = document.getElementById('submit');
const cancelButton = document.getElementById('cancel');

// Show the modal form when the button is clicked
addButton.addEventListener('click', function() {
  modal.classList.remove('hidden');
});

// Hide the modal form when the Cancel button is clicked
cancelButton.addEventListener('click', function() {
  modal.classList.add('hidden');
});

// Add the new query and response to the database when the Submit button is clicked
submitButton.addEventListener('click', function() {
  const newQuery = newQueryInput.value;
  const newResponse = newResponseInput.value;
  const newTimestamp = firebase.firestore.FieldValue.serverTimestamp();

  // Add the new query and response to the database
  queriesRef.add({
    query: newQuery,
    response: newResponse,
    timestamp: newTimestamp
  })
  .then(function(docRef) {
    console.log('New query added with ID: ', docRef.id);
    // Hide the modal form
    modal.classList.add('hidden');
  })
  .catch(function(error) {
    console.error('Error adding new query: ', error);
  });
});




// Get a reference to the table element
var table = document.getElementById('queries-table');

// Create a new div to contain the table
var tableContainer = document.createElement('div');
tableContainer.classList.add('overflow-x-auto','table-bg');
// Append the div to the page
document.body.appendChild(tableContainer);
// Add styles to the table container for scroll
tableContainer.style.height = '400px';
tableContainer.style.overflow = 'auto';
// Add the table to the div
tableContainer.appendChild(table);

// Update the table styles
table.classList.add('w-full', 'table-auto', 'border-collapse');

// Listen for realtime updates to the queries collection in Firestore
queriesRef.orderBy('timestamp', 'desc').onSnapshot(function(querySnapshot){
  // Clear the table
  table.innerHTML = '';

    // Loop through each query document and add a new row to the table
      querySnapshot.forEach(function(doc) {
        var query = doc.data().query;
        var response = doc.data().response;
        // Create a new table row
        var row = table.insertRow();
        row.setAttribute('data-id', doc.id);

        // Add the query and response to the row
        var queryCell = row.insertCell(0);
        queryCell.innerHTML = query;
        queryCell.classList.add('w-32', 'px-4', 'py-2', 'text-white', 'font-semibold', 'border-b', 'border-gray-200');
        var responseCell = row.insertCell(1);
        responseCell.innerHTML = response;
        responseCell.classList.add('w-64', 'px-4', 'py-2', 'text-white', 'font-semibold', 'border-b', 'border-gray-200');

        // Add action buttons to the row
        var actionCell = row.insertCell(2);
        actionCell.classList.add('w-32', 'px-4', 'py-2', 'text-center',  'text-white', 'border-b', 'border-gray-200');
    // Add update button to the action cell
    var updateBtn = document.createElement('button');
    updateBtn.classList.add('bg-blue-500', 'text-white', 'font-bold', 'py-1', 'px-4', 'rounded' );
    updateBtn.textContent = 'Update';
    var modal_update = document.getElementById('modal_update');
    var cancelUpdate = document.getElementById('updateCancel');
    var new_updateQuery = document.getElementById('updateQuery');
    var new_updateResponse= document.getElementById('updateResponse');
    var new_updateSubmit = document.getElementById('updateSubmit');
    var db = firebase.firestore().collection('queries');
    var refQuery;
    
    updateBtn.addEventListener('click', function() {
      modal_update.classList.remove('hidden');
      var queryId = row.getAttribute('data-id');
      refQuery = db.doc(queryId);
    });
    
    cancelUpdate.addEventListener('click', function() {
      modal_update.classList.add('hidden');
    });
    
    new_updateSubmit.addEventListener('click',function(){
      var updateData = {
        query: new_updateQuery.value,
        response: new_updateResponse.value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      refQuery.update(updateData)
        .then(function() {
          console.log('Query updated successfully');
          modal_update.classList.add('hidden');
        })
        .catch(function(error) {
          console.log('Error updating query: ', error);
        });
    });
    
    actionCell.appendChild(updateBtn);
    console.log('data-id');
    


    // Add delete button to the action cell
        var deleteBtn = document.createElement('button');
        deleteBtn.classList.add('bg-red-500', 'text-white', 'font-bold', 'py-1', 'px-4', 'rounded', 'ml-2');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() {
            // Create the confirmation modal
            var modalBackdrop = document.createElement('div');
            modalBackdrop.classList.add('fixed', 'inset-0', 'bg-gray-800', 'bg-opacity-75', 'z-10');
            var modalContent = document.createElement('div');
            modalContent.classList.add('bg-white', 'w-96', 'mx-auto', 'mt-20', 'p-6', 'rounded', 'shadow-lg');
            var modalTitle = document.createElement('h3');
            modalTitle.classList.add('text-lg', 'font-bold', 'mb-4');
            modalTitle.textContent = 'Confirm Deletion';
            var modalText = document.createElement('p');
            modalTitle.classList.add('mb-4');
            modalText.textContent = 'Are you sure you want to delete this query?';
            var confirmBtn = document.createElement('button');
            confirmBtn.classList.add('bg-red-500', 'text-white', 'font-bold', 'py-1', 'px-4', 'rounded', 'mr-2');
            confirmBtn.textContent = 'Confirm';
            var cancelBtn = document.createElement('button');
            cancelBtn.classList.add('bg-gray-500', 'text-white', 'font-bold', 'py-1', 'px-4', 'rounded');
            cancelBtn.textContent = 'Cancel';
            modalContent.appendChild(modalTitle);
            modalContent.appendChild(modalText);
            modalContent.appendChild(confirmBtn);
            modalContent.appendChild(cancelBtn);
            modalBackdrop.appendChild(modalContent);
            document.body.appendChild(modalBackdrop);

            // Add event listener to confirm button
            confirmBtn.addEventListener('click', function() {
                // Code to delete the query
                var queryId = row.getAttribute('data-id');
                var queryRef = firebase.firestore().collection('queries').doc(queryId);
                queryRef.delete()
                  .then(function() {
                      console.log('Query deleted successfully');
                      tableBody.removeChild(row);
                  })
                  .catch(function(error) {
                      console.log('Error deleting query: ', error);
                  });

                // Remove the modal
                modalBackdrop.remove();
            });

            // Add event listener to cancel button
            cancelBtn.addEventListener('click', function() {
                // Remove the modal
                modalBackdrop.remove();
            });
          });
        actionCell.appendChild(deleteBtn);
    });
  
});