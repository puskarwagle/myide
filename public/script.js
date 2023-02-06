
document.getElementById("ListOfFilesNFolders").style.display ="block";
// 🗿
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
}); // 🦟

// 🗿 FETCH TREE TREE
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

// 🗿 Generate Html
function generateTree(node, parentElement) {
  let html = '';
  if (node.path === './projects/') {
    node.name = 'Projects root folder';
  }
  if (node.type === 'folder') {
    html = `
      <div class="folder-area">
        <span class="folder-span">${node.name}</span>
        <span class="folder-span">${node.sizeStr}</span>
        <span class="emoji" id="add-${node.path}">➕</span>
        <span class="emoji" id="delete-${node.path}">☠️</span>
        <span class="emoji" id="rename-${node.path}">✏️</span>
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
      <div class="file-area">
        <span class="file-span">${node.name}</span>
        <span class="file-span">${node.sizeStr}</span>
        <span class="emoji" id="delete-${node.path}">☠️</span>
        <span class="emoji" id="rename-${node.path}">✏️</span>
      </div>
    `;
    const fileElement = document.createElement('ul');
    fileElement.classList.add('file');
    fileElement.innerHTML = html;
    parentElement.appendChild(fileElement);
  }
}
// 🦟


// 🗿 Folder click function
document.getElementById('tree').addEventListener('click', function(event) {
  if (event.target.matches('.folder-span')) {
    toggleFolderDisplay(event);
  }
});
document.getElementById('tree').addEventListener('click', function(event) {
  if (event.target.matches('.emoji')) {
    handleEmojiClick(event);
  }
});
function toggleFolderDisplay(event) {
  event.stopPropagation();
  const folder = event.target.closest('.folder');
  const children = folder.querySelector('.children');
  children.style.display = children.style.display === 'none' ? 'block' : 'none';
}
function handleEmojiClick(event) {
  event.stopPropagation();
  const id = event.target.id;
  const type = id.split("-")[0];
  const path = id.split("-")[1];
  console.log(`Type: ${type}, Path: ${path}`);
  handleEmojiAction(event, type, path);
}

// 🦟


// 🗿Handle emoji click.
function handleEmojiAction(event, type, path) {
    const daddy = event.target.parentNode;
    const granDaddy = event.target.parentNode.parentNode;
    console.log(daddy, granDaddy);

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

    // Append the input to the DOM
    granDaddy.querySelector('.children').appendChild(input);

    // Handle the blur event for the input
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
  else if (type === 'delete') {
  const confirm = window.confirm(`Are you sure you want to delete ${path} ?`);
  if (confirm) {
    // send delete request to server
    fetch(`/delete/${path}`, {
      method: 'DELETE'
    }).then(res => res.json()).then(data => {
      console.log('Delete request sent successfully');
    }).catch(error => {
      console.error(error);
    });
  }
}
  else if (type === 'rename') {
    const nameSpan = daddy.querySelector('.file-span:first-child');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.value = nameSpan.textContent;
    nameSpan.replaceWith(input);
    input.focus();
    input.addEventListener('blur', function () {
      const newName = input.value;
      nameSpan.textContent = newName;
      input.replaceWith(nameSpan);
      // send rename request to server with newName and path
    });
  }
}

// 🦟



