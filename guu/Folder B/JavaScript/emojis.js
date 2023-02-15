
// 1. 🗿 Setup .emoji  click event ✏️✏️✏️✏️➕➕➕➕☠️☠️☠️☠️
document.getElementById('tree').addEventListener('click', function(event) {
  if (event.target.matches('.emoji')) {
    handleEmojiClick(event);
  }
});

// 2. 🗿Handle Emoji click ➕✏️☠️
function handleEmojiClick(event) {
  event.stopPropagation();
  const id = event.target.id;
  const type = id.split("-")[0];
  const path = id.split("-")[1];
  console.log(`2. Type: ${type}, Path: ${path} ℹ️`);
  handleEmojiAction(event, type, path);
}
// 🦟

// 3. 🗿Handle Emoji action ➕✏️☠️
function handleEmojiAction(event, type, path) {
   console.log('3rd function triggered');
    const daddy = event.target.parentNode;
    const granDaddy = event.target.parentNode.parentNode;
    console.log(daddy, granDaddy);
    
 // ➕
  if (type === 'add') {
  const parentContainer = event.target.closest('.children');
  console.log(parentContainer);
  
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
  // ☠️
  else if (type === 'delete') {
  console.log('delete req of ' + path);
  const confirm = window.confirm(`Are you sure you want to delete ${path} ?`);
  if (confirm) {
    fetch(`/delete/${path}`, {
      method: 'DELETE'
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log('Delete request sent successfully');
    }).catch(error => {
      console.error('Error in sending delete request: ', error);
    });
  }
}
  // ✏️
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
