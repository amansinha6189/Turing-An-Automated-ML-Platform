import React, { useState } from 'react'
import axios from 'axios'
import { Button, Container, Table } from 'react-bootstrap';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {IconButton, Typography } from '@mui/material';
import { Input, TableBody, TableCell, TableHead, TableRow } from '@mui/material';


function RandomForestRegression() {

    // Random Forest Parameters
    const [randomForest_n_estimators, setRandomForest_n_estimators] = useState(100)
    const [randomForest_max_features, setRandomForest_max_features] = useState(1)
    const [randomForest_max_depth , setRandomForest_max_depth ] = useState(null)
    const [randomForest_min_samples_split, setRandomForest_min_samples_split] = useState(2)
    const [randomForest_min_samples_leaf, setRandomForest_min_samples_leaf] = useState(1)
    const [randomForest_bootstrap, setRandomForest_bootstrap] = useState(true)
    const [gotScore, setGotScore] = useState(false)
    const [score, setScore] = useState()
    const [downloadLink, setDownloadLink] = useState('');

  
    const RandomForestRegressionCall = async event => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('n_estimators', randomForest_n_estimators)
        formData.append('min_samples_split', randomForest_min_samples_split)
        formData.append('max_features', randomForest_max_features)
        formData.append('max_depth', randomForest_max_depth)
        formData.append('min_samples_leaf', randomForest_min_samples_leaf)
        formData.append('bootstrap', randomForest_bootstrap)
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/handleRandomForestRegression/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            console.log("Successfully Trained Random Forest Regression")
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
        onSubmit={RandomForestRegressionCall} 
      >
        <TextField id="outlined-basic" label="n_estimators" variant="outlined" defaultValue={100} onChange={e => setRandomForest_n_estimators(e.target.value)}/>
      <TextField id="outlined-basic" label="max_features" variant="outlined" defaultValue={1} onChange={e => setRandomForest_max_features(e.target.value)} />
      <TextField id="outlined-basic" label="max_depth" variant="outlined" defaultValue={'none'} onChange={e => setRandomForest_max_depth(e.target.value)} />
      <TextField id="outlined-basic" label="min_samples_split" variant="outlined" defaultValue={2} onChange={e => setRandomForest_min_samples_split(e.target.value)} />
      <br></br>
      <TextField id="outlined-basic" label="min_samples_leaf" variant="outlined" defaultValue={1} onChange={e => setRandomForest_min_samples_leaf(e.target.value)} />      
      <TextField id="outlined-basic" label="bootstrap" variant="outlined" defaultValue={'true'} onChange={e => setRandomForest_bootstrap(e.target.value)} />
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

export default RandomForestRegression
