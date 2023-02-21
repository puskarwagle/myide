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

function createAceElement(parent, language = 'javascript') {
  const editorElement = document.createElement('div');
  editorElement.style.width = '100%';
  editorElement.style.height = '100%';
  parent.appendChild(editorElement);

  const aceInstance = ace.edit(editorElement);
  aceInstance.setTheme('ace/theme/chrome');

  // Set mode based on file extension
  const ext = language.toLowerCase();
  if (ext === 'js') {
    aceInstance.session.setMode('ace/mode/javascript');
  } else if (ext === 'html') {
    aceInstance.session.setMode('ace/mode/html');
  } else if (ext === 'css') {
    aceInstance.session.setMode('ace/mode/css');
  } else if (ext === 'xml') {
    aceInstance.session.setMode('ace/mode/xml');
  } else if (ext === 'md') {
    aceInstance.session.setMode('ace/mode/markdown');
  }

  aceInstance.setOptions({
    autoScrollEditorIntoView: true,
  });

  // Add mode selector
  const modeButton = document.createElement('button');
  modeButton.classList.add('modeButton');
  modeButton.textContent = language;
  const modes = [
    'javascript',
    'html',
    'css',
    'xml',
    'markdown'
  ];
  let currentModeIndex = modes.indexOf(language.toLowerCase());
  modeButton.addEventListener('click', () => {
    currentModeIndex = (currentModeIndex + 1) % modes.length;
    const currentMode = modes[currentModeIndex];
    modeButton.textContent = currentMode;
    aceInstance.getSession().setMode(`ace/mode/${currentMode}`);
  });

  // Add theme selector
  const themeButton = document.createElement('button');
  themeButton.classList.add('themeButton');
  themeButton.textContent = 'chrome';
  const themes = [
    'chrome',
    'eclipse',
    'monokai',
    'github',
    'tomorrow'
  ];
  let currentThemeIndex = 0;
  themeButton.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const currentTheme = themes[currentThemeIndex];
    themeButton.textContent = currentTheme;
    aceInstance.setTheme(`ace/theme/${currentTheme}`);
  });

  // Add font size slider
  const fontSizeSlider = document.createElement('input');
  fontSizeSlider.type = 'range';
  fontSizeSlider.min = '5';
  fontSizeSlider.max = '50';
  fontSizeSlider.value = '16';
  fontSizeSlider.style.transform = 'rotate(270deg)';
  fontSizeSlider.style.width = '4vw';
  fontSizeSlider.style.height = '4vw';
  fontSizeSlider.addEventListener('input', () => {
    const fontSize = fontSizeSlider.value;
    aceInstance.setFontSize(`${fontSize}px`);
  });

  // Append to FileMenu
  const fileMenu = document.querySelector('#FileMenu');
  fileMenu.appendChild(fontSizeSlider);
  fileMenu.appendChild(modeButton);
  fileMenu.appendChild(themeButton);

  return aceInstance;
}

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
  const aceEditorElement = createAceElement(fileContent, getAceModeFromFilename(filePath));
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

function getAceModeFromFilename(filename) {
  const extension = filename.split('.').pop();
  switch (extension) {
    case 'js':
      return 'javascript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'xml':
      return 'xml';
    case 'md':
      return 'markdown';
    default:
      return 'text';
  }
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
