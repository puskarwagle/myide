const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 5000;

// 🗿 Check if ./projects exists if not create it
const directoryPath = './projects';
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
    console.log(`Directory "${directoryPath}" already exists`);
  }
});

// 🗿 Build directory tree
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

// 🗿Calculate folder size in bytes
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

// 🗿Convert sizes
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

// 🗿Send tree with size to client
app.get("/projectsTree", (req, res) => {
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

// 🗿ADD FETCH

// 🦟

// 🗿DELETE FETCH 🗿
 app.delete('/delete/:path', (req, res) => {
  console.log("Deleting file or directory at path:", req.params.path);
  const filePath = req.params.path;
  const absolutePath = path.resolve(__dirname, filePath);
  fs.stat(absolutePath, (err, stats) => {
    console.log("Checking if file exists at path:", absolutePath);
    if (err) {
      console.log("Error while checking file existence:", err.message);
      return res.status(500).json({
        error: err.message
      });
    }
    if (stats.isFile()) {
      console.log("Deleting file:", absolutePath);
      fs.unlink(absolutePath, (err) => {
        if (err) {
          console.log("Error while deleting file:", err.message);
          return res.status(500).json({
            error: err.message
          });
        }
        console.log("File deleted successfully at path:", absolutePath);
        return res.json({
          message: 'File deleted successfully'
        });
      });
    } else if (stats.isDirectory()) {
      console.log("Deleting directory:", absolutePath);
      deleteFolderRecursive(absolutePath);
      console.log("Directory deleted successfully at path:", absolutePath);
      return res.json({
        message: 'Directory deleted successfully'
      });
    } else {
      console.log("Path is not a file or directory:", absolutePath);
      return res.status(400).json({
        error: 'Path is not a file or directory'
      });
    }
  });
});
// 🗿DELETE FOLDER RECURSIVELY FOR FETCH  🗿
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(file => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}
// 🦟

// 🗿RENAME FETCH

// 🦟

// 🔘
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});