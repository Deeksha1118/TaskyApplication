// var state = {
//     taskList : [
//         {
//             imageUrl : "",
//             taskTitle : "",
//             taskType : "",
//             taskDesc : ""
//         },
//         {
//             imageUrl : "",
//             taskTitle : "",
//             taskType : "",
//             taskDesc : ""
//         }
//     ]
// }

// backup storage

const state = {
    taskList : [],
};
// to call object state.taskList

// DOM opperations

const taskContents = document.querySelector(".taskContent");
const taskModal = document.querySelector(".taskModelBody");

console.log(taskContents);
console.log(taskModal);

// template for a card on sreen
// key = ${id} add on line 57 if warning occurs
const htmlTaskContent = ({id, url, title, type, description}) => `
    <div class = "col-md-6 col-lg-4 mt-3" id = ${id}>
        <div class = "card shadow taskCard">
            <div class = "card-header d-flex justify-content-end taskCardHeader">
                <button type = "button" class = "btn btn-outline-primary mr-1.5" name = ${id} onclick = "editTask.apply(this, arguments)">
                    <i class = "fa-solid fa-pencil-alt" name = ${id}></i>
                </button>
                <button type = "button" class = "btn btn-outline-danger mr-1.5" name = ${id} onclick = "deleteTask.apply(this, arguments)">
                    <i class = "fa-solid fa-trash-alt" name = ${id}></i>
                </button>
            </div>
            <div class = "card-body">
                ${
                    url
                    ? `<img width = "100%" src = ${url} alt = "Card Image" class = "card-img-top md-3 rounded-lg" />`
                    : `<img width = "100%" src = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Begrippenlijst.svg" alt = "Card Image" class = "card-img-top md-3 rounded-lg" />`
                }
                <h4 class = "card-title taskCardTitle">${title}</h4>
                <div class = "tags text-white d-flex flex-wrap">
                    <span class = "badge bg-primary m-1">${type}</span>
                </div>
                <p class = "description trim-3-lines text-muted">${description}</p>
            </div>
            <div class = "card-footer">
                <button type = "button" class = "btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showTask" onclick = "openTask.apply(this, arguments)" id = ${id}>Open Task</button>
            </div>
        </div>
    </div>
`;

// modal body on >> click of open task

const htmlModalContent = ({id, url, title, description}) => {
    const date = new Date(parseInt(id));
    return `
        <div id = ${id}>
            ${
                url
                ? `<img width = "100%" src = ${url} alt = "Card Image" class = "card-img-top md-3 rounded-lg" />`
                : `<img width = "100%" src = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Begrippenlijst.svg" alt = "Card Image" class = "card-img-top md-3 rounded-lg" />`
            }
            <strong class = "text-muted text-sm">Created on : ${date.toDateString()}</strong>
            <h2 class = "my-3">${title}</h2>
            <p class = "text-muted">${description}</p>
        </div>
    `;
};

// updating Local Storage
// here we convert json to str(for local storage)

const updateLocalstorage = () => {
    localStorage.setItem(
        "task",
        JSON.stringify({
            tasks : state.taskList,
        })
    );
};

// load initial data
// here we convert str to json(rendering the cards on screen)

const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);

    if(localStorageCopy) state.taskList = localStorageCopy.tasks;

    state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
    });
};

//when we update or edit.. we need to save (cards)
const handleSubmit = (event) => {
    const id = `${Date.now()}`;        // id = date
    const input = {
        url : document.getElementById("imageUrl").value,   //getting field item from html to js
        title : document.getElementById("taskTitle").value,
        type : document.getElementById("tags").value,
        description : document.getElementById("taskDesc").value
    };
    if(input.title == "" || input.type == "" || input.description == "") {
        return alert("Please fill all the necessary fields! ");
    }
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent({...input, id }));  // showing updated data from your js to html
    state.taskList.push({...input, id }); // for not to loss data once reload,   for storing the things on array
    updateLocalstorage(); // for storing the things on browser
};

// open task

const openTask = (e) => {
    if(!e) e = window.event;

    const getTask = state.taskList.find(({id}) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);
};

// delete task

const deleteTask = (e) => {
    if(!e) e = window.event;  //getting triggerd in new window

    const targetID = e.target.getAttribute("name");
    // console.log(targetID);
    const type = e.target.tagName;
    // console.log(type);
    const removeTask = state.taskList.filter(({id}) => id !== targetID);
    // console.log(removeTask);
    updateLocalstorage();

    if(type === "BUTTON") {
        console.log(e.target.parentNode.parentNode.parentNode.parentNode);
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    }
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );
};

// edit task

const editTask = (e) => {
    if(!e) e = window.event;

    const targetID = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskType;
    let taskDesc;
    let submitButton;

    if(type === "BUTTON"){
        parentNode = e.target.parentNode.parentNode;
    }
    else {
        parentNode = e.target.parentNode.parentNode.parentNode; 
    }

    // taskTitle = parentNode.childNodes;
    // console.log(taskTitle);

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskType = parentNode.childNodes[3].childNodes[5];
    taskDesc = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];

    // console.log(taskTitle, taskDesc, taskType, submitButton);
    
    if (taskTitle) taskTitle.setAttribute("contenteditable", "true");
    if (taskType) taskType.setAttribute("contenteditable", "true");
    if (taskDesc) taskDesc.setAttribute("contenteditable", "true");
    
    // submitButton.setAttribute("onclick", "saveEdit.apply(this, argument)");
    submitButton.setAttribute("onclick", () => saveEdit());
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");

    submitButton.innerHTML = "Save Edit";
};

// console.log('targetID:', targetID);
// console.log('parentNode:', parentNode);
// console.log('taskTitle:', taskTitle);
// console.log('taskType:', taskType);
// console.log('taskDesc:', taskDesc);
// console.log('submitButton:', submitButton);


//save edit

 const saveEdit = (e) => {
    if(!e) e = window.event;

    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    // console.log(parentNode.childNodes);

    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskType = parentNode.childNodes[3].childNodes[5];
    const taskDesc = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];
    
    const updateData = {
        taskTitle : taskTitle.innerHTML,
        taskType : taskType.innerHTML,
        taskDesc : taskDesc.innerHTML
    };
    let stateCopy  = state.taskList;

    stateCopy = stateCopy.map((task) => task.id === targetID 
    ? {
        id : task.id,
        title : updateData.taskTitle,
        type : updateData.taskType,
        description : updateData.taskDesc,
        url : task.url
    } 
    : task
    );
    state.taskList = stateCopy;
    updateLocalstorage();

    if (taskTitle) taskTitle.setAttribute("contenteditable", "false");
    if (taskType) taskType.setAttribute("contenteditable", "false");
    if (taskDesc) taskDesc.setAttribute("contenteditable", "false");

    // submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("onclick", () => openTask());
    submitButton.setAttribute("data-bs-toggle","modal");
    submitButton.setAttribute("data-bs-target","showTask");
    submitButton.innerHTML = "Open Task";
 };

//  search

const searchTask = (e) => {
    if(!e) e = window.event;

    while(taskContents.firstChild) {
        taskContents.removeChild(taskContents.firstChild)
    }
    const resultData = state.taskList.filter(({title}) => 
        title.toLowerCase().includes(e.target.value.toLowerCase())
    );

    // console.log(resultData);
    resultData.map((cardDate) => {
        // taskContents.insertAdjacentHTML("beforeend", htmlModalContent(cardDate));
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
    });
};
