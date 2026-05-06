"use strict";

const API_TODOS = "https://jsonplaceholder.typicode.com/todos";
const API_USER = "https://jsonplaceholder.typicode.com/users/1";

const state = {
    tasks: [],
    filter: "all",
    search: "",
};

let loaderDepth = 0;

const el = {
    loader: document.getElementById("loader"),
    errorBanner: document.getElementById("error-banner"),
    userInfo: document.getElementById("user-info"),
    form: document.getElementById("task-form"),
    input: document.getElementById("task-input"),
    addBtn: document.getElementById("add-btn"),
    searchInput: document.getElementById("search-input"),
    taskList: document.getElementById("task-list"),
    counter: document.getElementById("task-counter"),
    filterButtons: document.querySelectorAll(".filter-btn"),
};

function debounce(func, delay) {
    let timeoutId;
    return function debounced(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function showLoader() {
    loaderDepth += 1;
    if (el.loader) {
        el.loader.hidden = false;
        el.loader.setAttribute("aria-hidden", "false");
    }
}

function hideLoader() {
    loaderDepth = Math.max(0, loaderDepth - 1);
    if (loaderDepth === 0 && el.loader) {
        el.loader.hidden = true;
        el.loader.setAttribute("aria-hidden", "true");
    }
}

function showError(message) {
    if (!el.errorBanner) return;
    el.errorBanner.textContent = message;
    el.errorBanner.hidden = false;
}

function hideError() {
    if (el.errorBanner) {
        el.errorBanner.hidden = true;
        el.errorBanner.textContent = "";
    }
}

function renderUserInfo(user) {
    if (!el.userInfo || !user) return;
    el.userInfo.textContent = `${user.name} · ${user.email}`;
}


/**
 * @param {{ id: number, title: string, completed: boolean }} task
 */
function createTaskElement(task) {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.dataset.id = String(task.id);
    if (task.completed) {
        li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.classList.add("task-checkbox");

    const span = document.createElement("span");
    span.textContent = task.title;
    span.classList.add("task-title");

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Видалити";
    deleteBtn.classList.add("task-delete");

    li.append(checkbox, span, deleteBtn);
    return li;
}

function getVisibleTasks() {
    let list = [...state.tasks];

    if (state.filter === "active") {
        list = list.filter((t) => !t.completed);
    } else if (state.filter === "completed") {
        list = list.filter((t) => t.completed);
    }

    const q = state.search.trim().toLowerCase();
    if (q) {
        list = list.filter((t) => t.title.toLowerCase().includes(q));
    }

    return list;
}

function updateCounter() {
    const activeCount = state.tasks.filter((t) => !t.completed).length;
    if (el.counter) {
        el.counter.textContent = `Активних завдань: ${activeCount}`;
    }
}

function renderTaskList() {
    if (!el.taskList) return;
    el.taskList.replaceChildren();
    const visible = getVisibleTasks();
    for (const task of visible) {
        el.taskList.appendChild(createTaskElement(task));
    }
    updateCounter();
}

function syncAddButton() {
    if (el.addBtn && el.input) {
        el.addBtn.disabled = el.input.value.trim() === "";
    }
}

async function loadInitialData() {
    showLoader();
    hideError();
    try {
        const [todosResponse, userResponse] = await Promise.all([
            fetch(`${API_TODOS}?_limit=20`),
            fetch(API_USER),
        ]);

        if (!todosResponse.ok || !userResponse.ok) {
            throw new Error("Помилка завантаження даних");
        }

        const [todos, user] = await Promise.all([
            todosResponse.json(),
            userResponse.json(),
        ]);

        renderUserInfo(user);
        state.tasks = Array.isArray(todos) ? todos : [];
        renderTaskList();
    } catch (error) {
        showError("Не вдалося завантажити дані. Спробуйте пізніше.");
        console.error("Помилка:", error);
    } finally {
        hideLoader();
    }
}

async function addTask(title) {
    showLoader();
    hideError();
    try {
        const response = await fetch(API_TODOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                title,
                completed: false,
                userId: 1,
            }),
        });

        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }

        const newTask = await response.json();
        state.tasks.push(newTask);
        renderTaskList();
    } catch (error) {
        showError("Не вдалося створити завдання.");
        console.error("Помилка створення:", error);
    } finally {
        hideLoader();
    }
}

async function toggleTask(id, completed) {
    hideError();
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;

    const previousCompleted = task.completed;
    task.completed = completed;
    renderTaskList();

    try {
        const response = await fetch(`${API_TODOS}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({ completed }),
        });

        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }
    } catch (error) {
        task.completed = previousCompleted;
        renderTaskList();
        showError("Не вдалося оновити завдання.");
        console.error("Помилка оновлення:", error);
    }
}

async function deleteTask(id) {
    hideError();
    const idx = state.tasks.findIndex((t) => t.id === id);
    const removed = idx >= 0 ? state.tasks[idx] : null;
    if (idx >= 0) state.tasks.splice(idx, 1);
    renderTaskList();

    try {
        const response = await fetch(`${API_TODOS}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }
    } catch (error) {
        if (removed) state.tasks.splice(idx, 0, removed);
        renderTaskList();
        showError("Не вдалося видалити завдання.");
        console.error("Помилка видалення:", error);
    }
}

function onTaskListClick(event) {
    const target = event.target;
    const taskItem = target.closest(".task-item");
    if (!taskItem) return;

    const taskId = Number(taskItem.dataset.id);
    if (Number.isNaN(taskId)) return;

    if (target.classList.contains("task-delete")) {
        deleteTask(taskId);
        return;
    }

    if (
        target.classList.contains("task-checkbox") &&
        target instanceof HTMLInputElement
    ) {
        toggleTask(taskId, target.checked);
    }
}

function setFilter(filter) {
    state.filter = filter;
    el.filterButtons.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.filter === filter);
    });
    renderTaskList();
}

const onSearchInput = debounce((event) => {
    state.search = event.target.value;
    renderTaskList();
}, 300);

function init() {
    el.form.addEventListener("submit", (event) => {
        event.preventDefault();
        const title = el.input.value.trim();
        if (!title) return;
        addTask(title).then(() => {
            el.input.value = "";
            syncAddButton();
        });
    });

    el.input.addEventListener("input", syncAddButton);

    el.input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            el.input.value = "";
            syncAddButton();
        }
    });

    el.searchInput.addEventListener("input", onSearchInput);

    el.taskList.addEventListener("click", onTaskListClick);

    el.filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const f = btn.dataset.filter;
            if (f === "all" || f === "active" || f === "completed") {
                setFilter(f);
            }
        });
    });

    syncAddButton();
    loadInitialData();
}

init();
