//import CodeMirror from 'codemirror';

document.getElementById("ListOfFilesNFolders").style.display ="block";
document.getElementById("OpenedFiles").style.display ="none";
document.getElementById("LocalHost").style.display ="none";
document.getElementById("Terminal").style.display ="none";
// ð¿TERMINAL+FILE MANAGER+FILES+BROWSER BUTTONS
// â¸ï¸â¹ï¸âºï¸â¶ï¸ð¼ð½â¸ï¸â¹ï¸âºï¸â¶ï¸ð¼ð½â¸ï¸â¹ï¸âºï¸â¶ï¸ð¼ð½â¸ï¸â¹ï¸âºï¸â¶ï¸ð¼ð½
const buttons = [
  document.getElementById("FileManagerBtn"),
  document.getElementById("FilesBtn"),
  document.getElementById("LocalHostBtn"),
  document.getElementById("TerminalBtn")
];
const pages = [
  document.getElementById("ListOfFilesNFolders"),
  document.getElementById("OpenedFiles"),
  document.getElementById("LocalHost"),
  document.getElementById("Terminal")
];

// Add event listeners to the buttons
buttons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    pages.forEach((page, i) => {
      page.style.display = i === index ? "block" : "none";
    });
  });
}); // ð¦ð¦ð¦ð¦ð¦ð¦ð¦â¸ï¸â¹ï¸âºï¸â¶ï¸ð¼ð½ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦

// ð¿ FETCH TREE TREE ð³ð³ð³ð³ð³ð³ð³ð³ð³ð³ð³ð³ð³
fetch("/projectsTree")
  .then(response => response.json())
  .then(items => {
    const root = document.querySelector("#tree");
    generateTree(items, root);
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
// ð¦

// ð¿ Generate Html ð¥ï¸ð¥ï¸ð¥ï¸ð¥ï¸ð¥ï¸ð¥ï¸ð¥ï¸ð¥ï¸ð¥ï¸ð¥ï¸ð¥ï¸ð¥ï¸ð¥ï¸ð¥ï¸ HTML
function generateTree(node, parentElement) {
  let html = '';
  if (node.path === './projects/') {
    node.name = 'Projects root folder';
  }
  if (node.type === 'folder') {
    let deleteAndRename = `
      <span class="emoji" id="delete-${node.path}">â ï¸</span>
      <span class="emoji" id="rename-${node.path}">âï¸</span>
    `;
    if (node.path === './projects/') {
      deleteAndRename = '';
    }
    html = `
      <div id="folder-${node.path}" class="folder-area">
        <span class="folder-span">${node.name}</span>
        <span class="folder-span">${node.sizeStr}</span>
        <span class="emoji">â</span>
        ${deleteAndRename}
      </div>
    `;
    const folderElement = document.createElement('ul');
    folderElement.classList.add('folder');
    folderElement.innerHTML = html;
    parentElement.appendChild(folderElement);

    const childrenElement = document.createElement('li');
    childrenElement.classList.add('children');
    folderElement.appendChild(childrenElement);

    node.children.forEach(childNode => {
      generateTree(childNode, childrenElement);
    });
  } else if (node.type === 'file') {
    html = `
      <div id="file-${node.path}" class="file-area">
        <span class="file-span">${node.name}</span>
        <span class="file-span">${node.sizeStr}</span>
        <span class="emoji">â ï¸</span>
        <span class="emoji">âï¸</span>
      </div>
    `;
    const fileElement = document.createElement('ul');
    fileElement.classList.add('file');
    fileElement.innerHTML = html;
    parentElement.appendChild(fileElement);
  }
}
// ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦

// ð¿ File click fetch content ððððððððððððð
document.getElementById('tree').addEventListener('click', function(event) {
  if (event.target.matches('.file-span')) {
    setupFileSpans(event);
  }
});

// window.addEventListener('load', function () {
  function setupFileSpans(event) {
    const fileSpans = document.getElementsByClassName("file-span");
    Array.from(fileSpans).forEach(fileSpan => {
      fileSpan.addEventListener('click', () => {
        if (event.target.classList.contains('file-span')) {
         const path = event.target.parentNode.id.split('-')[1].slice(11);
         displayFile(path);
         document.getElementById("FilesBtn").click();
        }
      });
    });
  }
// });

// ðððððððððððððððððððððð
const displayFile = (path) => {
  // Check if the file content div has already been created
  let recentlyOpenedFiles = [];
  const fileName = path.split(".")[0];
  const fileExtension = path.split(".")[1];
  const fileContentDivId = `${fileName}${fileExtension}`;
  const fileContentDiv = document.getElementById(fileContentDivId);
  if (fileContentDiv) {
    // If the file content div already exists, make it visible
    const allFileContentDivs = document.querySelectorAll(".fileContentDiv");
    allFileContentDivs.forEach(div => {
      div.style.display = "none";
    });
    fileContentDiv.style.display = "block";
    return;
  } else if (!fileContentDiv) {
    // If the file content div does not exist, send the fetch request
    fetch(`/file-contents/projects/${path}`).then(response => response.json()).then(data => {
      const fileContent = data.content;

      const fileNameButton = document.createElement("button");
      fileNameButton.className = 'fileNameButton';
      fileNameButton.innerHTML = `${fileName} <i class="fas fa-times"></i>`;
      fileNameButton.addEventListener("click", () => {
        const fileContentDiv = document.getElementById(fileContentDivId);
        fileContentDiv.remove();
        fileNameButton.remove();
        // Remove the file name from the recently opened files array
        const fileNameIndex = recentlyOpenedFiles.indexOf(`${fileName}.${fileExtension}`);
        if (fileNameIndex !== -1) {
          recentlyOpenedFiles.splice(fileNameIndex, 1);
        }
      });
      fileNameButton.addEventListener("click", () => {
        displayFile(path);
      });

      let newFileContentDiv = document.createElement("div");
      newFileContentDiv.className = 'fileContentDiv';
      newFileContentDiv.id = fileContentDivId;

      const fileNameButtonsDiv = document.querySelector("#fileNameButtonsDiv");
      fileNameButtonsDiv.appendChild(fileNameButton);

      const OpenedFiles = document.querySelector("#OpenedFiles");
      OpenedFiles.appendChild(newFileContentDiv);
});
}

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
      }
      const editor = CodeMirror(newFileContentDiv, {
        value: fileContent,
        mode: mode,
        lineNumbers: true,
        indentUnit: 2,
        theme: "dracula",
        autofocus: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        keyMap: "default"
      });

      // Store the file name in the recently opened array
      let recentlyOpened = JSON.parse(localStorage.getItem("recentlyOpened")) || [];
      if (!recentlyOpened.includes(fileName)) {
        recentlyOpened.push(fileName);
      }
      if (recentlyOpened.length > 5) {
        recentlyOpened.shift();
      }
      localStorage.setItem("recentlyOpened", JSON.stringify(recentlyOpened));
    }).catch(error => console.error(error));
  }
};
// On page load, display the recently opened files
window.addEventListener("load", () => {
  const recentlyOpenedFiles = JSON.parse(localStorage.getItem("recentlyOpened")) || [];
  recentlyOpenedFiles.forEach(file => displayFile(file));
});
// END OF FILES ðððððððððð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦
// ð¦ðð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦

// ð¿ Folder click function ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸
document.getElementById('tree').addEventListener('click', function(event) {
  if (event.target.matches('.folder-span')) {
    toggleFolderDisplay(event);
  }
});
// ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸ðï¸
function toggleFolderDisplay(event) {
  event.stopPropagation();
  const folder = event.target.closest('.folder');
  const children = folder.querySelector('.children');
  children.style.display = children.style.display === 'none' ? 'block' : 'none';
}

// ð¿ HANDLE EMOJI CLICK âï¸âï¸âï¸âï¸âââââ ï¸â ï¸â ï¸â ï¸
document.getElementById('tree').addEventListener('click', function(event) {
  if (event.target.matches('.emoji')) {
    handleEmojiClick(event);
  }
});
function handleEmojiClick(event) {
  event.stopPropagation();
  const id = event.target.parentNode.id;
  const type = id.split("-")[0];
  const path = id.split("-")[1];
  console.log(`Type: ${type}, Path: ${path}`);
  handleEmojiAction(event, type, path);
}
// ð¦

// ð¿Handle emoji click. ââï¸â ï¸ââï¸â ï¸ââï¸â ï¸ââï¸â ï¸ââï¸â ï¸
function handleEmojiAction(event, type, path) {
    const daddy = event.target.parentNode;
    const granDaddy = event.target.parentNode.parentNode;
  // âââââââââââââââ
  if (type === 'add') {
  //  toggleFolderDisplay(event);
  const parentContainer = event.target.closest('.children');

  if (!parentContainer.querySelector('.addInput')) {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.className = 'addInput';
    input.placeholder = "add file or a folder";
    input.style.display = 'block';
    input.style.visibility = 'visible';
    input.focus();
    granDaddy.querySelector('.children').appendChild(input);

    input.addEventListener('blur', function () {
      const inputValue = input.value;
      if (inputValue) {
        // Submit the input value to the server
        // Code to send inputValue to the server
      }
      // Remove the input element from the DOM
      input.remove();
    });
  }
}
  // â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸â ï¸
  else if (type === 'delete') {
  console.log(path);
  const confirm = window.confirm(`Are you sure you want to delete ${path} ?`);
  if (confirm) {
    // send delete request to server
    fetch(`/delete/${path.slice(2)}`, {
      method: 'DELETE'
    }).then(res => {
      console.log('Response:', res);
      return res.json();
    }).then(data => {
      console.log('Response data:', data);
      console.log('Delete request sent successfully');
    }).catch(error => {
      console.error('Error in sending delete request: ', error);
    });
  }
}
  // âï¸âï¸âï¸âï¸âï¸âï¸âï¸âï¸âï¸âï¸âï¸âï¸âï¸âï¸âï¸âï¸âï¸
  else if (type === 'rename') {
  console.log(daddy);
  const nameSpan = daddy.querySelector('.file-span:first-child');
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.value = nameSpan.textContent;
  nameSpan.replaceWith(input);
  input.focus();
  input.addEventListener('blur', async function () {
    const oldPath = event.target.getAttribute('id').replace('rename-', '').substr(2);
    const folderPath = oldPath.substring(0, oldPath.lastIndexOf('/') + 1);
    const oldName = oldPath.substring(oldPath.lastIndexOf('/') + 1);
    const newName = input.value;
    const newPath = folderPath + newName;
    console.log(JSON.stringify({ oldPath, newName }));
    try {
      const response = await fetch(`/rename`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPath, newName })
      });
      const result = await response.json();
      if (result.success) {
        // update client-side file tree
        nameSpan.textContent = newName;
        input.replaceWith(nameSpan);
      } else {
        // show error message
        alert('old path is null');
      }
    } catch (error) {
      console.error(error);
    }
  });
}
}
// ð¦



