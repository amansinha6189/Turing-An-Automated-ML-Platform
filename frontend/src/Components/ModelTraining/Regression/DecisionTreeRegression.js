import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Container, Table } from 'react-bootstrap';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {IconButton, Typography } from '@mui/material';
import { Input, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { LinkContainer } from 'react-router-bootstrap';

function DecisionTreeRegression() {
    const [desicionTree_max_depth, setDecisionTree_max_depth] = useState(null)
    const [desicionTree_min_samples_split, setDecisionTree_min_samples_split] = useState(2)
    const [desicionTree_min_samples_leaf, setDecisionTree_min_samples_leaf] = useState(1)
    const [desicionTree_max_features, setDecisionTree_max_features] = useState(null)
    const [desicionTree_min_weight_fraction_leaf, setDecisionTree_min_weight_fraction_leaf] = useState(0)
    const [desicionTree_random_state, setDecisionTree_random_state] = useState(null)
    const [gotScore, setGotScore] = useState(false)
    const [score, setScore] = useState()
    const [downloadLink, setDownloadLink] = useState('');

    const DecisionTreeRegressionCall = async event => {
        event.preventDefault();
        const formData = new FormData();
      
        formData.append('max_depth', desicionTree_max_depth)
        formData.append('min_samples_split', desicionTree_min_samples_split)
        formData.append('min_samples_leaf', desicionTree_min_samples_leaf)
        formData.append('max_features', desicionTree_max_features)
        formData.append('min_weight_fraction_leaf', desicionTree_min_weight_fraction_leaf)
        formData.append('random_state', desicionTree_random_state)
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/handleDecisionTreeRegression/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            console.log("Successfully Trained Decision Tree Regression")
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
        onSubmit={DecisionTreeRegressionCall} 
      >
        <TextField id="outlined-basic" label="Max_depth" variant="outlined" defaultValue={'none'} onChange={e => setDecisionTree_max_depth(e.target.value)}/>
      <TextField id="outlined-basic" label="Min_samples_split" variant="outlined" defaultValue={2} onChange={e => setDecisionTree_min_samples_split(e.target.value)} />
      <TextField id="outlined-basic" label="Min_samples_leaf" variant="outlined" defaultValue={1} onChange={e => setDecisionTree_min_samples_leaf(e.target.value)} />
      <TextField id="outlined-basic" label="Max_features" variant="outlined" defaultValue={'none'} onChange={e => setDecisionTree_max_features(e.target.value)} />
      <br></br>
      <TextField id="outlined-basic" label="Min_weight_fraction_leaf" variant="outlined" defaultValue={0} onChange={e => setDecisionTree_min_weight_fraction_leaf(e.target.value)} />      
      <TextField id="outlined-basic" label="Random_state" variant="outlined" defaultValue={'none'} onChange={e => setDecisionTree_random_state(e.target.value)} />
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
          <a href ={downloadLink} download='model.joblib'>
          <Button className = 'btn  btn-block' type="button" style = {{backgroundColor : 'rgb(53,58,63)'}}  onClick={ModelDownload}>Download Model<i className="fa-solid fa-download mx-2 my-2"></i></Button>
          </a>
        </Typography>
      }
    </div>
  )
}

export default DecisionTreeRegression
