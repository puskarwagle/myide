const express = require("express");
const fs = require("fs");
const fsPromises = require('fs').promises; 
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
const PORT = process.env.PORT || 5000;

// 1.πΏ Check if ./guu exists ! CREATE PROJECTS ποΈποΈποΈποΈποΈποΈ
const directoryPath = './ahhbhan';
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

// 2.πΏ Build directory tree π³π³π³π³π³π³π³π³π³π³
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

// 3πΏCalculate folder size in bytes π³π³π³π³
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

// 4.πΏConvert sizes π³π³π³π³
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

// 5.πΏSend tree with size to client π³π³π³π³π³π³π³π³π³π³
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

// 6.πΏSend file content to client ππππππππππππππ
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
// π¦

// πΏ DELETE A FOLDER β οΈ πΏ DELETE A FOLDER β οΈ
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


// πΏ DELETE A FILE β οΈ πΏ DELETE A FILE β οΈ
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
// π¦

// 9.πΏRENAME FETCH folderPath βοΈβοΈβοΈβοΈβοΈβοΈβοΈβοΈ
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
// π¦

// 9.πΏRENAME FETCH filePath βοΈβοΈβοΈβοΈβοΈβοΈβοΈβοΈ
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

// πΏ ADD A FOLDER/FILE β οΈ πΏ DELETE A FOLDER/FILE β οΈ
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

// π READ FILE π 
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

// π WRITE FILE π 
app.post('/save-file', async (req, res) => {
  const { filePath, textdata } = req.body;
  //console.log(filePath, textdata)
  try {
    await fsPromises.writeFile(filePath, textdata);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// 10. πππ
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
