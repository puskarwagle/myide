//import CodeMirror from 'codemirror';

document.getElementById("ListOfFilesNFolders").style.display ="block";
document.getElementById("OpenedFiles").style.display ="none";
document.getElementById("LocalHost").style.display ="none";
document.getElementById("Terminal").style.display ="none";
// 🗿TERMINAL+FILE MANAGER+FILES+BROWSER BUTTONS
// ⏸️⏹️⏺️▶️🔼🔽⏸️⏹️⏺️▶️🔼🔽⏸️⏹️⏺️▶️🔼🔽⏸️⏹️⏺️▶️🔼🔽
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
}); // 🦟🦟🦟🦟🦟🦟🦟⏸️⏹️⏺️▶️🔼🔽🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟

// 🗿 FETCH TREE TREE 🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳
fetch("/projectsTree")
  .then(response => response.json())
  .then(items => {
    const root = document.querySelector("#tree");
    generateTree(items, root);
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
// 🦟

// 🗿 Generate Html 🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️ HTML
function generateTree(node, parentElement) {
  let html = '';
  if (node.path === './projects/') {
    node.name = 'Projects root folder';
  }
  if (node.type === 'folder') {
    let deleteAndRename = `
      <span class="emoji" id="delete-${node.path}">☠️</span>
      <span class="emoji" id="rename-${node.path}">✏️</span>
    `;
    if (node.path === './projects/') {
      deleteAndRename = '';
    }
    html = `
      <div id="folder-${node.path}" class="folder-area">
        <span class="folder-span">${node.name}</span>
        <span class="folder-span">${node.sizeStr}</span>
        <span class="emoji">➕</span>
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
        <span class="emoji">☠️</span>
        <span class="emoji">✏️</span>
      </div>
    `;
    const fileElement = document.createElement('ul');
    fileElement.classList.add('file');
    fileElement.innerHTML = html;
    parentElement.appendChild(fileElement);
  }
}
// 🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟
// 📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑📑
// 🗿 File click fetch content 📑📑📑📑📑📑📑📑📑📑📑📑📑
document.getElementById('tree').addEventListener('click', function(event) {
  if (event.target.matches('.file-span')) {
    setupFileSpans(event);
  }
});
function setupFileSpans(event) {
  const fileSpans = document.getElementsByClassName("file-span");
  Array.from(fileSpans).forEach(fileSpan => {
    fileSpan.addEventListener('click', () => {
      if (fileSpan.classList.contains('file-span')) {
        const path = fileSpan.parentNode.id.split('-')[1].slice(11);
        displayFile(path);
        document.getElementById("FilesBtn").click();
      }
    });
  });
}
// DISPLAY FILE 📑
const recentlyOpened = [];
const maxFiles = 5;
// Function to fetch file content
const displayFile = (path) => {
  console.log(path);
  return fetch(`/file-contents/projects/${path}`).then(response => response.json()).then(data => {
    const fileContent = data.content;
    console.log('data.content');
    createAndFillElements(path, fileContent);
  });
};
// Function to create and fill HTML elements dynamically
const createAndFillElements = (path, fileContent) => {
  console.log('create and fill elements func called')
  // Get the filename from the path
  const fileName = path.substring(path.lastIndexOf("/") + 1);
  // Check if the file path exists in the recently opened array
  let index = recentlyOpened.indexOf(path);
  if (index === -1) {
    // If it doesn't, add it to the recently opened array
    recentlyOpened.unshift(path);
    index = 0;
    // Remove the oldest file from the array if there are more than maxFiles in the recently opened array
    if (recentlyOpened.length > maxFiles) {
      recentlyOpened.pop();
    }
  } else {
    // If it does, move it to the front of the recently opened array
    recentlyOpened.splice(index, 1);
    recentlyOpened.unshift(path);
  }
  // Check if the FileButtons div exists
  let fileButtons = document.getElementById("FileButtons");
  if (!fileButtons) {
    // If it doesn't, create it
    fileButtons = document.createElement("div");
    fileButtons.id = 'FileButtons';
  }
  // Create the "fileBtn-${fileName}" div
  const fileBtn = document.createElement("div");
  fileBtn.id = `fileBtn-${fileName}`;
  fileButtons.appendChild(fileBtn);
  const openBtn = document.createElement("button");
  openBtn.innerHTML = "Open";
  openBtn.id = `openBtn-${fileName}`;
  fileBtn.appendChild(openBtn);
  // Add a click event listener to the openBtn
  openBtn.addEventListener("click", () => {
    displayFile(path);
  });
  // Check if the FileContents div exists
  let fileContents = document.getElementById("FileContents");
  if (!fileContents) {
    // If it doesn't, create it
    fileContents = document.createElement("div");
    fileContents.id = 'FileContents';
  }
  // Create the "fileContent-${fileName}" div
  const fileContentDiv = document.createElement("div");
  fileContentDiv.id = `fileContent-${fileName}`;
  fileContents.appendChild(fileContentDiv);
  // Create the file title
  const fileTitle = document.createElement("h2");
  fileTitle.innerHTML = fileName;
  fileContentDiv.appendChild(fileTitle);
  // Create the file content
  const content = document.createElement("p");
  content.innerHTML = fileContent;
  fileContentDiv.appendChild(content);
  // Append the FileButtons and FileContents divs to the body
  document.body.appendChild(fileButtons);
  document.body.appendChild(fileContents);
  // Show the file content for the currently selected file
  document.getElementById(`fileContent-${fileName}`).style.display = "block";
  // Hide the contents of all other files
  for (let i = 0; i < recentlyOpened.length; i++) {
    if (recentlyOpened[i] !== path) {
      document.getElementById(`fileContent-${recentlyOpened[i].substring(recentlyOpened[i].lastIndexOf("/") + 1)}`).style.display = "none";
    }
  }
};
// END OF FILES 📑📑📑📑📑📑📑📑📑🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟
// 🦟📑🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟

// 🗿 Folder click function 🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️
document.getElementById('tree').addEventListener('click', function(event) {
  if (event.target.matches('.folder-span')) {
    toggleFolderDisplay(event);
  }
});
// 🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️🗂️
function toggleFolderDisplay(event) {
  event.stopPropagation();
  const folder = event.target.closest('.folder');
  const children = folder.querySelector('.children');
  children.style.display = children.style.display === 'none' ? 'block' : 'none';
}

// 🗿 HANDLE EMOJI CLICK ✏️✏️✏️✏️➕➕➕➕☠️☠️☠️☠️
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
// 🦟

// 🗿Handle emoji click. ➕✏️☠️➕✏️☠️➕✏️☠️➕✏️☠️➕✏️☠️
function handleEmojiAction(event, type, path) {
    const daddy = event.target.parentNode;
    const granDaddy = event.target.parentNode.parentNode;
  // ➕➕➕➕➕➕➕➕➕➕➕➕➕➕➕
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
  // ☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️
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
  // ✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️
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
// 🦟
