// function pageLoad() {
//     prepareLocalStorage();
//     listTasks();

//     // //Trigger tooltips on hover
//     // $('[data-toggle="tooltip"]').tooltip({
//     //     trigger: 'hover'
//     // })

//     //set task count
//     $("#taskCount").text('CURRENT TASKS (${GetTaskCount()})');
// }

let taskArray = [];
let editArray = [];
let editItem = null;

function prepareLocalStorage() {
    if (getLocalStorage() == null) {
        // setLocalStorage(taskArray);
        let defObj = {
            list: new Array(),
            filterName: "all"
        }
        setLocalStorage(defObj)
    };
    listTasks()
    // checkIfCompleted()
}

function createTask(formData) {
    let tasks = getLocalStorage();
    let task = {
        id: generateID(),
        created: new Date().toLocaleDateString(),
        completed: false,
        title: formData[0].value,
        dueDate: new Date(`${formData[1].value} 00:00`).toLocaleDateString()
    }
    tasks.push(task)
    setLocalStorage(tasks);
    listTasks();
}

function listTasks() {
    let tasks = getLocalStorage();
    let template = document.getElementById("data-template");
    let resultsBody = document.getElementById("resultsBody");

    resultsBody.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
        const taskRow = document.importNode(template.content, true)

        taskRow.getElementById("taskID").textContent = tasks[i].id;
        taskRow.getElementById("complete").textContent = tasks[i].completed;
        taskRow.getElementById("task").textContent = tasks[i].title;
        taskRow.getElementById("createdDate").textContent = tasks[i].created;
        taskRow.getElementById("dueDate").textContent = tasks[i].dueDate;

        resultsBody.appendChild(taskRow);
    }

    countTasks();
}

function editTask(node) {
    let id = node.parentNode.parentNode.children[1].innerText;
    let tasks = getLocalStorage();
    let ids = tasks.map(t => t.id)
    let matchId = "";
    for (let i = 0; i < ids.length; i++) {
        if (ids[i] == id) {
            matchId = ids[i];
        }
    }
    let editedTask = tasks.find(t => t.id == matchId)

    document.getElementById("editID").value = editedTask.id;
    document.getElementById("editTitle").value = editedTask.title;
    document.getElementById("editDueDate").value = editedTask.dueDate;
}

function editSave() {
    id = document.getElementById("editID").value;
    let tasks = getLocalStorage();
    let ids = tasks.map(t => t.id);
    let matchId = "";
    for (let i = 0; i < ids.length; i++) {
        if (ids[i] == id) {
            matchId = ids[i];
        }
    }
    let editedTask = tasks.find(t => t.id == matchId);

    editedTask.title = document.getElementById("editTitle").value;
    editedTask.dueDate = document.getElementById("editDueDate").value

    setLocalStorage(tasks)
    listTasks();
}

//delete an entry
function deleteTask() {
    let tasks = getLocalStorage();
    let cell = this.event.path[3].rowIndex;

    for (let i = 0; i < tasks.length; i++) {
        if (i === cell - 1) {
            tasks.splice(i, 1);
        };
    };

    setLocalStorage(tasks)
    listTasks();
};

function clearTasks() {
    let tasks = getLocalStorage();

    for (let i = 0; i < tasks.length; i++) {
        tasks.splice(i, tasks.length)
    };

    setLocalStorage(tasks);
    listTasks();
};


function completeTask(btn) {
    let tasks = getLocalStorage();
    let checked = isChecked();

    let getID = btn.closest("tr").querySelector("#taskID").innerHTML;
    let thisRow = btn.closest("tr");
    let status = tasks.find(t => t.id == getID);

    if (checked === true) {
        thisRow.classList.add("strikeThrough");
        status.completed = true;

    } else {
        thisRow.classList.remove("strikeThrough");
        status.completed = false;
    }

    setLocalStorage(tasks)

};

function isChecked() {
    let checkBox = document.getElementsByClassName("taskCheck");
    for (let i = 0; i < checkBox.length; i++) {
        if (checkBox[i].checked) {
            return true;
        }
    }
};

// function checkIfCompleted() {
//     let tasks = getLocalStorage();
//     let thisRow = btn.closest("tr")
//     let isDone = tasks.filter(task => task.completed = true);
//     isDone.forEach(task => {
//         thisRow.classList.add("strikeThrough")
//     })
// };





function countTasks() {
    let tasks = getLocalStorage()
    document.getElementById("numTasks").innerHTML = tasks.length;
}

// function editTask() {
//     let taskId = formData[0].value();

//     let task = getLocalStorage().find(t => t.id == taskId);
// }

//CompleteTask(element)
// let task = tasks.find(t => t.id == taskId);

//Generate an ID for each task
function generateID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getIdFromParentOfNode(node) {
    // id is 2 parents above node
    let id = node.parentNode.parentNode.getAttribute("data-id")
    return id
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem("taskArray")) || [];
}

function setLocalStorage(arr) {
    localStorage.setItem("taskArray", JSON.stringify(arr))
}