// console.log("pageButtons.js");
document.getElementById("FileManager").style.display ="block";
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
  document.getElementById("FileManager"),
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
// ð¦ð¦ð¦ð¦ð¦ð¦ð¦â¸ï¸â¹ï¸âºï¸â¶ï¸ð¼ð½ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦ð¦
