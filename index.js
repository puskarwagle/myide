const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
const PORT = process.env.PORT || 5000;

// 1.🗿 Check if ./guu exists ! CREATE PROJECTS 🗂️🗂️🗂️🗂️🗂️🗂️
const directoryPath = './guu';
fs.stat(directoryPath, (err, stats) => {
  if (err) {
    if (err.code === 'ENOENT') {
      fs.mkdir(directoryPath, (mkdirError) => {
        if (mkdirError) {
          console.error('Error creating directory: ', mkdirError);
        } else {
          console.log(`Directory "${directoryPath}" created successfully`);
        }
      });
    } else {
      console.error('Error checking directory existence: ', err);
    }
  } else {
    // console.log(`Directory "${directoryPath}" already exists`);
  }
});

// 2.🗿 Build directory tree 🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳
function buildDirectoryTree(path) {
  const stats = fs.lstatSync(path);
  const info = {
    path,
    name: path.split("/").pop()
  };
  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(path).map(child => {
      return buildDirectoryTree(path + "/" + child);
    });
  } else {
    info.type = "file";
  }
  return info;
}

// 3🗿Calculate folder size in bytes 🌳🌳🌳🌳
const calculateFolderSize = folderPath => {
  let size = 0;
  fs.readdirSync(folderPath).forEach(file => {
    let filePath = path.join(folderPath, file);
    let stat = fs.statSync(filePath);
    if (stat.isFile()) {
      size += stat.size;
    } else if (stat.isDirectory()) {
      size += calculateFolderSize(filePath);
    }
  });
  return size;
};

// 4.🗿Convert sizes 🌳🌳🌳🌳
const sizeConversion = size => {
  if (isNaN(size) || size <= 0) {
    return "0 B";
  } else if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
};

// 5.🗿Send tree with size to client 🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳
app.get("/guuTree", (req, res) => {
  const tree = buildDirectoryTree(directoryPath);
  const calculateNodeSize = node => {
    if (node.type === "file") {
      node.size = fs.statSync(node.path).size;
    } else if (node.type === "folder") {
      node.size = calculateFolderSize(node.path);
      node.children.forEach(calculateNodeSize);
    }
    node.sizeStr = sizeConversion(node.size);
  };
  calculateNodeSize(tree);
  res.send(tree);
});

// 6.🗿Send file content to client 📑📑📑📑📑📑📑📑📑📑📑📑📑📑
app.get('/fileContent-:path', (req, res) => {
  console.log('received file content fetch request');
  const filePath = req.params.path;
  console.log(filePath)
  fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) {
      console.error('Error reading file: ', err);
      res.status(500).send({ error: 'Error reading file' });
      return;
    }
    res.json({ content });
  });
});
// 🦟


app.delete('/server/folder/delete', async (req, res) => {
  try {
    const { folderPath } = req.body;
    await fs.promises.rmdir(folderPath, { recursive: true });
    res.json({ message: 'Folder deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the folder.' });
  }
});


// 🗿 DELETE A FILE ☠️ 🗿 DELETE A FILE ☠️
app.delete('/server/file/delete', async (req, res) => {
  try {
    const { filePath } = req.body;
    await fs.promises.unlink(filePath);
    res.json({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the file.' });
  }
});
// 🦟

// 9.🗿RENAME FETCH ✏️✏️✏️✏️✏️✏️✏️✏️
app.post('/rename', (req, res) => {
  console.log("Received request to rename file/folder:");
  if (!req.body || !req.body.oldPath || !req.body.newName) {
    res.status(400).send({
      error: 'Bad request, missing oldPath or newName property in the request body'
    });
    return;
  }
  const oldPath = req.body.oldPath;
  const newName = req.body.newName;
  const newPath = path.join(path.dirname(oldPath), newName);
  console.log("New Path: ", newPath);
  console.log("Old Path: ", oldPath);
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error("Error renaming file/folder: ", err);
      res.status(500).send({
        error: 'Error renaming file or folder'
      });
      return;
    }
    console.log("File/folder renamed successfully")
    res.send({
      success: 'File or folder renamed successfully'
    });
  });
});
// 🦟

// 10. 🔘🔘🔘
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
