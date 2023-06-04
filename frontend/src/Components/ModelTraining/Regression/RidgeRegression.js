import React, { useState } from 'react'
import axios from 'axios'
import { Button, Container, Table } from 'react-bootstrap';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {IconButton, Typography } from '@mui/material';
import { Input, TableBody, TableCell, TableHead, TableRow } from '@mui/material';


function RidgeRegression() {
    const [alpha, setAlpha] = useState('0.1')
    const [gotScore, setGotScore] = useState(false)
    const [score, setScore] = useState()
  
    const RidgeRegressionCall = async event => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('alpha', alpha)
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/handleRidgeRegression/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            console.log("Successfully Trained Ridge Regression")
        }catch(error){
          console.log(error);
        }
        const ModelScore = async () => {
          const response = await axios.post('http://127.0.0.1:8000/api/handleModelScore/');
          console.log(response.data);
          let ModelScore = response.data
          ModelScore = String(ModelScore).split('\n');
          setScore(ModelScore.map(row => row.split(',')));
          
          setGotScore(true)
  
          
        };
        ModelScore()
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
        onSubmit={RidgeRegressionCall} 
      >
        <TextField id="outlined-basic" label="Alpha" variant="outlined" defaultValue={1} onChange={e => setAlpha(e.target.value)}/>
      <br></br>
      <IconButton type="submit">SUBMIT</IconButton>
        
      </Box> : 
        
        <Typography id="modal-modal-title" variant="h6" component="h2">
            <h2>Model Score</h2>
            <Container style={{ height: '400px', widht :'400px', overflow: 'auto' }} className = 'my-3'>
              <Table stickyHeader striped bordered hover >
                <TableHead className='bg-dark'>
                  <TableRow>
                  
                    {score[0].map((column) => (
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
                  {score && score.slice(1,1000).map((row, index) => (
                    <TableRow className="small" key={index}>
                      {Object.values(row).map((cell, index) => (
                        <td className="small" key={index}>{cell}</td>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </Container> 
        </Typography>
      } 
          </div>
  )
}

export default RidgeRegression
