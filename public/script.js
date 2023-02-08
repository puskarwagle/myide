
document.getElementById("ListOfFilesNFolders").style.display ="block";
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

// 🗿 Generate Html 🖥️🖥️🖥️🖥️🖥️🖥️🖥️🖥️ HTML
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
      deleteAndRename = 'k';
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

// 🗿 File click fetch content 📑📑📑📑📑📑📑📑📑📑📑📑📑
//const path = event.target.parentNode.id.split('/');
document.getElementById('tree').addEventListener('click', function(event) {
  if (event.target.matches('.file-span')) {
    setupFileSpans(event);
  }
});
function setupFileSpans() {
  const fileSpans = document.getElementsByClassName("file-span");
  Array.from(fileSpans).forEach(fileSpan => {
    fileSpan.addEventListener('click', () => {
      if (event.target.classList.contains('file-span')) {
       const path = event.target.parentNode.id.split('-')[1].slice(11);
       // const path = event.target.parentNode.id.split('-')[1];
       console.log(path);
       displayFile(path);
      }
    });
  });
}
const displayFile = (path) => {
  fetch(`/file-contents/projects/${path}`)
  .then(response => response.json())
  .then(data => {
    const fileContent = data.content;
    document.querySelector('#OpenedFiles').innerHTML = fileContent;
  }).catch(error => console.error(error));
};
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

// 🗿 HANDLE EMOJI CLICK ✏️☠️➕✏️☠️➕✏️☠️➕✏️☠️➕
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



