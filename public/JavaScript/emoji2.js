// 🗿 DELETE FOLDER ☠️
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("emoji") && event.target.classList.contains("fodel")) {
    let id = event.target.id;
    let crudFolderType = id.split("-")[0];
    let folderPath = id.split("-")[1];
    console.log("crudType: " + crudFolderType);
    console.log("folderPath: " + folderPath);
    
    fetch('/server/folder/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folderPath })
    })
    .then(response => {
      //console.log(response);
    })
    .then(data => {
      //console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
  }
});

// 🗿 DELETE A FILE ☠️ 🗿 DELETE A FILE ☠️
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("emoji") && event.target.classList.contains("fidel")) {
    let id = event.target.id;
    let crudFileType = id.split("-")[0];
    let filePath = id.split("-")[1];
    console.log("crudFileType: " + crudFileType);
    console.log("filePath: " + filePath);

    fetch('/server/file/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filePath })
    })
    .then(response => {
      console.log(response);
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
  }
});

// 🗂 RENAME FOLDER 🗂
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("emoji") && event.target.classList.contains("foren")) {
    let id = event.target.id;
    let folderPath = id.split("-")[1];
    let newFolderName = prompt("Enter the new name for the folder:");
    console.log("folderPath: " + folderPath);
    console.log("newFolderName: " + newFolderName);

    fetch('/server/folder/rename', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folderPath, newFolderName })
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error(error);
    });
  }
});
