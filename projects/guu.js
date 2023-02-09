const path = event.target.parentNode.id.split('-')[1].slice(2);
const displayFile = (path) => {
  fetch(`/file-contents/projects/${path}`)
    .then(response => response.json())
    .then(data => {
      const fileContent = data.content;
      const [fileName, fileExtension] = path.split(".");

      const fileNameButton = document.createElement("button");
      fileNameButton.className = 'fileNameButton';
      fileNameButton.innerHTML = `${fileName} X`;

      const fileContentDiv = document.createElement("div");
      fileContentDiv.className = 'fileContentDiv';
      fileContentDiv.id = fileName + fileExtension.charAt(0).toUpperCase() + fileExtension.slice(1);
      
      const OpenedFiles = document.querySelector("#OpenedFiles");
      OpenedFiles.appendChild(fileContentDiv);

      const fileNameButtonsDiv = document.querySelector("#fileNameButtonsDiv");
      fileNameButtonsDiv.appendChild(fileNameButton);

      // Create an instance of CodeMirror and append it to the file content div
      const editor = CodeMirror(fileContentDiv, {
        value: fileContent,
        mode: `text/${fileExtension}`,
        lineNumbers: true
      });
    })
    .catch(error => console.error(error));
};
