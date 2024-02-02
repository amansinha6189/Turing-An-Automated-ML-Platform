import React, { useState } from 'react'
import axios from 'axios'
import { Button, Container, Table } from 'react-bootstrap';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {IconButton, Typography } from '@mui/material';
import { Input, TableBody, TableCell, TableHead, TableRow } from '@mui/material';


function NaiveByes() {
  const [gotScore, setGotScore] = useState(false)
  const [conf_Mat, setconf_Mat] = useState([])
  const [class_report, setClass_report] = useState([])
  const [accuracy, setAccuracy] = useState()
  const [downloadLink, setDownloadLink] = useState('');


    const NaiveByesCall = async event => {
      event.preventDefault();
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/handleNaiveByes/');
            console.log("Successfully Trained Naive Byes Classification")
        }catch(error){
          console.log(error);
        }
        const ModelScore = async () => {
          const response = await axios.post('http://127.0.0.1:8000/api/handleModelScore/');
          console.log(response.data);
          setAccuracy(response.data[0][1])
          let classReport = response.data[2][1]
          console.log(classReport)
          classReport = String(classReport).split('\n');
          setconf_Mat(classReport.map(row => row.split('    ')));
          let confMatrix = response.data[1][1]
          console.log(confMatrix)
          confMatrix = String(confMatrix).split('\n');
          setClass_report(confMatrix.map(row => row.split(',')));
          console.log(class_report)

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
        onSubmit={NaiveByesCall} 
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
              <br/>
            <h4>Classification Report</h4>
              <Table stickyHeader striped bordered hover >
                
                <TableHead className='bg-dark'>
                  <TableRow>
                    {class_report[0].map((column) => (
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
                  {class_report && class_report.slice(1,1000).map((row, index) => (
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

export default NaiveByes
