const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the cors package
const PORT = process.env.PORT || 3001;


const tasksFilePath = path.join(__dirname, 'tasks.json');

app.use(express.json());

app.use(cors()); // Use the cors middleware

// Define a route to retrieve all to-do items
app.get('/api/tasks', (req, res) => {
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading tasks file:', err);
      return res.status(500).json({ error: 'Error retrieving tasks' });
    }
    const tasks = JSON.parse(data);
    res.json(tasks);
  });
});

// Route to update and save tasks
app.post('/api/tasks', (req, res) => {
    const updatedTasks = req.body;
    console.log(updatedTasks);
    fs.writeFile(tasksFilePath, JSON.stringify(updatedTasks, null, 2), (err) => {
    if (err) {
        console.error('Error writing tasks file:', err);
        return res.status(500).json({ error: 'Error saving tasks' });
      }
      res.json({ message: 'Tasks updated and saved successfully' });
    });
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
