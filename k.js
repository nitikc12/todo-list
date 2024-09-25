const inputBox = document.getElementById("box");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const confirm = document.getElementById("confirm");
const closeButton = document.getElementById("closeButton");
const confirmDeleteButton = document.getElementById("confirmDelete");
const cancelDeleteButton = document.getElementById("cancelDelete");
const errorMessage = document.getElementById("errorMessage");

let editTodo = null;
let deleteLi = null;
let deleteTodoText = "";

const addTodo = () => {
  const inputText = inputBox.value.trim();

  if (inputText.length <= 0) {
    errorMessage.innerText = "You need to write something!";
    errorMessage.style.display = "block";
    return false;
  }

  if (addBtn.value === "Edit") {
    editTodo.target.previousElementSibling.innerHTML = inputText;
    updateLocalTodos(editTodo.target.parentElement, inputText);
    addBtn.value = "Add";
    inputBox.value = "";
  } else {
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

    todoList.appendChild(li);
    inputBox.value = "";
    saveLocalTodo(inputText);

    checkBox.addEventListener("change", () => {
      p.style.textDecoration = checkBox.checked ? "line-through" : "none";
    });
  }
};

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

const getLocalTodos = () => {
  let todos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];
  todos.forEach((todo) => {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.innerHTML = todo;
    li.appendChild(p);

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
};

const deleteLocalTodos = (todo) => {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  let todoText = todo.children[0].innerHTML;
  let todoIndex = todos.indexOf(todoText);
  todos.splice(todoIndex, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
  // Array functions : slice / splice
  console.log(todoIndex);
};

const editLocalTodos = (todo) => {
  let todos = JSON.parse(localStorage.getItem("todos"));
  let todoIndex = todos.indexOf(todo);
  todos[todoIndex] = inputBox.value;
  localStorage.setItem("todos", JSON.stringify(todos));
};

document.addEventListener("DOMContentLoaded", getLocalTodos);
addBtn.addEventListener("click", addTodo);
inputBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});
todoList.addEventListener("click", updateTodo);
