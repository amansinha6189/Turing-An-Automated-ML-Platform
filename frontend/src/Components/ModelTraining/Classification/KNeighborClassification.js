import React, { useState } from 'react'
import axios from 'axios'
import { Button, Container, Table } from 'react-bootstrap';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {IconButton, Typography } from '@mui/material';
import { Input, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function KNeighborClassification() {
  const [leaf_size, setleaf_size] = useState(30)
  const [n_neighbors, setN_neighbors] = useState(5)
  const [p , setP] = useState(2)
  const [gotScore, setGotScore] = useState(false)
  const [conf_Mat, setconf_Mat] = useState([])
  const [accuracy, setAccuracy] = useState()

  const KNeighborClassificationCall = async event => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('leaf_size', leaf_size)
      formData.append('n_neighbors', n_neighbors)
      formData.append('p', p)
      
      try{
          const response = await axios.post('http://127.0.0.1:8000/api/handleKNeighborsClassification/', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          console.log("Successfully Trained K Neighbors Classification, ", response.data)
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
        onSubmit={KNeighborClassificationCall} 
      >
        <TextField id="outlined-basic" label="Leaf_size" variant="outlined" defaultValue={30} onChange={e => setleaf_size(e.target.value)}/>
        <TextField id="outlined-basic" label="N_neighbors" variant="outlined" defaultValue={5} onChange={e => setN_neighbors(e.target.value)}/>
        <TextField id="outlined-basic" label="P" variant="outlined" defaultValue={2} onChange={e => setP(e.target.value)}/>
        <br></br>
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
        </Typography>
      }
  </div>
)
}

   

export default KNeighborClassification
