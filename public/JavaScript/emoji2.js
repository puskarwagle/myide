// 🗿 DELETE FOLDER ☠️
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("emoji") && event.target.classList.contains("fodel")) {
    let id = event.target.id;
    let crudFolderType = id.split("-")[0];
    let folderPath = id.split("-")[1];
    console.log("crudType: " + crudFolderType);
    console.log("folderPath: " + folderPath);
    if (confirm(`Are you sure you want to delete this folder: ${folderPath} ?`)) {
      fetch('/server/folder/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ folderPath })
      })
      .then(response => {
        if (response.ok) {
          let folderEl = document.getElementById(id);
          let parentEl = folderEl.parentNode;
          parentEl.style.display = "none";
        }
      })
      .catch(error => {
        console.error(error);
      });
    }
  }
});
// 🗿 DELETE A FILE ☠️ 🗿 DELETE A FILE ☠️
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("emoji") && event.target.classList.contains("fidel")) {
    let id = event.target.id;
    let crudFileType = id.split("-")[0];
    let filePath = id.split("-")[1];
    // console.log("crudFileType: " + crudFileType);
    // console.log("filePath: " + filePath);
  if (confirm(`Are you sure you want to delete file: ${filePath} ?`)) {
    fetch('/server/file/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filePath })
    })
    .then(response => {
        if (response.ok) {
          let fileEl = document.getElementById(id);
          let parentEl = fileEl.parentNode;
          parentEl.style.display = "none";
        }
    })        
    .catch(error => {
      console.error(error);
    });
    }
  }
});

// 🖊️ RENAME FOLDER 📂
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("emoji") && event.target.classList.contains("foren")) {
    let id = event.target.id;
    let folderPath = id.split("-")[1];
    let newFolderName = prompt("Enter the new name for " + folderPath);
    console.log("folderPath: " + folderPath);
    console.log("newFolderName: " + newFolderName);
    fetch('/server/folder/rename', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folderPath, newFolderName })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let folderElement = document.getElementById(id).parentNode;
      let folderNameElement = folderElement.querySelector(".foname");
      folderNameElement.textContent = newFolderName;
    })
    .catch(error => {
      console.error(error);
    });
  }
});
// 📄 RENAME FILE 📄
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("emoji") && event.target.classList.contains("firen")) {
    let id = event.target.id;
    let filePath = id.split("-")[1];
    let newFileName = prompt(`Enter the new name for ${filePath}`);
    // console.log("filePath: " + filePath);
    // console.log("newFileName: " + newFileName);
    fetch('/server/file/rename', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filePath, newFileName })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let fileElement = document.getElementById(id).parentNode;
      let fileNameElement = fileElement.querySelector(".finame");
      fileNameElement.textContent = newFileName;
    })
    .catch(error => {
      console.error(error);
    });
  }
});

// 🗿 Add to FOLDER ➕
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("emoji") && event.target.classList.contains("foadd")) {
    let newFileFolderName = prompt("Enter the name for the new file/folder:");
    let id = event.target.id;
    let folderPath = id.split("-")[1];
    console.log("folderPath: " + folderPath);
    console.log("newFileFolderName: " + newFileFolderName);   
    fetch('/server/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folderPath, newFileFolderName })
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error(error);
    });
  }
});

// 📄 READFILE 📄
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("file-area") || event.target.classList.contains("file-span")) {
    if (!event.target.classList.contains("emoji")) {
      let id = event.target.closest(".file-area").id;
      let filePath = id.split("-")[1];
      let fileName = filePath.split('/').pop();
      console.log("fileName: " + fileName);
      console.log("filePath: " + filePath);
      
      fetch('/server/file/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filePath })
      })
      .then(response => {
        return response.text();
      })
      .then(data => {
        createTextFile(data, fileName);
        document.getElementById("FilesBtn").click();
      })
      .catch(error => {
        console.error(error);
      });
    }
  }
});

function createTextFile(data, fileName) {
  const parent = document.getElementById('OpenedFiles');
  const FileButtonsAll = document.getElementById('FileButtonsAll');
  const fileContentsAll = document.getElementById('fileContentsAll');
  
  const fileNameBtn = document.createElement('div');
  fileNameBtn.classList.add('fileNameBtn');
  fileNameBtn.id = `fileNameBtn-${fileName}`;
  fileNameBtn.innerHTML = `
    <button class="fileName">${fileName}</button>
    <button class="close"><i class="fas fa-times"></i></button>
  `;
  FileButtonsAll.appendChild(fileNameBtn);

  const fileContent = document.createElement('div');
  fileContent.classList.add('fileContent');
  fileContent.id = `fileContent-${fileName}`;
  fileContent.textContent = data;
  fileContentsAll.appendChild(fileContent);
  
  addFileButtonListeners(fileNameBtn);
}

function addFileButtonListeners(fileNameBtn) {
  const closeButton = fileNameBtn.querySelector('.close');
  const fileName = fileNameBtn.querySelector('.fileName');

  closeButton.addEventListener('click', function() {
    fileNameBtn.remove();
    const fileContent = document.getElementById(`fileContent-${fileName.textContent}`);
    if (fileContent) {
      fileContent.remove();
    }
  });

  fileName.addEventListener('click', function() {
    const fileContent = document.getElementById(`fileContent-${fileName.textContent}`);
    if (fileContent) {
      fileContent.classList.toggle('hidden');
    }
  });
}

fileContent.id = `fileContent-${fileName}`;

// hide all file content divs except the current one
const fileContents = document.querySelectorAll('#fileContentsAll > div');
for (let i = 0; i < fileContents.length; i++) {
  fileContents[i].classList.remove('open');
}
// get the current file content div and add a class to it
const currentFileContent = document.getElementById(`fileContent-${fileName}`);
currentFileContent.classList.add('open');
