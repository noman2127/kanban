let tasksData = {}

let todo = document.querySelector("#todo")
let progress = document.querySelector("#progress")
let done = document.querySelector("#done")
let columns = [todo, progress, done]
let dragElement = null;
let touchStartY = 0;
let touchStartX = 0;


function addTask(title, desc, column) {
    let div = document.createElement("div")

    div.classList.add("task")
    div.setAttribute("draggable", "true")

    div.innerHTML = `
         <h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete-btn">Delete</button>`
    column.appendChild(div)

    div.addEventListener("dragstart", () => {
        dragElement = div;
    })

    // Touch events for mobile
    div.addEventListener("touchstart", (e) => {
        dragElement = div;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        div.style.opacity = "0.5";
    })

    div.addEventListener("touchmove", (e) => {
        if (!dragElement) return;
        e.preventDefault();
        const touch = e.touches[0];
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementAtPoint) {
            const column = elementAtPoint.closest('.task-column');
            if (column && column !== dragElement.parentElement) {
                columns.forEach(col => col.classList.remove("hover-over"));
                column.classList.add("hover-over");
            }
        }
    })

    div.addEventListener("touchend", (e) => {
        if (!dragElement) return;
        const touch = e.changedTouches[0];
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementAtPoint) {
            const column = elementAtPoint.closest('.task-column');
            if (column && column !== dragElement.parentElement) {
                column.appendChild(dragElement);
                updateTaskCount();
            }
        }
        columns.forEach(col => col.classList.remove("hover-over"));
        dragElement.style.opacity = "1";
        dragElement = null;
    })

    let deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", () =>{
        div.remove();
        updateTaskCount();
    })
}

function updateTaskCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll(".task")
        const count = col.querySelector(".right")
        tasksData[col.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            }
        })
        localStorage.setItem("tasks", JSON.stringify(tasksData))

        count.innerText = tasks.length
    })
}

if (localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"))

    for (const col in data) {
        const column = document.querySelector(`#${col}`)
        data[col].forEach(task => {
            addTask(task.title, task.desc, column)
        });

        updateTaskCount()
    }
}

// Add touch events to existing tasks if any
let tasks = document.querySelectorAll(".task")
tasks.forEach(task => {
    task.addEventListener("dragstart", (e) => {
        dragElement = task;
    })

    // Add touch events for mobile
    task.addEventListener("touchstart", (e) => {
        dragElement = task;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        task.style.opacity = "0.5";
    })

    task.addEventListener("touchmove", (e) => {
        if (!dragElement) return;
        e.preventDefault();
        const touch = e.touches[0];
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementAtPoint) {
            const column = elementAtPoint.closest('.task-column');
            if (column && column !== dragElement.parentElement) {
                columns.forEach(col => col.classList.remove("hover-over"));
                column.classList.add("hover-over");
            }
        }
    })

    task.addEventListener("touchend", (e) => {
        if (!dragElement) return;
        const touch = e.changedTouches[0];
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementAtPoint) {
            const column = elementAtPoint.closest('.task-column');
            if (column && column !== dragElement.parentElement) {
                column.appendChild(dragElement);
                updateTaskCount();
            }
        }
        columns.forEach(col => col.classList.remove("hover-over"));
        dragElement.style.opacity = "1";
        dragElement = null;
    })
})

function addDragEventOnColumn(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over")
    })
    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over")
    })
    column.addEventListener("dragover", (e) => {
        e.preventDefault()
    })
    column.addEventListener("drop", (e) => {
        e.preventDefault()

        column.appendChild(dragElement)
        column.classList.remove("hover-over")

        updateTaskCount();

    })
}
addDragEventOnColumn(todo)
addDragEventOnColumn(progress)
addDragEventOnColumn(done)

/* Toggle modal logic*/
let toggleModalButton = document.querySelector("#toggle-modal")
let modalBg = document.querySelector(".modal .bg")
let addTaskButton = document.querySelector("#add-new-task")
let modal = document.querySelector(".modal")

toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active")
})

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
})

addTaskButton.addEventListener("click", () => {
    let taskTitle = document.querySelector("#task-title").value
    let taskDiscription = document.querySelector("#task-discription").value

    document.querySelector("#task-title").value = ""
    document.querySelector("#task-discription").value = ""

    addTask(taskTitle, taskDiscription, todo)
    updateTaskCount()
    modal.classList.remove("active")
})