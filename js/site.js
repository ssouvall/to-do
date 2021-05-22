$(function(){          
    prepareLocalStorage();  

    let allTasks = getLocalStorage();
    //Set task count
    setTaskCountLabel(`ALL TASKS (${allTasks.length})`);

    //This is my first change where I am trying to pass the entire array into ListTasks...
    //Not even sure if it works yet...However if it does I am in business!
    listTasks(allTasks);

    //Trigger tooltips on hover
    $('[data-toggle="tooltip"]').tooltip({ trigger : 'hover' })  
    
    $("#btnSearch").on("click", function(){
       let searchString = $("#txtSearch").val();
       searchTasks(searchString);
    })
});

function filterAll(){
    let tasks = getLocalStorage();
    setTaskCountLabel(`ALL TASKS (${tasks.length})`);
    listTasks(tasks);
}

function filterOverDue(){
    let tasks = getLocalStorage();
    let overdueTasks = tasks.filter(t => Date.parse(t.dueDate) < new Date() );
    setTaskCountLabel(`OVERDUE TASKS (${overdueTasks.length})`)
    listTasks(overdueTasks);
 }

 function filterCompleted(){   
    let tasks = getLocalStorage();
    let completedTasks = tasks.filter(t => t.completed == true);
    setTaskCountLabel(`COMPLETED TASKS (${completedTasks.length})`)
    listTasks(completedTasks)
}

function filterIncomplete(){
    let tasks = getLocalStorage();
    let incompleteTasks = tasks.filter(t => t.completed == false);
    setTaskCountLabel(`INCOMPLETE TASKS (${incompleteTasks.length})`)
    listTasks(incompleteTasks)
}

function prepareLocalStorage(){
    if(getLocalStorage() == null) 
        setLocalStorage(new Array());          
}


function createTask(formData){

    let dueDate = formData[2].value == "" ? 
        new Date() : 
        new Date(`${formData[2].value} 00:00`);

    let task = {
        id: generateID(),
        created: new Date(),
        completed: false,
        title: formData[1].value,
        dueDate: dueDate
    }

    let tasks = getLocalStorage();
    tasks.push(task);

    setLocalStorage(tasks);
    setTaskCountLabel(`ALL TASKS (${tasks.length})`);
    listTasks(tasks);
}

function editTask(formData){

    let taskId = formData[1].value;

    let tasks = getLocalStorage();
    let task = tasks.find(t => t.id == taskId);           
    task.title = formData[2].value;
    task.dueDate = new Date(`${formData[3].value} 00:00`);
    
    setLocalStorage(tasks);
    
    listTasks();
}

function saveTask(task){    
    let taskData = getLocalStorage();
    taskData.tasks.push(task);
    setLocalStorage(taskData);
}


function listTasks(tasks){
    const template = document.getElementById("data-template");
    const eventBody = document.getElementById("resultsBody");
       
    eventBody.innerHTML = ""; 
    for (var row = 0; row < tasks.length; row++) {
        const taskRow = document.importNode(template.content, true);      
        
        if(tasks[row].completed)
            taskRow.getElementById("data-row").setAttribute("class", "complete");

        taskRow.getElementById("id").textContent = tasks[row].id;            
        taskRow.getElementById("title").textContent = tasks[row].title;
        taskRow.getElementById("created").textContent = renderDate(tasks[row].created);
        taskRow.getElementById("dueDate").textContent = renderDate(tasks[row].dueDate);     
        taskRow.getElementById("tdCrud").setAttribute("data-id", tasks[row].id)
        
        eventBody.appendChild(taskRow);
    }    
}

function deleteTask(element){   
    clearTooltip();

    let index = getIndex(element);  
    let tasks = getLocalStorage();
    tasks.splice(index, 1);
    setLocalStorage(tasks);

    setTaskCountLabel(`ALL TASKS (${tasks.length})`)
    listTasks(getLocalStorage());
}

function completeTask(element){
    clearTooltip();

    let taskId = getTaskId(element);
    let tasks = getLocalStorage();  
    let task = tasks.find(t => t.id == taskId);
    task.completed = true;

    setLocalStorage(tasks);
    listTasks(getLocalStorage());
}



//The element in this function is most likely a button
function getIndex(element){
    //I am passing a piece of structure (i.e a button) and trying to get some data out    
    let taskId = getTaskId(element);    

    //Get a reference to local storage
    let tasks = getLocalStorage();

    //findIndex is a built-in JS function that returns the 0 based position in the array
    return tasks.findIndex(t => t.id == taskId);   
}


//Generate an ID for each task
function generateID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getTaskCount(tasks) {    
    return tasks.length;
}

function renderDate(dateString){
    let date = new Date(dateString);
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("en-US", options)
}

function getTaskId(element){
    let taskId = $(element).parent().attr("data-id");
    return taskId;
}

function getTask(element){
    let taskId = getTaskId(element);
    return tasks.find(t => t.id == taskId);
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem("taskArray")) || [];
}

function setLocalStorage(arr) {
    localStorage.setItem("taskArray", JSON.stringify(arr))
}

function clearTooltip(){
    $("div.tooltip").hide();
}

function triggerCustomAlert(title, message){

    const swalWithDarkButton = Swal.mixin({
        showConfirmButton: false,
        imageUrl: '/img/tasks.jpg',
        imageHeight: 150,
        closeOnConfirm: false, 
        closeOnCancel: false,
        allowOutsideClick: false
    });

    swalWithDarkButton.fire({
        title: `<span class="cool-text">${title}</span>`,
        html: `<span class="font-weight-bold">${message}</span>`
    });
}
// function countTasks() {
//     let tasks = getLocalStorage()
//     document.getElementById("numTasks").innerHTML = tasks.length;
// }


function popEditModal(element){
    let tasks = getLocalStorage();
    let taskId = getTaskId(element);
    let task = tasks.find(t => t.id == taskId);

    $("#TaskId").val(task.id);
    //document.getElementById("TaskId").value = task.id
    
    $("#NewTitle").val(task.title);    

    //Sweet works!
    let modalDueDate = buildModalDueDate(task.dueDate);
    $("#NewDueDate").val(modalDueDate);
    $("#editTaskItem").modal("show");
    
}

function clearTasks(){
    setLocalStorage(new Array());
    listTasks();
}

function buildModalDueDate(dueDate){
    let shortDate = dueDate.split("T")[0];
    return shortDate;
}

function setTaskCountLabel(message){
    $("#taskCount").text(message);
}

function searchTasks(searchString){
    searchString = searchString.toLowerCase();
    let allTasks = getLocalStorage();
    let tasks = allTasks.filter(t => t.title.toLowerCase().includes(searchString));
    setTaskCountLabel(`TASKS FOUND (${tasks.length})`);
    listTasks(tasks);
}

$(window).resize(function() {
    if ($(window).width() < 800 ) {
        $("#search").removeClass("float-right")
    }
    else {
        $("#search").addClass("floar-right")
    }
});