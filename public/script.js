
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
document.querySelector('#tree').addEventListener('click', function(event) {
  if (event.target.matches('.folder-span')) {
    event.stopPropagation();
    const folder = event.target.closest('.folder');
    const children = folder.querySelector('.children');
    children.style.display = children.style.display === 'none' ? 'block' : 'none';
  }
    if (event.target.matches('.emoji')) {
    event.stopPropagation();
    const id = event.target.id;
    const type = id.split("-")[0];
    const path = id.split("-")[1];
    console.log(`Type: ${type}, Path: ${path}`);
    handleEmojiAction(event, type, path);
  }
});
// 🦟


// 🗿Handle emoji click.
function handleEmojiAction(event, type, path) {
    const daddy = event.target.parentNode;
    const granDaddy = event.target.parentNode.parentNode;
    console.log(daddy, granDaddy);

  if (type === 'add') {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.className = 'hgg';
    granDaddy.querySelector('.children').appendChild(input);
  } 
  else if (type === 'delete') {
    const confirm = window.confirm(`Are you sure you want to delete ?`);
    if (confirm) {
      // send delete request to server
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




