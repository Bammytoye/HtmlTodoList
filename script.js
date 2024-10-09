const toDoInput = document.querySelector('.todoInput');
const toDoBtn = document.querySelector('.todoBtn');
const toDoList = document.querySelector('.List');
const errorMessage = document.querySelector('#errorMessage'); 

toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deleteCheck);
document.addEventListener("DOMContentLoaded", getTodos);

function addToDo(event) {
    event.preventDefault();

    // Clear previous error message
    errorMessage.style.display = 'none';
    
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo');
    
    const newToDo = document.createElement('li');
    if (toDoInput.value === '') {
        errorMessage.innerText = "You must write something!";
        errorMessage.style.display = 'block';
        return;
    } else {
        newToDo.innerText = toDoInput.value;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        // Add Task to Local Storage
        saveLocal(toDoInput.value, false);

        // Check button with image
        const checked = document.createElement('button');
        const checkImg = document.createElement('img');
        checkImg.classList.add('icon');
        checkImg.src = '/images/check.webp';
        checked.appendChild(checkImg);
        checked.classList.add('check-btn');
        toDoDiv.appendChild(checked);

        // Edit button with image
        const editBtn = document.createElement('button');
        const editImg = document.createElement('img');
        editImg.classList.add('icon');
        editImg.src = '/images/edit.webp';
        editBtn.appendChild(editImg);
        editBtn.classList.add('edit-btn');
        toDoDiv.appendChild(editBtn);

        // Delete button with image
        const deleted = document.createElement('button');
        const deleteImg = document.createElement('img');
        deleteImg.classList.add('icon');
        deleteImg.src = '/images/delete.webp';
        deleted.appendChild(deleteImg);
        deleted.classList.add('delete-btn');
        toDoDiv.appendChild(deleted);

        // Append to list
        toDoList.appendChild(toDoDiv);

        // Clear the input
        toDoInput.value = '';

        // Reorder tasks after adding new one
        reorderTasks();
    }
}

function deleteCheck(event) {
    const item = event.target;

    // Check if the clicked element is the image or the button
    const button = item.tagName === 'IMG' ? item.parentElement : item;

    // Delete
    if (button.classList.contains('delete-btn')) {
        button.parentElement.classList.add("fall");

        // Remove from Local Storage
        removeLocalTodos(button.parentElement);

        button.parentElement.addEventListener('transitionend', function () {
            button.parentElement.remove();
        });
    }

    // Check
    if (button.classList.contains('check-btn')) {
        button.parentElement.classList.toggle("completed");

        // Update local storage for completion status
        updateLocalStorage(button.parentElement, true);

        // Reorder the task: move the checked task to the bottom
        reorderTasks();
    }

    // Edit
    if (button.classList.contains('edit-btn')) {
        editTask(button.parentElement);
    }
}

function reorderTasks() {
    const tasks = document.querySelectorAll('.todo');
    tasks.forEach(task => {
        if (task.classList.contains('completed')) {
            toDoList.appendChild(task); // Move completed tasks to the bottom
        } else {
            toDoList.prepend(task); // Ensure unchecked tasks stay at the top
        }
    });
}

function editTask(taskDiv) {
    const taskItem = taskDiv.querySelector('.todo-item');
    const currentText = taskItem.innerText;

    // Prompt the user to edit the task
    const newText = prompt("Edit your task:", currentText);
    
    if (newText === null || newText.trim() === '') {
        return; // If the user cancels or inputs an empty string, do nothing
    }

    // Update the task in the DOM
    taskItem.innerText = newText;

    // Update the task in Local Storage
    updateLocalStorage(taskDiv, false, newText);
}

function updateLocalStorage(taskDiv, isCompleted, newText = null) {
    let todos = JSON.parse(localStorage.getItem('todos'));
    const oldText = taskDiv.querySelector('.todo-item').innerText;

    const index = todos.findIndex(t => t.text === oldText);
    if (index !== -1) {
        if (newText) {
            todos[index].text = newText;
        }
        todos[index].completed = taskDiv.classList.contains('completed');
    }

    localStorage.setItem('todos', JSON.stringify(todos));
}

// Save tasks with completed status
function saveLocal(todoText, isCompleted = false) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    // Store as an object {text: "task", completed: true/false}
    todos.push({ text: todoText, completed: isCompleted });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(function (todo) {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo");

        // Mark as completed if needed
        if (todo.completed) {
            toDoDiv.classList.add("completed");
        }

        const newToDo = document.createElement('li');
        newToDo.innerText = todo.text;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        // Check button with image
        const checked = document.createElement('button');
        const checkImg = document.createElement('img');
        checkImg.classList.add('icon');
        checkImg.src = '/images/check.webp';
        checked.appendChild(checkImg);
        checked.classList.add('check-btn');
        toDoDiv.appendChild(checked);

        // Edit button with image
        const editBtn = document.createElement('button');
        const editImg = document.createElement('img');
        editImg.classList.add('icon');
        editImg.src = '/images/edit.webp';
        editBtn.appendChild(editImg);
        editBtn.classList.add('edit-btn');
        toDoDiv.appendChild(editBtn);

        // Delete button with image
        const deleted = document.createElement('button');
        const deleteImg = document.createElement('img');
        deleteImg.classList.add('icon');
        deleteImg.src = '/images/delete.webp';
        deleted.appendChild(deleteImg);
        deleted.classList.add('delete-btn');
        toDoDiv.appendChild(deleted);

        // Append to list
        toDoList.appendChild(toDoDiv);
    });

    // Reorder tasks after loading from localStorage
    reorderTasks();
}

function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoText = todo.querySelector('.todo-item').innerText;
    todos = todos.filter(t => t.text !== todoText);

    localStorage.setItem('todos', JSON.stringify(todos));
}

var dt = new Date();
document.getElementById("dateTime").innerHTML = dt.toLocaleString();
