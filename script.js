const inputBox = document.getElementById("box");
const addBtn = document.getElementById("addBtn");
const selectAllBtn = document.getElementById("SelectAll");
const todoList = document.getElementById("todoList");
const confirm = document.getElementById("confirm");
const closeButton = document.getElementById("closeButton");
const confirmDeleteButton = document.getElementById("confirmDelete");
const cancelDeleteButton = document.getElementById("cancelDelete");
const errorMessage = document.getElementById("errorMessage");
//this is for delete all popup
const confirm2 = document.getElementById("confirm2");
const closeButton2 = document.getElementById("closeButton2");
const confirmDeleteButton2 = document.getElementById("confirmDelete2");
const cancelDeleteButton2 = document.getElementById("cancelDelete2");

let editTodo = null;
let deleteLi = null;
let deleteTodoText = "";
//These variables are used to store the current editing todo, the list item
//to be deleted, and the text of the todo to be deleted.

const addTodo = () => {
  const inputText = inputBox.value.trim();

  if (inputText.length <= 0) {
    errorMessage.innerText = "You need to write something!";
    errorMessage.style.display = "block";
    return false;
  }

  const li = document.createElement("li");

  const p = document.createElement("p");
  p.innerHTML = inputText;
  li.appendChild(p);

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.classList.add("todo-checkbox");
  li.appendChild(checkBox);

  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.classList.add("btn", "editBtn");
  li.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Remove";
  deleteBtn.classList.add("btn", "deleteBtn");
  li.appendChild(deleteBtn);

  saveLocalTodos(inputText);
  todoList.appendChild(li);
  inputBox.value = "";

  checkBox.addEventListener("change", () => {
    p.style.textDecoration = checkBox.checked ? "line-through" : "none";
  });

  updateDeleteAllButton();
};

const createDeleteAllButton = () => {
  const deleteAllButton = document.createElement("button");
  deleteAllButton.innerText = "Delete All";
  deleteAllButton.id = "deleteAll";
  deleteAllButton.style.display = "none"; // Hide by default
  deleteAllButton.addEventListener("click", deleteAllTodos);

  // Ensure todoList is an existing element in the DOM
  if (todoList.parentElement) {
    todoList.parentElement.insertBefore(deleteAllButton, todoList);
    //t ensures the button is added to the DOM before the todoList, making it a sibling.
  }
};

const updateDeleteAllButton = () => {
  const deleteAllButton = document.getElementById("deleteAll");

  if (!deleteAllButton) {
    console.error("Delete All button not found!");
    return; // Early return if the button doesn't exist
  }

  const checkboxes = document.querySelectorAll(".todo-checkbox");
  let allChecked = true;

  for (const checkbox of checkboxes) {
    if (!checkbox.checked) {
      allChecked = false;
      break; // Exit the loop early if any checkbox is unchecked
    }
  }

  deleteAllButton.style.display = allChecked ? "block" : "none";
};

// Delete all todos
const deleteAllTodos = () => {
  const checkboxes = document.querySelectorAll(".todo-checkbox:checked");
  checkboxes.forEach((checkbox) => {
    const li = checkbox.parentElement;
    todoList.removeChild(li);
    deleteLocalTodos(li);
    confirm2.style.display = "block";
  });
  updateDeleteAllButton();
};

// Update todos
const updateTodo = (e) => {
  if (e.target.innerHTML === "Remove") {
    const li = e.target.parentElement;
    deleteLi = li;
    deleteTodoText = li.querySelector("p").innerHTML;
    confirm.querySelector(
      "p"
    ).innerText = `Are you sure you want to delete "${deleteTodoText}"?`;
    confirm.style.display = "block";
  }

  if (e.target.innerHTML === "Edit") {
    const li = e.target.parentElement;
    inputBox.value = li.querySelector("p").innerHTML;
    inputBox.focus();
    addBtn.value = "Edit";
    editTodo = e;
  }
};

closeButton.onclick = () => {
  confirm.style.display = "none";
};

cancelDeleteButton.onclick = () => {
  confirm.style.display = "none";
};

confirmDeleteButton.onclick = () => {
  if (deleteLi) {
    todoList.removeChild(deleteLi);
    deleteLocalTodos(deleteLi);
  }
  confirm.style.display = "none";
};

closeButton2.onclick = () => {
  confirm2.style.display = "none";
};

cancelDeleteButton2.onclick = () => {
  confirm2.style.display = "none";
};

confirmDeleteButton2.onclick = () => {
  const checkboxes = document.querySelectorAll(".todo-checkbox:checked");
  checkboxes.forEach((checkbox) => {
    const li = checkbox.parentElement;
    todoList.removeChild(li);
    deleteLocalTodos(li);
    confirm2.style.display = "none";
  });
  updateDeleteAllButton();
};

// Save todo to local storage
const saveLocalTodos = (todo) => {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Get todos from local storage
const getLocalTodos = () => {
  let todos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];
  todos.forEach((todo) => {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.innerHTML = todo;
    li.appendChild(p);

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.classList.add("todo-checkbox");
    li.appendChild(checkBox);

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("btn", "editBtn");
    li.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Remove";
    deleteBtn.classList.add("btn", "deleteBtn");
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
  });
  updateDeleteAllButton();
};

// Delete a todo from local storage
const deleteLocalTodos = (todo) => {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  let todoText = todo.children[0].innerHTML; // Get the text
  let todoIndex = todos.indexOf(todoText); // Find the index
  todos.splice(todoIndex, 1); // Remove it
  localStorage.setItem("todos", JSON.stringify(todos));
  updateDeleteAllButton();
};

// Edit todo in local storage
const editLocalTodos = (todo) => {
  let todos = JSON.parse(localStorage.getItem("todos"));
  let todoIndex = todos.indexOf(todo);
  todos[todoIndex] = inputBox.value;
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  createDeleteAllButton(); // Create the delete all button
  getLocalTodos();
});
addBtn.addEventListener("click", addTodo);
inputBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});
todoList.addEventListener("click", updateTodo);
selectAllBtn.addEventListener("change", (e) => {
  const checkboxes = document.querySelectorAll(".todo-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = e.target.checked;
  });
  updateDeleteAllButton(); // Update button visibility based on select all
});
