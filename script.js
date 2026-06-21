const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const taskCounter = document.getElementById("task-counter");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all";

function addTask() {
    const text = taskInput.value.trim(); 
    if (text === "") return;          

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);
    taskInput.value = "";    
    saveTasks();                     
    renderTasks();
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

function renderTasks() {
    taskList.innerHTML = "";

    const filtered = tasks.filter(task => {  
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;  
        return true;
    });


    filtered.forEach(task => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            task.completed = !task.completed;
            saveTasks();                     
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;
        if (task.completed) {
            span.style.textDecoration = "line-through";
            span.style.color = "grey";
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();                      
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateCounter();                        
}

function updateCounter() {
    const activeCount = tasks.filter(task => !task.completed).length; 
    taskCounter.textContent = `${activeCount} items left`;            
}

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const stored = localStorage.getItem("tasks");
    tasks = stored ? JSON.parse(stored) : [];
    renderTasks();
}

loadTasks();