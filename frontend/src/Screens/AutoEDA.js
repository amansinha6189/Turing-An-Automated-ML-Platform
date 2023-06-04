import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AutoEDA({file_path}) {
  const [html, setHtml] = useState(null);

  const handleClick = () => {
    try{
      const response = axios.get('http://127.0.0.1:8000/api/autoEDA/');
      console.log(response)
  }catch(error){
    console.log(error);
  }
    }
  // useEffect(() => {
  //   const getHtml = async () => {
  //     const response = await axios.get("http://127.0.0.1:8000/api/autoEDA/");
  //     setHtml(response.data.html);
  //     console.log(response.data.html);
  //   };
  //   getHtml();

  //   // const newWindow = window.open();
  //   // newWindow.document.write(html);
  // }, [file_path]);


  return (
    <div>
     <button onClick={handleClick}>
      Go to My Page
    </button>
    </div>
  )
}

export default AutoEDA
