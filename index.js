const express = require("express");
const fs = require("fs");
const fsPromises = require('fs').promises; 
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
app.get('/fileContent-:path', async (req, res) => {
  try {
    console.log('received file content fetch request');
    const filePath = req.params.path;
    console.log(filePath);
    const content = await fsPromises.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file: ', error);
    res.status(500).send({ error: 'Error reading file' });
  }
});
// 🦟

// 🗿 DELETE A FOLDER ☠️ 🗿 DELETE A FOLDER ☠️
app.delete('/server/folder/delete', async (req, res) => {
  try {
    const { folderPath } = req.body;
    await fsPromises.rmdir(folderPath, { recursive: true });
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
    await fsPromises.unlink(filePath);
    res.json({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the file.' });
  }
});
// 🦟

// 9.🗿RENAME FETCH folderPath ✏️✏️✏️✏️✏️✏️✏️✏️
app.put('/server/folder/rename', async (req, res) => {
  try {
    const { folderPath, newFolderName } = req.body;
    const pathArray = folderPath.split("/");
    const oldFolderName = pathArray.pop();
    pathArray.push(newFolderName);
    const newFolderPath = pathArray.join("/");
    await fsPromises.rename(folderPath, newFolderPath);
    res.json({ message: 'Folder renamed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while renaming the folder.' });
  }
});
// 🦟

// 9.🗿RENAME FETCH filePath ✏️✏️✏️✏️✏️✏️✏️✏️
app.put('/server/file/rename', (req, res) => {
  const { filePath, newFileName } = req.body;
  const newPath = path.join(path.dirname(filePath), newFileName);
  console.log("filePath: " + filePath);
  console.log("newFileName: " + newFileName);
  console.log("newPath: " + newPath);

  fs.promises.rename(filePath, newPath)
    .then(() => {
      res.send({ message: 'File renamed successfully' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: 'Error renaming file' });
    });
});

// 🗿 ADD A FOLDER/FILE ☠️ 🗿 DELETE A FOLDER/FILE ☠️
app.post('/server/add', (req, res) => {
  const folderPath = req.body.folderPath;
  const newFileFolderName = req.body.newFileFolderName;
  const fullPath = path.join(__dirname, folderPath, newFileFolderName);

  if (path.extname(newFileFolderName) === '') {
    fs.mkdir(fullPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating folder: ', err);
        res.status(500).send({ error: 'Error creating folder' });
        return;
      }
      res.json({ success: true });
    });
  } else {
    fs.writeFile(fullPath, '', (err) => {
      if (err) {
        console.error('Error creating file: ', err);
        res.status(500).send({ error: 'Error creating file' });
        return;
      }
      res.json({ success: true });
    });
  }
});

// 📄 READ FILE 📄 
app.post('/server/file/read', (req, res) => {
  const filePath = req.body.filePath;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file');
    } else {
      res.send(data);
      // console.log(data);
    }
  });
});

// 10. 🔘🔘🔘
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
