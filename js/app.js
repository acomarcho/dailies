// ===========================
// Global variables
// ===========================
const todoTab = document.querySelector(".tab-todo");
const completedTab = document.querySelector(".tab-completed");
const todoContainer = document.querySelector(".todo-container");
const completedContainer = document.querySelector(".completed-container");
const form = document.querySelector(".form");
const taskInput = document.querySelector(".task-input");
const submitBtn = document.querySelector(".btn-submit");
const formText = document.querySelector(".form-text");
const todoText = document.querySelector(".todo-text");
const completedText = document.querySelector(".completed-text");
const clearBtn = document.querySelector(".btn-clear");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let editFlag = false;
let editID;
let editElement;

let todoCount = 0;
let completedCount = 0;

window.addEventListener("DOMContentLoaded", setUp);

// ===========================
// Setup for switching tabs
// ===========================

let currentTab = "todo";

// Hide completedContainer from the start
completedContainer.style.display = "none";

todoTab.addEventListener("click", function () {
  if (currentTab === "completed") {
    todoContainer.style.display = "grid";
    completedContainer.style.display = "none";
    currentTab = "todo";
    todoTab.classList.add("tab-current");
    completedTab.classList.remove("tab-current");
  }
});

completedTab.addEventListener("click", function () {
  if (currentTab === "todo") {
    todoContainer.style.display = "none";
    completedContainer.style.display = "grid";
    currentTab = "completed";
    todoTab.classList.remove("tab-current");
    completedTab.classList.add("tab-current");
  }
});

// ===========================
// Setup for adding items
// ===========================

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = taskInput.value;
  if (!editFlag && value) {
    const id = new Date().getTime();
    createTodoTask(id, value);
    addToTodoList(id, value);
    todoCount++;
    showText("Task added successfully!");
    updateTodoText();
    resetForm();
  } else if (editFlag && value) {
    editElement.textContent = value;
    editElement.style.color = "var(--headingColor)";
    editFromTodoList(editID, value);
    showText("Task edited successfully!");
    resetForm();
  }
});

// ===========================
// Functions
// ===========================

function showText(text) {
  formText.textContent = text;
  formText.style.visibility = "visible";

  setTimeout(function () {
    formText.textContent = "";
    formText.style.visibility = "none";
  }, 1500);
}

function resetForm() {
  taskInput.value = "";
  editFlag = false;
  submitBtn.textContent = "Add task";
  if (editElement) {
    editElement.style.color = "var(--headingColor)";
  }
}

function updateTodoText() {
  if (todoCount === 0) {
    todoText.innerHTML = `You have <span>no to-do(s)</span>.`;
  } else {
    todoText.innerHTML = `You have <span>${todoCount} to-do(s)</span>.`;
  }
}

function updateCompletedText() {
  if (completedCount === 0) {
    completedText.innerHTML = `You have <span>no completed task(s)</span>.`;
  } else {
    completedText.innerHTML = `You have <span>${completedCount} completed task(s)</span>.`;
  }
}

function createTodoTask(id, value) {
  const task = document.createElement("div");
  task.classList.add("todo-task");
  task.setAttribute("data-id", id);
  task.innerHTML = `<p class="todo-title">${value}</p>
                <div class="todo-buttons">
                  <button class="icon-btn btn-edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="icon-btn btn-delete">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                  <button class="icon-btn btn-done">
                    <i class="fas fa-check"></i>
                  </button>`;
  todoContainer.appendChild(task);

  // add edit, delete, and done button functionality
  const editBtn = task.querySelector(".btn-edit");
  const deleteBtn = task.querySelector(".btn-delete");
  const doneBtn = task.querySelector(".btn-done");

  deleteBtn.addEventListener("click", function (e) {
    todoCount--;
    e.currentTarget.parentElement.parentElement.remove();
    deleteFromTodoList(id);
    showText("Task deleted successfully!");
    updateTodoText();
    resetForm();
  });

  doneBtn.addEventListener("click", function (e) {
    createCompletedTask(
      id,
      e.currentTarget.parentElement.parentElement.querySelector(".todo-title")
        .textContent
    );
    addToCompletedList(
      id,
      e.currentTarget.parentElement.parentElement.querySelector(".todo-title")
        .textContent
    );
    e.currentTarget.parentElement.parentElement.remove();
    deleteFromTodoList(id);
    todoCount--;
    completedCount++;
    showText("Task marked as completed!");
    updateTodoText();
    updateCompletedText();
    resetForm();
  });

  editBtn.addEventListener("click", function (e) {
    resetForm();
    editFlag = true;
    editID = id;
    editElement =
      e.currentTarget.parentElement.parentElement.querySelector(".todo-title");
    editElement.style.color = "var(--correctColor)";
    submitBtn.textContent = "Edit task";
    taskInput.value = editElement.textContent;
    showText("You are now editing a task.");
  });
}

function createCompletedTask(id, value) {
  // create new element at completed-container
  const completed = document.createElement("div");
  completed.classList.add("completed-task");
  completed.setAttribute("data-id", id);
  completed.innerHTML = `<p class="completed-title">${value}</p>
                <div class="completed-buttons">
                  <button class="icon-btn btn-undo">
                    <i class="fas fa-times"></i>
                  </button>
                </div>`;
  completedContainer.appendChild(completed);

  // add button functionality
  const undoBtn = completed.querySelector(".btn-undo");
  undoBtn.addEventListener("click", function (e) {
    createTodoTask(id, value);
    addToTodoList(id, value);
    e.currentTarget.parentElement.parentElement.remove();
    deleteFromCompletedList(id);
    todoCount++;
    completedCount--;
    showText("Task marked as incomplete!");
    updateTodoText();
    updateCompletedText();
    resetForm();
  });
}

// ===========================
// localStorage stuffs
// ===========================

function addToTodoList(id, value) {
  let todoList = JSON.parse(localStorage.getItem("todo-list"));
  if (!todoList) {
    todoList = [];
  }
  todoList.push({ id: id, value: value });
  localStorage.setItem("todo-list", JSON.stringify(todoList));
}

function deleteFromTodoList(id) {
  let todoList = JSON.parse(localStorage.getItem("todo-list"));
  if (!todoList) {
    todoList = [];
  }
  todoList = todoList.filter(function (list) {
    return list.id != id;
  });
  localStorage.setItem("todo-list", JSON.stringify(todoList));
}

function editFromTodoList(id, value) {
  let todoList = JSON.parse(localStorage.getItem("todo-list"));
  if (!todoList) {
    todoList = [];
  }
  todoList = todoList.map(function (list) {
    return list.id == id ? { id: id, value: value } : list;
  });
  localStorage.setItem("todo-list", JSON.stringify(todoList));
}

function addToCompletedList(id, value) {
  let completedList = JSON.parse(localStorage.getItem("completed-list"));
  if (!completedList) {
    completedList = [];
  }
  completedList.push({ id: id, value: value });
  localStorage.setItem("completed-list", JSON.stringify(completedList));
}

function deleteFromCompletedList(id) {
  let completedList = JSON.parse(localStorage.getItem("completed-list"));
  if (!completedList) {
    completedList = [];
  }
  completedList = completedList.filter(function (list) {
    return list.id != id;
  });
  localStorage.setItem("completed-list", JSON.stringify(completedList));
}

function setUp() {
  let todoList = JSON.parse(localStorage.getItem("todo-list"));
  if (todoList) {
    todoList.forEach(function (list) {
      createTodoTask(list.id, list.value);
      todoCount++;
    });
  }

  let completedList = JSON.parse(localStorage.getItem("completed-list"));
  if (completedList) {
    completedList.forEach(function (list) {
      createCompletedTask(list.id, list.value);
      completedCount++;
    });
  }

  updateTodoText();
  updateCompletedText();
}

// Clear button
clearBtn.addEventListener("click", function () {
  const completedTasks = document.querySelectorAll(".completed-task");
  completedTasks.forEach(function (task) {
    const id = task.dataset.id;
    const value = task.querySelector(".completed-title").textContent;
    createTodoTask(id, value);
    task.remove();
    todoCount++;
    completedCount--;
    deleteFromCompletedList(id);
    addToTodoList(id, value);
  });
  showText("All completed tasks now marked as incomplete!");
  updateTodoText();
  updateCompletedText();
  resetForm();
});
