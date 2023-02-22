// Retrieve the list of saved file paths from local storage or set to empty array if not available
let recentFilePaths = JSON.parse(localStorage.getItem("recentFilePaths")) || [];

window.addEventListener("load", function() {
  // Send fetch request for each filePath in recentFilePaths array
  Promise.all(recentFilePaths.map((filePath) => {
    return fetch('/server/file/read', {
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
      createTextFile(data, filePath);
    })
    .catch(error => {
      console.error(error);
    });
  })).then(() => {
    // All fetch requests complete
    console.log("All fetch requests complete");
    document.getElementById("FilesBtn").click();
  });
});


// 6. 📄 READFILE 📄
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("file-area") || event.target.classList.contains("file-span")) {
    if (!event.target.classList.contains("emoji")) {
      let id = event.target.closest(".file-area").id;
      let filePath = id.split("-")[1];
      let fileName = filePath.split('/').pop();
      // console.log("fileName: " + fileName);
      // console.log("filePath: " + filePath);
      
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
        createTextFile(data, filePath);
      })
      .catch(error => {
        console.error(error);
      });
      document.getElementById("FilesBtn").click();
    }
  }
});

// ace
let themeIndex = 1; // set default theme to merbivore
const themes = [
  "ace/theme/monokai",
  "ace/theme/merbivore",
  "ace/theme/tomorrow_night_eighties",
  "ace/theme/tomorrow",
  "ace/theme/github",
  "ace/theme/solarized_dark",
  "ace/theme/solarized_light",
  "ace/theme/twilight",
  "ace/theme/clouds",
  "ace/theme/cobalt",
];

let mode = 'javascript'; // set default mode to javascript
let fontSize = '14px';

let aceInstance;

function createAceElement(parent) {
  const editor = document.createElement('div');
  editor.style.width = '100%';
  editor.style.height = '100%';
  parent.appendChild(editor);

  aceInstance = ace.edit(editor);
aceInstance.setOptions({
  autoScrollEditorIntoView: true,
  highlightActiveLine: true,
  highlightSelectedWord: true,
  readOnly: false,
  showFoldWidgets: true,
  showGutter: true,
  showInvisibles: false,
  wrap: false
});

  // set default theme and mode
  aceInstance.setTheme(themes[themeIndex]);
  aceInstance.session.setMode(`ace/mode/${mode}`);

  return aceInstance;
}

const themeSelector = document.createElement("select");
themeSelector.innerHTML = themes
  .map((theme) => `<option value="${theme}">${theme.split('/').pop()}</option>`)
  .join("\n");
themeSelector.selectedIndex = themeIndex; // set default theme as selected
themeSelector.addEventListener("change", function () {
  themeIndex = this.selectedIndex;
  const newTheme = themes[themeIndex];
  aceInstance.setTheme(newTheme);
});

const modeSelector = document.createElement("select");
modeSelector.innerHTML = `
<option value="javascript" selected>JavaScript</option> <!-- set default mode as selected -->
<option value="html">HTML</option>
<option value="css">CSS</option>
<option value="xml">XML</option>
<option value="markdown">Markdown</option>
<option value="python">Python</option>
<option value="ruby">Ruby</option>
<option value="java">Java</option>
<option value="c_cpp">C/C++</option>
<option value="golang">Go</option>
`;
modeSelector.addEventListener("change", function () {
  mode = this.value;
  aceInstance.session.setMode(`ace/mode/${mode}`);
});

const fontSizeSelector = document.createElement("select");
fontSizeSelector.innerHTML = `
<option value="12px">12px</option>
<option value="14px" selected>14px</option>
<option value="16px">16px</option>
<option value="18px">18px</option>
<option value="20px">20px</option>
<option value="24px">24px</option>
<option value="28px">28px</option>
<option value="32px">32px</option>
<option value="36px">36px</option>
<option value="40px">40px</option>
`;
fontSizeSelector.addEventListener("change", function () {
  const newFontSize = this.value;
  aceInstance.setFontSize(newFontSize);
});

const fileMenu = document.querySelector('#FileMenu');
const container = document.createElement("div");
container.style.display = "flex";
container.style.flexDirection = "row";
container.style.justifyContent = "space-between";
container.appendChild(themeSelector);
container.appendChild(modeSelector);
container.appendChild(fontSizeSelector);
fileMenu.appendChild(container);
// 🎧

// 8. CREATING FILE NAME, CLOSE BUTTONS 
function createTextFile(data, filePath) {
  const parent = document.getElementById('OpenedFiles');
  const FileButtonsAll = document.getElementById('FileButtonsAll');
  const fileContentsAll = document.getElementById('fileContentsAll');
  
  // Headers
  const fileNameBtn = document.createElement('div');
  fileNameBtn.classList.add('fileNameBtn');
  const fileName = filePath.split('/').pop();
  fileNameBtn.id = `fileNameBtn-${filePath}`;
  fileNameBtn.innerHTML = `
    <button class="fileName">${fileName}</button>
    <button class="close"><i class="fas fa-times"></i></button>
    <button class="save">Save</button>
  `;
  FileButtonsAll.appendChild(fileNameBtn);

  // File content
  const fileContent = document.createElement('div');
  fileContent.classList.add('fileContent');
  // const fileId = filePath.replace(/\//g, '-');
  fileContent.id = `fileContent-${filePath}`;
  const fileId = fileContent.id;
  fileContentsAll.appendChild(fileContent);

  // Add Ace editor element
  const aceEditorElement = createAceElement(fileContent);
  if (data) {
    aceEditorElement.setValue(data);
    aceEditorElement.focus();
  }

  // Hide all other file contents
  const fileContents = fileContentsAll.querySelectorAll('.fileContent');
  for (let i = 0; i < fileContents.length; i++) {
    fileContents[i].style.display = 'none';
  }

  // Show the newly created file content
  fileContent.style.display = 'block';

  // Add file button listeners
  addFileButtonListeners(fileNameBtn, fileId);

// Add save button listener
const saveBtn = fileNameBtn.querySelector('.save');
saveBtn.addEventListener('click', () => {
  const textdata = aceEditorElement.getValue();
  if (typeof textdata !== 'string') {
    throw new Error('Expected textdata to be a string but its not yo');
  }
  fetch('/save-file', {
    method: 'POST',
    body: JSON.stringify({ filePath, textdata }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save file');
      }
      else {
        // Check if the saved file path already exists in the list of recent file paths
        const index = recentFilePaths.indexOf(filePath);
        if (index > -1) {
          // Remove the duplicate file path from the list
          recentFilePaths.splice(index, 1);
        }

        // Add the saved file path to the list of recent file paths
        recentFilePaths.push(filePath);

        // Limit the list to the last 10 saved file paths
        if (recentFilePaths.length > 10) {
          recentFilePaths = recentFilePaths.slice(recentFilePaths.length - 10);
        }

        // Save the updated list of recent file paths to local storage
        localStorage.setItem("recentFilePaths", JSON.stringify(recentFilePaths));
        alert('File saved successfully');
      }
    })
    .catch(error => {
      alert('Error saving file');
      console.error(error);
    });
});
}



// 9. Close and toggle buttons on file headers
function addFileButtonListeners(fileNameBtn, fileId) {
  const closeButton = fileNameBtn.querySelector('.close');
  const fileName = fileNameBtn.querySelector('.fileName');
  const fileContent = document.getElementById(`${fileId}`);
  let filePath = fileId.split("-")[1];
  
  closeButton.addEventListener('click', function() {
  fileNameBtn.remove();
  if (fileContent) {
    fileContent.remove();
    // Remove filePath from recentFilePaths array
    const index = recentFilePaths.indexOf(filePath);
    if (index > -1) {
      recentFilePaths.splice(index, 1);
      localStorage.setItem('recentFilePaths', JSON.stringify(recentFilePaths));
    }
  }
});

  fileName.addEventListener('click', function() {
  console.log(fileId);
  console.log(filePath);
    if (fileContent) {
      const allFileContents = document.querySelectorAll('.fileContent');
      allFileContents.forEach((content) => {
        content.style.display = 'none';
      });
      fileContent.style.display = 'block';
    }
  });
}
// 🧏
