const express = require('express');
const path = require('path'); // Node.js module for working with file paths
const app = express();
const port = 3000;
const fs = require('fs');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (e.g., HTML, CSS, images) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/submissions', (req, res) => {
    fs.readFile('submissions.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        try {
            const submissions = JSON.parse(data || '[]'); // Use empty array if data is empty
            res.json(submissions); // Send JSON response
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});


app.post('/saveData', (req, res) => {
    const newData = req.body.data; // Assuming data is sent in the request body
    fs.readFile('submissions.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error: Unable to read data');
            return;
        }

        let submissions = JSON.parse(data || '[]'); // Use empty array if data is empty

        // Iterate over new submissions
        newData.forEach(newSubmission => {
            // Check if a submission with the same ID already exists
            const existingSubmissionIndex = submissions.findIndex(submission => submission.id === newSubmission.id);

            if (existingSubmissionIndex !== -1) {
                // If a submission with the same ID exists, replace it with the new submission
                submissions[existingSubmissionIndex] = newSubmission;
            } else {
                // If no submission with the same ID exists, add the new submission
                submissions.push(newSubmission);
            }
        });

        // Write the updated submissions data to the JSON file
        fs.writeFile('submissions.json', JSON.stringify(submissions), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).send('Internal Server Error: Unable to save data');
                return;
            }
            console.log('Data written to file successfully');
            res.sendStatus(200); // Send success response
        });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
