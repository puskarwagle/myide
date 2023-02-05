const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 5000;

const directoryPath = './projects/';


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
  console.log(info);
}

app.get("/projectsTree", (req, res) => {
  const tree = buildDirectoryTree(directoryPath);
  console.log('ProjectsTree:', buildDirectoryTree(directoryPath));
  res.send(JSON.stringify(tree, null, 4));
});

app.get('/projects', (req, res) => {
	fs.readdir(directoryPath, (error, files) => {
		if (error) {
			console.error(`An error occurd while reading the directory: ${error}`);
			return;
		}

		let AllFilesNFolder = [];

		const calculateFolderSize = (folderPath) => {
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
		}

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

		for (let i = 0; i < files.length; i++) {
			let file = files[i];
			let filePath = path.join(directoryPath, file);
			let stat = fs.statSync(filePath);
			let type = stat.isFile() ? "file" : "folder";
			let size = stat.isFile() ? stat.size : calculateFolderSize(filePath);
			AllFilesNFolder.push({
				name: file,
				type: type,
				sizeStr: sizeConversion(size)
			});
		}
		res.json(AllFilesNFolder);
	});
});



// 🔘
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});