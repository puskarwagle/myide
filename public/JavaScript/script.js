//import CodeMirror from 'codemirror';
// console.log("script.js");

// 🗿 FETCH TREE TREE 🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳
fetch("/guuTree")
  .then(response => response.json())
  .then(items => {
    // console.log(items);
    // console.log(`fetch /guuTree ${JSON.stringify(items)}`);
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
  if (node.path === './guu/') {
    node.name = 'Guu root folder';
  }
  if (node.type === 'folder') {
    let deleteAndRename = `
      <span class="emoji fodel" id="delete-${node.path}">☠️</span>
      <span class="emoji foren" id="rename-${node.path}">✏️</span>
    `;
    if (node.path === './guu') {
      deleteAndRename = '';
    }
    html = `
      <div id="folder-${node.path}" class="folder-area">
        <span class="folder-span foname">${node.name}</span>
        <span class="folder-span">${node.sizeStr}</span>
        <span class="emoji foadd" id="add-${node.path}">➕</span>
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
        <span class="file-span finame" tabindex="0">${node.name}</span>
        <span class="file-span" tabindex="0">${node.sizeStr}</span>
        <span class="emoji fidel" id="delete-${node.path}">☠️</span>
        <span class="emoji firen" id="rename-${node.path}">✏️</span>
      </div>
    `;
    const fileElement = document.createElement('ul');
    fileElement.classList.add('file');
    fileElement.innerHTML = html;
    parentElement.appendChild(fileElement);
  }
  let firstFolder = document.querySelector(".folder:first-of-type");
  const firstchildren = firstFolder.querySelector(".children");
  firstchildren.style.display = 'block';
}


// 🗿 Event click function SETUP FOLDER 🗄️🗄️
document.getElementById('tree').addEventListener('click', function(event) {
  if (event.target.matches('.folder-span')) {
    toggleFolderDisplay(event);
  }
});
// 🗿 Toggle folder 🗄️🗄️
function toggleFolderDisplay(event) {
  event.stopPropagation();
  const folder = event.target.closest('.folder');
  const children = folder.querySelector('.children');
  children.style.display = children.style.display === 'none' ? 'block' : 'none';
}

