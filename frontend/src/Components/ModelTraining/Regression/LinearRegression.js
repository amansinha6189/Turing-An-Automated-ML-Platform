import React, { useState } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap';

function LinearRegression() {
    const LinearRegressionCall = async event => {
        event.preventDefault();
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/handleLinearRegression/');
            console.log("Successfully Trained Linear Regression")
        }catch(error){
          console.log(error);
        }
        const ModelScore = async () => {
          const response = await axios.post('http://127.0.0.1:8000/api/handleModelScore/');
          console.log(response);
        };
        ModelScore()
      }
  return (
    <div>
      <Button className = 'btn  btn-block' onClick = {LinearRegressionCall} type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>Linear Regression</Button>
    </div>
  )
}

export default LinearRegression
