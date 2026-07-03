import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatusGrid: React.FC = () => {
  const [urls, setUrls] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try{
        const response = await axios.get('http://localhost:5000/api/urls');
        setUrls(response.data.urls);
      } catch(err: any){
        console.error("Failed to fetch URLs", err);
      }
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);

    return () => clearInterval(interval);
  }, [])

  const handleDelete = async (url: string) => {
    try{
      await axios.delete("http://localhost:5000/api/urls")
      //Refresh
      const response = await axios.get("http://localhost:5000/api/urls");
      setUrls(response.data.urls);
    } catch(err: any){
      console.error("Failed to delete URL", err)
    }
  }

  const statusCardStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "12px",
    margin: "10px",
    width: "250px",
    display: "inline-block",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  };

  return(
    <div>
      {urls.map((item) => (
        <div key={item.url} style={statusCardStyle}>
          <h3>{item.url}</h3>
          <p style={{ color: item.status === "UP" ? "green" : "red" }}>
            {item.status}
          </p>
          <p>{item.time} ms</p>
          <button onClick={() => handleDelete(item.url)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default StatusGrid;