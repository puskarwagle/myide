
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
    const root = document.querySelector("#ListOfFilesNFolders");
    generateTree(items, root);
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });

// 🗿 Folder click function 
document.querySelector('#ListOfFilesNFolders').addEventListener('click', function(event) {
  if (event.target.matches('.folder p')) {
    const children = event.target.parentElement.querySelector('.children');
    children.style.display = children.style.display === 'none' ? 'block' : 'none';
  }
}); 

// ₱ Generate Html
function generateTree(node, parentElement) {
  if (node.path === './projects/') {
    node.name = 'Projects root folder';
  }
  if (node.type === 'folder') {
    const folderElement = document.createElement('ul');
    folderElement.classList.add('folder');
    folderElement.innerHTML = `<p>${node.name}</p>`;
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
    fileElement.innerHTML = node.name;
    parentElement.appendChild(fileElement);
  }
}
// 🦟