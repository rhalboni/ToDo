import React, { useState, useEffect } from "react";
// initial task list
// material components
import { DataGrid } from "@mui/x-data-grid";
import { Button, Checkbox, Dialog } from "@mui/material";

export const ToDoList = () => {
	// initial values and functions for react state variables
	// task list
	const [tasks, setTasks] = useState([]);
	// text of the input field in the dialog
	const [description, setDescription] = useState("");
	// selected item/s
	const [selection, setSelection] = useState([]);
	// dialog visibility
	const [visible, setVisible] = useState(false);
	// whether we're adding or editing from the dialog
	const [mode, setMode] = useState("ADD");

    
  useEffect(() => {
    fetch('http://localhost:3001/api/tasks') 
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleSaveTasks = () => {
    fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tasks), // Send updated task data
    })
      .then(response => response.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error saving tasks:', error));
  };


	/**
	 * @description open the dialog
	 */
	const openDialog = () => {
		setVisible(true);
	};

	/**
	 * @description close the dialog
	 */
	const closeDialog = () => {
		setVisible(false);
	};

	/**
	 * @description handler function for adding tasks
	 */
	const handleAdd = () => {
		// set the description
		setDescription("");
		// set the mode
		setMode("ADD");
		// open the dialog
		openDialog();
	};

	/**
	 * @description handler function for editing tasks
	 */
	const handleEdit = () => {
		// set the description from the current selection
		const task = selection[0];
		setDescription(task.description);
		// set the mode
		setMode("EDIT");
		// open the dialog
		openDialog();
	};

	/**
	 * @description function that sets the description state variable
	 * @param {event} event - change event from input
	 */
	const handleDescription = (event) => {
		setDescription(event.target.value);
	};

	/**
	 * @description handler function to set the selection state variable
	 * @param {array} ids - array of IDs passed in from Grid select event
	 * INSTRUCTIONS: use the js filter method to set the selection as an array of tasks
	 */
	const handleSelection = (ids) => {
        const selectedTasks = tasks.filter(task => ids.includes(task.id));
        setSelection(selectedTasks);	};

	/**
	 * @description function for submitting from the dialog
	 * INSTRUCTIONS: use the mode to determine which function to call when
	 * clicking the submit button
	 */
	const handleSubmit = () => {
        if (mode === "ADD") {
            createTask();
          } else if (mode === "EDIT") {
            updateTask(); 
          }	};

	/**
	 * @description function to create a task for the toDo list
	 * INSTRUCTIONS: use the description state variable to create a new task object
	 * and add it with the setTasks hook
	 */
	const createTask = () => {
        if (!description) {
            return; // Don't create an empty task
        }
        
          // Create a new task object with a unique ID
        const newTask = {
            id: tasks.length + 1, 
            description: description,
            complete: false,
        };
        
        // Update the state with the new task added to the tasks array and close the dialog
        setTasks([...tasks, newTask]);
        closeDialog();	};

	/**
	 * @description function to update an exsting task
	 * INSTRUCTIONS: use the selection state variable and setTasks hook
	 * with a js map to create a new task array
	 */
	const updateTask = () => {
		 // Ensure a task is selected
         if (selection.length !== 1) {
            return;
          }
        
          // Create a new array of tasks with the selected task updated
          const updatedTasks = tasks.map(task => {
            if (task.id === selection[0]) {
              // Create a new task object with the updated description
              return { ...task, description: description };
            }
            return task;
          });
        
          // Update the state with the new tasks array and close the dialog
          setTasks(updatedTasks);
          closeDialog();
	};

	/**
	 * @description method to remove an existing task
	 * INSTRUCTIONS: use the selection state variable and setTasks hook
	 * with a js filter to create a new task array
	 */
	const removeTask = () => {
		if (selection.length === 0) {
            return;
          }
        
          // Create a new array of tasks excluding the selected ones
          const updatedTasks = tasks.filter(task => !selection.some(selectedTask => selectedTask.id === task.id));
        
          // Update the state with the new tasks array and clear the selection
          setTasks(updatedTasks);
          setSelection([]);
	};

	/**
	 * @description method to mark a task as complete
	 * @param {*} id the id of the task to mark as complete
	 * INSTRUCTIONS: use the setTasks hook with a js map to create a new task array
	 */
	const completeTask = (id) => {
    // Create a new array of tasks with the selected task marked as complete
        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, complete: true };
            }
        return task;
  });

  // Update the state with the new tasks array
  setTasks(updatedTasks);	};

	// the Data grid columns - the renderCell will replace a cell's text with a React component - in this case a checkbox
	const columns = [
		{ field: "description", headerName: "Description", flex: 1 },
		{
			field: "complete",
			headerName: "Complete",
			flex: 0.3,
			renderCell: (params) => (
				<Checkbox checked={params.value} onChange={() => completeTask(params.id)} />
			),
		},
	];

	return (
		<div>
			<h1>To Do List</h1>
			{/* Dialog for adding and editing */}
			<Dialog open={visible}>
				<div style={{ width: "300px" }} className="d-flex flex-column">
					{mode} Task - Enter task description
					<br />
					<input value={description} onChange={handleDescription}></input>
				</div>
				<div className="d-flex justify-content-center">
					{/* handleSubmit needs to contextually call the correct function based on whether you're adding or editing */}
					<Button onClick={handleSubmit}>Submit</Button>
					<Button onClick={closeDialog}>Cancel</Button>
				</div>
			</Dialog>
			{/* Main to do list */}
			<div className="d-flex flex-column align-items-center">
				<div style={{ width: "500px" }}>
					<DataGrid
						onRowSelectionModelChange={handleSelection}
						rows={tasks}
						columns={columns}
					/>
				</div>
				<div className="d-flex justify-content-center">
					<Button onClick={handleAdd}>Add</Button>
					{/* note how the button is disabled if nothing is selected - as soon as an item is selected the button re-renders */}
					<Button onClick={handleEdit} disabled={!selection[0]}>
						Edit
					</Button>
					<Button onClick={removeTask}>Remove</Button>
				</div>
			</div>
            <div className="d-flex justify-content-center">
                <Button onClick={handleSaveTasks}>Save</Button>
            </div>
		</div>
	);
};
