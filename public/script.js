
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
  if (node.path === './projects/') {
    node.name = 'Projects root folder';
  }
  if (node.type === 'folder') {
    const folderElement = document.createElement('ul');
    folderElement.classList.add('folder');
    folderElement.innerHTML = `<div class="clickable-area"><span>${node.name}</span><span>${node.sizeStr}</span></div>`;
    parentElement.appendChild(folderElement);

    const childrenElement = document.createElement('li');
    childrenElement.classList.add('children');
    folderElement.appendChild(childrenElement);

    node.children.forEach(childNode => {
      generateTree(childNode, childrenElement);
    });
  } else if (node.type === 'file') {
    const fileElement = document.createElement('ul');
    fileElement.classList.add('file');
    fileElement.innerHTML = `<div class="file-area"><span>${node.name}</span><span>${node.sizeStr}</span></div>`;
    parentElement.appendChild(fileElement);
  }
}
// 🦟

// 🗿 Folder click function 
document.querySelector('#tree').addEventListener('click', function(event) {
  console.log(event.target)
  if (event.target.matches('.clickable-area')) {
    event.stopPropagation();
    const folder = event.target.closest('.folder');
    const children = folder.querySelector('.children');
    console.log('Folder: ', folder);
    console.log('Children: ', children);
    if (children) {
      children.style.display = children.style.display === 'none' ? 'block' : 'none';
    }
  } else {
    console.log("Clicked element doesn't match .clickable-area");
  }
});

// 🦟