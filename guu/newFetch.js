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
        // saveOpenedFileId(id);
      })
      .catch(error => {
        console.error(error);
      });
      document.getElementById("FilesBtn").click();
    }
  }
});

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
 
 // 
  const codeMirrorElement = createCodeMirrorElement(data, 'javascript', 'default');
  fileContent.appendChild(codeMirrorElement);
  fileContentsAll.appendChild(fileContent);
//

  // Hide all other file contents
  const fileContents = fileContentsAll.querySelectorAll('.fileContent');
  for (let i = 0; i < fileContents.length; i++) {
    fileContents[i].style.display = 'none';
  }

  // Show the newly created file content
  fileContent.style.display = 'block';
  addFileButtonListeners(fileNameBtn, fileId);
}

function createCodeMirrorElement(parent) {
  const codeMirror = CodeMirror(parent, {
    value: '',
    mode: 'javascript',
    theme: 'blackboard',
    lineNumbers: true,
    indentUnit: 4,
    smartIndent: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    scrollbarStyle: 'simple',
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
      'Cmd-Space': 'autocomplete',
      Tab: function(cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      }
    }
  });

  // Add font size slider
  const fontSizeSlider = parent.querySelector('#font-size-slider');
  fontSizeSlider.addEventListener('input', (event) => {
    const fontSize = event.target.value + 'px';
    codeMirror.getWrapperElement().style.fontSize = fontSize;
  });
  
  return codeMirror.getWrapperElement();
}

const parent = document.getElementById('Terminal');
createCodeMirrorElement(parent);