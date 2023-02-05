import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFolder, FaFile, FaFileImage, FaFileAudio, FaFileVideo } from 'react-icons/fa';

const apiUrl = 'http://localhost:5000'; //receiving data from this server

// 🔘 Getting and setting icons
const getIcon = (size) => {
  if (!size) return null;
  const sizeSuffix = size.slice(-2);
  const sizeNumber = parseFloat(size.slice(0, -2));
  switch (sizeSuffix) {
    case ' KB':
      return <FaFile />;
    case ' B':
      switch (true) {
        case /\.(jpe?g|png|gif)$/.test(size):
          return <FaFileImage />;
        case /\.(mp3|ogg)$/.test(size):
          return <FaFileAudio />;
        case /\.(mp4|avi)$/.test(size):
          return <FaFileVideo />;
        default:
          return <FaFile />;
      }
    default:
      return <FaFile />;
  }
};

const FolderStructure = ({ data }) => {
  const [folderData, setFolderData] = useState(null);
  const [openFolders, setOpenFolders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(apiUrl)
      .then((res) => {
        setLoading(false);
        setFolderData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  }, [apiUrl]);

  const styles = {
    listContainer: {
      backgroundColor: 'lightgray',
      border: '1px solid gray',
      padding: '10px',
      margin: '20px'
    }
  };

  const toggleFolder = (folderPath, openFolders, setOpenFolders) => {
    if (openFolders.includes(folderPath)) {
      setOpenFolders(openFolders.filter(f => f !== folderPath));
    } else {
      setOpenFolders([...openFolders, folderPath]);
    }
  };

  const renderFolder = (item, index) => {
    return (
      <li key={index}>
        <FaFolder />
        {item.name}
        <button onClick={() =>
toggleFolder(item.path, openFolders, setOpenFolders)}>
{openFolders.includes(item.path) ? 'Close' : 'Open'}
</button>
{openFolders.includes(item.path) && (
<ul>
{Object.entries(item.files).map(([fileName, fileDetails], index) => {
return (
<li key={index}>
{getIcon(fileDetails.size)}{fileName}

</li>
);
})}
</ul>
)}
      </li>
    );
  };
if (loading) return <p>Loading...</p>;
if (error) return <p>An error occurred: {error.message}</p>;
if (!folderData) return <p>No data found</p>;

return (
<ul style={styles.listContainer}>
  {Object.entries(folderData).map(([key, value], index) => {
    return renderFolder(value, index);
  })}
</ul>

);
};

export default FolderStructure;
