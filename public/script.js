// Define a class for submissions
class Submit {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

const giftForms = document.querySelectorAll('.gift-form');
// Initialize an array to store submissions
let submissions = [];

// Add this code to the script.js file
document.addEventListener('DOMContentLoaded', () => {
    // Get all the forms with the class "gift-form"
    const giftForms = document.querySelectorAll('.gift-form');

    // Fetch submissions data from the server
    fetch('/submissions')
        .then(response => response.json())
        .then(data => {
            // Populate text fields with submissions data
            data.forEach(submission => {
                const inputField = document.querySelector(`#name${submission.id}`);
                if (inputField) {
                    inputField.value = submission.name;
                    //inputField.disabled = true; // Disable the input field if data is loaded
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Add event listeners to each form (same as before)
    // Add event listeners to each form
    giftForms.forEach(form => {
        form.addEventListener('submit', (event) => {
            // Prevent the default form submission behavior
            event.preventDefault();
            const inputField = form.querySelector('input[type="text"]');
            const name = inputField.value.trim();
            
            const button = form.querySelector('button[type="submit"]');
            const giftId = button.dataset.giftId;
            // Check if a name is provided
            if (name !== '') {
                
                // If no submission with the same ID exists, create a new submission
                const newSubmission = { id: giftId, name: name }; // Include both ID and name
                submissions.push(newSubmission);        

                // Send the submissions data to the server
                fetch('/saveData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: submissions }) // Send the array of submissions
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to save data.');
                    }
                    // Reload the page for every user after successful submission
                    window.location.reload();
                })
                .catch(error => {
                    console.error(error);
                });

                // Send a message to the user indicating that the gift has been chosen
                alert(`Thank you, ${name}! You have chosen gift ${giftId}`);

                /*
                // Disable the form inputs to prevent further submissions
                inputField.disabled = true;
                form.querySelector('button[type="submit"]').disabled = true;
                */
            } else {
                // Show an error message if no name is provided
                alert('Please enter your name before choosing a gift.');
            }
        });
    });
});
