import React, {useState, useRef, useCallback} from 'react';
import './index.css';

const App = () => {
  const [files, setFiles] = useState([]);
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (newFiles) => {
    const combinedFiles = [...files, ...newFiles].slice(0, 2);
    setFiles(combinedFiles);
  };

  const handleDragOver = (event) => event.preventDefault();
  const handleDrop = (event) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    handleFiles(newFiles);
  };

  const handleFileSelect = (event) => {
    const newFiles = Array.from(event.target.files);
    handleFiles(newFiles);
  };


const handleUpload = async () => {
  if (files.length === 0) return;
  setLoading(true);

  const formData = new FormData();
  files.forEach(f => formData.append('attachments', f));
  if (process.env.REACT_APP_API_URL) {
    console.log("Endpoint set")
  } else{
    console.log("NO endpoint detected")
  }
  if (formData) {
    console.log("formData set")
  } else{
    console.log("NO formData")
  }

  try {
    const res = await fetch(
      "https://bestbrain.tech/docai/inv/",
      { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Network response was not ok');

    const blob = await res.blob();
    // Dateiname aus Content-Disposition lesen (Backend muss ihn setzen)
    const filename = 'invoice_data.csv';

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Upload error:', e);
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="container">
      <div
        className="dropzone"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <p className="dropzone-text-sub">({files.length} von 2 Dateien ausgewählt)</p>
        <p className="dropzone-text-sub">
          Mehr Dateien auf einmal? <br/>
          Andere Datei Formate (in/out)? <br/>
          Weitere Dokumente? <br/>
          Sende uns eine Email an 'office@botworld.cloud'!
        </p>
        <p className="dropzone-text-main">Anleitung</p>
        <p className="dropzone-text-sub">
          - Datei in die DropBox ziehen und auf bestätigen klicken<br/>
          - Das Das Ergebnis landet direkt im Download-Bereich des Browsers<br/>
          - Importieren Sie das csv Dokument in Google Sheets für die Tabellenansicht<br/>
          Fertig!
        </p>
        <p className="dropzone-text-main">PDF Dateien hierher ziehen oder klicken, um auszuwählen</p>

        <p>

        </p>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
      <ul className="file-list">
        {files.map((file, index) => <li key={index}>{file.name}</li>)}
      </ul>
      <button
        onClick={handleUpload}
        disabled={loading || files.length === 0}
        className="upload-btn"
      >
        {loading ? 'Lade...' : 'Upload'}
      </button>

    </div>
  );
};

export default App;