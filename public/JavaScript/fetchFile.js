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
      })
      .catch(error => {
        console.error(error);
      });
      document.getElementById("FilesBtn").click();
    }
  }
});

let themeIndex = 0;
const themes = [
  "ace/theme/tomorrow_night_eighties",
  "ace/theme/tomorrow",
  "ace/theme/monokai",
  "ace/theme/github",
  "ace/theme/merbivore",
  "ace/theme/solarized_dark",
  "ace/theme/solarized_light",
  "ace/theme/twilight",
  "ace/theme/clouds",
  "ace/theme/cobalt",
];
let mode = 'javascript';
let fontSize = '14px';

function createAceElement(parent) {
  const editor = document.createElement('div');
  editor.style.width = '100%';
  editor.style.height = '100%';
  parent.appendChild(editor);

  const aceInstance = ace.edit(editor);
  aceInstance.setTheme(themes[themeIndex]);
  aceInstance.session.setMode(`ace/mode/${mode}`);
  aceInstance.setFontSize(fontSize);
  aceInstance.setOptions({
    autoScrollEditorIntoView: true,
  });

  return aceInstance;
}

const themeSelector = document.createElement("select");
themeSelector.innerHTML = themes
  .map((theme) => `<option value="${theme}">${theme}</option>`)
  .join("\n");
themeSelector.addEventListener("change", function () {
  themeIndex = this.selectedIndex;
  const editor = ace.edit("editor");
  const newTheme = themes[themeIndex];
  editor.setTheme(newTheme);
});

const modeSelector = document.createElement("select");
modeSelector.innerHTML = `
<option value="javascript">JavaScript</option>
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
  const editor = ace.edit("editor");
  editor.session.setMode(`ace/mode/${mode}`);
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
  const editor = ace.edit("editor");
  const newFontSize = this.value;
  editor.setFontSize(newFontSize);
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







// 8. heyyy new 
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
  `;
  FileButtonsAll.appendChild(fileNameBtn);

  // File content
  const fileContent = document.createElement('div');
  fileContent.classList.add('fileContent');
  const fileId = filePath.replace(/\//g, '-');
  fileContent.id = `fileContent-${fileId}`;
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
}

// 9. Close and toggle buttons on file headers
function addFileButtonListeners(fileNameBtn, fileId) {
  const closeButton = fileNameBtn.querySelector('.close');
  const fileName = fileNameBtn.querySelector('.fileName');
  const filePath = fileName.textContent;
  const fileContent = document.getElementById(`fileContent-${fileId}`);

  closeButton.addEventListener('click', function() {
    fileNameBtn.remove();
    if (fileContent) {
      fileContent.remove();
     // removeOpenedFileId(filePath);
    }
  });

  fileName.addEventListener('click', function() {
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
