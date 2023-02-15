// console.log("This file: fetchfile.js");
// 1. 🗿 File click fetch content 📑📑📑📑📑📑📑📑📑📑📑📑📑
document.getElementById('tree').addEventListener('click', function(event) {
  if (event.target.matches('.file-span')) {
    setupFileSpans(event);
  }
});

// 2. Setup File Spans
function setupFileSpans(event) {
  const fileSpans = document.getElementsByClassName("file-span");
  Array.from(fileSpans).forEach(fileSpan => {
    fileSpan.addEventListener('click', () => {
      if (event.target.classList.contains('file-span')) {
        const path = event.target.parentNode.id.split('-')[1];
        console.log('2. ℹ️ Full path of file-span from parent id: ' + path);
        displayFile(path);
        document.getElementById("FilesBtn").click();
      }
    });
  });
}

// 3. 🗿 Display file
const displayFile = (path) => {
  const fileName = path.split("/").pop();
  const fileExtension = fileName.split(".")[1];
  const capitalizedFileExtension = fileExtension.charAt(0).toUpperCase() + fileExtension.slice(1);
  const fileContentDivId = fileName.split(".")[0] + capitalizedFileExtension;
  // If the file content div already exists, make it visible
  if (isFileDivVisible(fileContentDivId)) {
    return;
  }
  // If the file content div does not exist, send the fetch request
  fetchAndDisplayFile(path, fileName, fileExtension, fileContentDivId);
  console.log(`3: Path - ${path}, File Name - ${fileName}, File Extension - ${fileExtension}, File Content Div ID - ${fileContentDivId} ℹ️`);
};

// 4. 
const isFileDivVisible = (fileContentDivId) => {
  const fileContentDiv = document.getElementById(fileContentDivId);
  if (fileContentDiv) {
    console.log(`fileContentDiv with id ${fileContentDivId} found ✅`);
    const allFileContentDivs = document.querySelectorAll(".fileContentDiv");
    allFileContentDivs.forEach(div => {
      div.style.display = "none";
    });
    fileContentDiv.style.display = "block";
    console.log(`4a. fileContentDiv with id ${fileContentDivId} is now visible ✅`);
    return true;
  }
  // fileContentDivId requires .
  console.log(`4b. fileContentDiv with id ${fileContentDivId} not found ℹ️`);
  return false;
};

// 5.
const fetchAndDisplayFile = (path, fileName, fileExtension, fileContentDivId) => {
   console.log('5. fetch URL:', `/file-contents/${path.slice(2)}`);
   fetch(`/fileContent-${path.slice(0)}`)
   .then(response => response.json())
   .then(data => {
      const fileContent = data.content;
      console.log(`5. File content for ${fileName} fetched successfully ✅`);
      
      const fileNameButton = createFileNameButton(fileName, fileContentDivId);
      console.log(`5. File name button for ${fileName} created successfully ✅`);
      
      const newFileContentDiv = createFileContentDiv(fileContentDivId, fileContent, fileExtension);
      console.log(`5. File content div for ${fileName} created successfully ✅`);
      
      displayFileElements(fileNameButton, newFileContentDiv);
      console.log(`5. File name button and content div for ${fileName} displayed successfully ✅`);
      
      // Store the file name in the recently opened array
      storeRecentlyOpenedFiles(fileName);
      console.log(`5. ${fileName} added to recently opened files ✅`);
    })
    .catch(error => 
      console.error(`5. Error fetching file content for ${path}: , error ❌`)
     );
};

// 6.
const createFileNameButton = (fileName, fileContentDivId) => {
  const fileNameButton = document.createElement("button");
  fileNameButton.className = 'fileNameButton';
  fileNameButton.innerHTML = `${fileName} <i class="fas fa-times"></i>`;
  fileNameButton.addEventListener("click", () => {
    removeFileElements(fileContentDivId);
    fileNameButton.remove();
  });
  fileNameButton.addEventListener("click", () => {
    displayFile(`${fileName}.${fileExtension}`);
  });
  return fileNameButton;
};

// 7.
const displayFileContent = (fileContent, fileContentDivId) => {
  if (isFileDivVisible(fileContentDivId)) {
    const fileContentDiv = document.getElementById(fileContentDivId);
    fileContentDiv.innerHTML = fileContent;
    console.log(`file content displayed in fileContentDiv with id ${fileContentDivId}`);
  } else {
    console.error(`fileContentDiv with id ${fileContentDivId} not found`);
  }
};

// 8.
const updatePathInDisplay = (path, pathDisplayDivId) => {
  const pathDisplayDiv = document.getElementById(pathDisplayDivId);
  if (pathDisplayDiv) {
    pathDisplayDiv.innerHTML = path;
    console.log(`path updated in the display with id "${pathDisplayDivId}" to "${path}"`);
    return true;
  }
  console.log(`element with id "${pathDisplayDivId}" not found`);
  return false;
};

// 9.
const createFileContentDiv = (fileContentDivId, fileContent, fileExtension) => {
  let newFileContentDiv = document.createElement("div");
  newFileContentDiv.className = 'fileContentDiv';
  newFileContentDiv.id = fileContentDivId;
  let mode;
  switch (fileExtension) {
    case "html":
      mode = "htmlmixed";
      break;
    case "css":
      mode = "css";
      break;
    case "js":
      mode = "javascript";
      break;
    case "py":
      mode = "python";
      break;
    default:
      mode = "text/plain";
      break;
  }
  const editor = CodeMirror(newFileContentDiv, {
    value: fileContent,
    mode: mode,
    lineNumbers: true,
    readOnly: true
  });
  return newFileContentDiv;
};

// 10.
const displayFileElements = (fileNameButton, fileContentDiv) => {
  console.log(`Adding fileNameButton: ${fileNameButton}`);
  console.log(`Adding fileContentDiv: ${fileContentDiv}`);
  
  const fileNameButtonsDiv = document.querySelector("#fileNameButtonsDiv");
  fileNameButtonsDiv.appendChild(fileNameButton);
  
  const fileContentsDiv = document.querySelector("#fileContentsDiv");
  fileContentsDiv.appendChild(fileContentDiv);
};

// 11.
const removeFileElements = (fileContentDivId) => {
  const fileContentDiv = document.getElementById(fileContentDivId);
  if (fileContentDiv) {
    fileContentDiv.remove();
  }
};

// 12.
const storeRecentlyOpenedFiles = (fileName) => {
  // Code to store recently opened files goes here
};
