import React, { useState } from "react";
import axios from '../../AxiosInstance';
import './FileUploader.css'

export default function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [vocno, setVocno] = useState("");
  const [ttype, setTtype] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleVocnoChange = (event) => {
    setVocno(event.target.value);
  };

  const handleTtypeChange = (event) => {
    setTtype(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("ttype", ttype);
      formData.append("vocno", vocno);
      console.log(formData)
      const response = await axios.post("api/files/upload", formData);
      console.log(response.data)

      alert(response.data);
    } catch (error) {
      alert(error.message);
    }
  };

  const [imageSrc, setImageSrc] = useState('');

  function handleImageLoad() {
    // Replace "somettype" and "somevocno" with actual values
    axios.get(`api/files/read/${ttype}/${vocno}`, { responseType: 'blob' })
      .then(response => {
        const url = URL.createObjectURL(response.data);
        setImageSrc(url);
      })
      .catch(err => alert(err.message))
  }

  return (
    <div className="mainclass">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file-input">Select file to upload:</label>
          <input
            id="file-input"
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="vocno-input">Vocno:</label>
          <input
            id="vocno-input"
            type="text"
            value={vocno}
            onChange={handleVocnoChange}
          />
        </div>
        <div>
          <label htmlFor="ttype-input">Ttype:</label>
          <input
            id="ttype-input"
            type="text"
            value={ttype}
            onChange={handleTtypeChange}
          />
        </div>
        <button type="submit">Upload</button>
      </form>

      <div>
        <button onClick={handleImageLoad}>Load Image</button>
      </div>
      <div>
        {imageSrc && <img src={imageSrc} alt="My Image1" />}
      </div>
    </div>
  );
}

