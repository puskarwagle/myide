// 6. 📄 READFILE 📄
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
        saveOpenedFileId(id);
      })
      .catch(error => {
        console.error(error);
      });
      document.getElementById("FilesBtn").click();
    }
  }
});
// localStorage.clear();


// 7. Text editor
function createTextFile(data, filePath) {
  const parent = document.getElementById('OpenedFiles');
  const FileButtonsAll = document.getElementById('FileButtonsAll');
  const fileContentsAll = document.getElementById('fileContentsAll');
  
  const fileNameBtn = document.createElement('div');
  fileNameBtn.classList.add('fileNameBtn');
  const fileName = filePath.split('/').pop();
  fileNameBtn.id = `fileNameBtn-${filePath}`;
  fileNameBtn.innerHTML = `
    <button class="fileName">${fileName}</button>
    <button class="close"><i class="fas fa-times"></i></button>
  `;
  FileButtonsAll.appendChild(fileNameBtn);

  const fileContent = document.createElement('div');
  fileContent.classList.add('fileContent');
  const fileId = filePath.replace(/\//g, '-');
  fileContent.id = `fileContent-${fileId}`;
  fileContent.textContent = data;
  fileContentsAll.appendChild(fileContent);

  // Hide all other file contents
  const fileContents = fileContentsAll.querySelectorAll('.fileContent');
  for (let i = 0; i < fileContents.length; i++) {
    fileContents[i].style.display = 'none';
  }

  // Show the newly created file content
  fileContent.style.display = 'block';

  addFileButtonListeners(fileNameBtn, fileId);
}

function addFileButtonListeners(fileNameBtn, fileId) {
  const closeButton = fileNameBtn.querySelector('.close');
  const fileName = fileNameBtn.querySelector('.fileName');
  const filePath = fileName.textContent;
  const fileContent = document.getElementById(`fileContent-${fileId}`);

  closeButton.addEventListener('click', function() {
    fileNameBtn.remove();
    if (fileContent) {
      fileContent.remove();
      removeOpenedFileId(filePath);
    }
  });

  fileName.addEventListener('click', function() {
    if (fileContent) {
      const allFileContents = document.querySelectorAll('.fileContent');
      allFileContents.forEach((content) => {
        content.hidden = true;
      });
      fileContent.hidden = false;
    }
  });
}
// 🧏

// 9. Push to local storage
function saveOpenedFileId(id) {
  const openedFiles = getOpenedFiles();
  openedFiles.push(id);
  localStorage.setItem('openedFiles', JSON.stringify(openedFiles));
  console.log(`File ID ${id} saved to local storage.`);
}

// 10.  Remove from local storage on close button click
function removeOpenedFileId(id) {
  const openedFiles = getOpenedFiles();
  const index = openedFiles.indexOf(id);
  if (index > -1) {
    openedFiles.splice(index, 1);
  }
  localStorage.setItem('openedFiles', JSON.stringify(openedFiles));
  console.log(`File ID ${id} removed from local storage.`);
}

// 11.  This should get the parsedFiles and run them through no 6 function but how ?
function getOpenedFiles() {
  const openedFiles = localStorage.getItem('openedFiles');
  if (openedFiles) {
    const parsedFiles = JSON.parse(openedFiles);
    console.log(`${parsedFiles.length} files retrieved from local storage.`);
    parsedFiles.forEach((fileId) => {
      fetch(`/server/file/read/${fileId.split("-")[1]}`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        createTextFile(data, fileId.split("-")[1]);
      })
      .catch(error => {
        console.error(error);
      });
    });
    return parsedFiles;
  } else {
    console.log('No files found in local storage.');
    return [];
  }
}

