import React, { useState } from 'react'
import axios from 'axios'
import { Button, Container, Table } from 'react-bootstrap';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {IconButton, Typography } from '@mui/material';
import { Input, TableBody, TableCell, TableHead, TableRow } from '@mui/material';


function LogisticRegression() {
  const [gotScore, setGotScore] = useState(false)
  const [conf_Mat, setconf_Mat] = useState([])
  const [accuracy, setAccuracy] = useState()
  const [downloadLink, setDownloadLink] = useState('');

    const LogisticRegressionCall = async event => {
        event.preventDefault();
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/handleLogisticRegression/');
            console.log("Successfully Trained Logistic Regression")
        }catch(error){
          console.log(error);
        }
        const ModelScore = async () => {
          const response = await axios.post('http://127.0.0.1:8000/api/handleModelScore/');
          console.log(response.data);
          setAccuracy(response.data[0][1])
          let ModelScore = response.data[1][1]
          console.log(ModelScore)
          ModelScore = String(ModelScore).split('\n');
          setconf_Mat(ModelScore.map(row => row.split(',')));
          setGotScore(true)
        };
        ModelScore()
      }
      const ModelDownload = async event => {
        // const response = await axios.post('http://127.0.0.1:8000/api/downloadModel/')
  
          const fetchDownloadLink = async () => {
            try {
              const response = await axios.post('http://127.0.0.1:8000/api/downloadModel/');
              console.log(response);
              console.log(response.data);
              console.log(response.data.download_link);
              setDownloadLink(response.data.download_link);
            } catch (error) {
              console.error('Error:', error);
            }
          };
      
          fetchDownloadLink();
      
      }
  return (
<div>
      {!gotScore ? 
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 5, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={LogisticRegressionCall} 
      >
        
        <IconButton type="submit">SUBMIT</IconButton>
        
      </Box> : 
        
        <Typography id="modal-modal-title" variant="h6" component="h2">
            <h2>Model Score</h2>
            <Container style={{ height: '400px', widht :'400px', overflow: 'auto' }} className = 'my-3'>
              <h4><strong>Accuracy:</strong> {accuracy} </h4>
              <br/>
            <h4>Confusion Matrix</h4>
              <Table stickyHeader striped bordered hover >
                
                <TableHead className='bg-dark'>
                  <TableRow>
                    {conf_Mat[0].map((column) => (
                      <TableCell
                        key={column}
                        className = 'text-white bg-dark'
                        style = {{position: 'sticky', top: 0}}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead> 
                <TableBody>
                  {conf_Mat && conf_Mat.slice(1,1000).map((row, index) => (
                    <TableRow className="small" key={index}>
                      {Object.values(row).map((cell, index) => (
                        <td className="small" key={index}>{cell}</td>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </Container> 
          <a href ={downloadLink} download='model.joblib'>
          <Button className = 'btn  btn-block' type="button" style = {{backgroundColor : 'rgb(53,58,63)'}}  onClick={ModelDownload}>Download Model<i className="fa-solid fa-download mx-2 my-2"></i></Button>
          </a>
        </Typography>
      }
    </div>
  )
}

export default LogisticRegression
