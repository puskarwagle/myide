const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

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

const getFileDetails = (itemPath, item, parentPath = "") => {
  let size = 0;
  let isDirectory = false;

  try {
    const stats = fs.statSync(itemPath);
    size = stats.size;
    isDirectory = stats.isDirectory();
  } catch (error) {
    console.error(`Error getting file details for ${itemPath}: ${error}`);
    return;
  }

  if (!isDirectory) {
    const extension = path.extname(itemPath);
    let contents;

    try {
      contents = fs.readFileSync(itemPath, "utf8");
    } catch (error) {
      console.error(`Error reading file ${itemPath}:${error}`);
      contents = "";
    }

    return {
      name: item,
      size: sizeConversion(size),
      type: extension,
      parent: parentPath,
      contents: contents
    };
  } else {
    let children = [];

    try {
      children = fs.readdirSync(itemPath);
      children = children.map(child =>
        getFileDetails(path.join(itemPath, child), child, item)
      );
    } catch (error) {
      console.error(`Error reading directory ${itemPath}: ${error}`);
    }

    return {
      name: item,
      size: sizeConversion(size),
      type: "folder",
      parent: parentPath,
      children: children
    };
  }
};

app.get("/:filePath(*)", (req, res) => {
  const filePath = decodeURI(req.params.filePath);
  const basePath = process.cwd();
  const fullPath = path.join(basePath, "projects", filePath);
  let fileDetails;

  try {
    fileDetails = getFileDetails(fullPath, path.basename(fullPath));
  } catch (error) {
    console.error(`Error getting file details for ${fullPath}: ${error}`);
    return res.status(400).send({ error: `Invalid file path ${filePath}` });
  }

  res.send(fileDetails);
});

app.listen(3008, () => {
   console.log("File explorer server is running on port 3008");
}); 