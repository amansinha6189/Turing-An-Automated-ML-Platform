import React, { useState } from 'react'
import axios from 'axios'
import { Button, Container, FormControl, Table } from 'react-bootstrap';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {IconButton, InputLabel, NativeSelect, Typography } from '@mui/material';
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function SVMRegression() {
  const [kernel, setKernel] = useState('rbf')
  const [C , setC] = useState(1.0)
  const [gotScore, setGotScore] = useState(false)
  const [score, setScore] = useState()


  const SVMRegressionCall = async event => {
      console.log(kernel, C)
      event.preventDefault();
      const formData = new FormData();
      formData.append('kernel', kernel)
      formData.append('C', C)
      
      try{
          const response = await axios.post('http://127.0.0.1:8000/api/handleSVMRegression/', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          console.log("Successfully Trained SVM Regression")
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
        onSubmit={SVMRegressionCall} 
      >
      <FormControl fullWidth>
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        kernel
      </InputLabel>
      <NativeSelect
        defaultValue={"rbf"}
        onChange={e => setKernel(e.target.value)}
        inputProps={{
          name: 'age',
          id: 'uncontrolled-native',
        }}
      >
        <option value={"linear"}>Linear</option>
        <option value={"poly"}>Poly</option>
        <option value={"rbf"}>RBF</option>
        <option value={"sigmoid"}>sigmoid</option>
        <option value={"precomputed"}>precomputed</option>
      </NativeSelect>
    </FormControl>
          <TextField id="outlined-basic" label="C"variant="outlined" defaultValue={1} onChange={e => setC(e.target.value)}/>
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
export default SVMRegression
