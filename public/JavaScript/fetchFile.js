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

// 8. CodeMirror .fileContent
function createCodeMirrorElement(parent) {
  const codeMirrorWrapper = document.createElement('div');
  const codeMirrorElement = document.createElement('textarea');
  codeMirrorElement.value = '';
  codeMirrorWrapper.classList.add('CodeMirror');
  parent.appendChild(codeMirrorWrapper);
  const editor = CodeMirror(function(elt) {
    codeMirrorWrapper.appendChild(elt);
  }, {
    value: codeMirrorElement.value,
    lineNumbers: true,
    mode: 'css',
    autofocus: true,
    theme: 'default'
  });

  // Add mode selector
  const modeButton = document.createElement('button');
  modeButton.textContent = 'JavaScript';
  const modes = [
    'javascript',
    'htmlmixed',
    'css',
    'xml',
    'markdown'
  ];
  let currentModeIndex = 0;
  modeButton.addEventListener('click', () => {
    currentModeIndex = (currentModeIndex + 1) % modes.length;
    const currentMode = modes[currentModeIndex];
    modeButton.textContent = currentMode;
    editor.setOption('mode', currentMode);
  });

  // Add theme selector
  const themeButton = document.createElement('button');
  themeButton.textContent = 'default';
  const themes = [
    'default',
    '3024-day',
    '3024-night',
    'ambiance',
    'ambiance-mobile'
  ];
  let currentThemeIndex = 0;
  themeButton.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const currentTheme = themes[currentThemeIndex];
    themeButton.textContent = currentTheme;
    editor.setOption('theme', currentTheme);
  });

  // Add font size slider
  const fontSizeSlider = document.createElement('input');
  fontSizeSlider.type = 'range';
  fontSizeSlider.min = '5';
  fontSizeSlider.max = '50';
  fontSizeSlider.value = '5';
  fontSizeSlider.addEventListener('input', () => {
    const fontSize = fontSizeSlider.value;
    codeMirrorWrapper.style.fontSize = `${fontSize}px`;
  });

  const fileMenu = document.querySelector('#FileMenu');
  fileMenu.appendChild(fontSizeSlider);
  fileMenu.appendChild(modeButton);
  fileMenu.appendChild(themeButton);

  return codeMirrorWrapper;
}

// 7. Text editor
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

  // Add CodeMirror element
	const codeMirrorElement = createCodeMirrorElement(fileContent);
	if (data) {
	  const codeMirrorInstance = codeMirrorElement.firstChild.CodeMirror;
  	codeMirrorInstance.setValue(data);
 	  codeMirrorInstance.focus();
	}
	fileContent.appendChild(codeMirrorElement);


  // Hide all other file contents
  const fileContents = fileContentsAll.querySelectorAll('.fileContent');
  for (let i = 0; i < fileContents.length; i++) {
    fileContents[i].style.display = 'none';
  }

  // Show the newly created file content
  fileContent.style.display = 'block';
  addFileButtonListeners(fileNameBtn, fileId);
}

// 8. Close and toggle buttons on file headers
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
