// console.log("pageButtons.js");
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
}); 
// 🦟🦟🦟🦟🦟🦟🦟⏸️⏹️⏺️▶️🔼🔽🦟🦟🦟🦟🦟🦟🦟🦟🦟🦟
