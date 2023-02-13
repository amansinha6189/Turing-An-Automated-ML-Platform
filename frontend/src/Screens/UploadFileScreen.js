import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Papa from 'papaparse';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function UploadFileScreen() {
  const [file, setFile] = useState(null);  
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [user, setUser] = useState(1);
  const [showData, setShowData] = useState([]);
  const [dragAndDrop, setDragAndDrop] = useState(true);
  const [openModal, setOpenModal] = useState(false);


  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleFileUpload = event => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('data', file);
    formData.append('user', user);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/uploadData/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      setUploaded(true);
      setOpenModal(false);
      // console.log(response);
    } catch (error) {
      console.log(error);
    }

      const fetchData = async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/uploadData/');
        // console.log(response.data.data);
        let csvData = await axios.get(`http://127.0.0.1:8000${response.data.data}`)
                                    .then(response => ( response.data));
        csvData = String(csvData).split('\n');
        setShowData(csvData.map(row => row.split(',')));
        // console.log(csvData);
      };
      fetchData();
    

  }

  // console.log(showData);
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      {/* {loading ? <h2><Loader /></h2>  */}
            {/* :errors ? <Message variant='danger'>{errors}</Message>  */}
            {/* : uploaded ? <Message variant='success'>{"Data Uploaded Successfully"}</Message>  */}
            {/* : */}

              {!uploaded ? <div><Row>
                  <Col md = {4}>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label><h3 className='my-3 py-3'>Upload Data in CSV Format</h3></Form.Label>
                      <Form.Control type="file" onChange={handleFileUpload}/>
                    </Form.Group>
                    <Button className = 'btn  btn-block' type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>Upload Data <i className="fa-solid fa-upload mx-2"></i></Button>
                </Form>
                </Col>
                      <Col md = {8} className = 'py-4'>
                      <Card style={{
                        display:"flex",
                        alignContent: "center",
                        justifyContent: "center",
                        minHeight: '70vh',
                        textAlign: 'center',
                      }}
                        onDrop={handleDrop} 
                        onDragOver={handleDragOver} 
                      >
                          {file ? (
                            <p>{file.name}</p>
                          ) : (
                            <p>Drag and drop a file here</p>
                          )}
                        <p>OR</p>
                        <Row>
                          <Col md = {4}></Col>
                          <Col md = {4}>
                            <Button type="button" style = {{backgroundColor : 'rgb(53,58,63)'}}>Get a Dummy Data <i className="fa-solid fa-download mx-2"></i></Button>
                          </Col>
                          <Col md = {4}></Col>
                        </Row>
                      </Card>
                    </Col>
                    </Row>
                    </div>
                  : 
                  <div>
                    <Row className='my-3'>
                    <Col md = {4}><Button onClick={handleOpen}>Upload New Data</Button></Col>
                    <Col md = {4}></Col>
                    <Col md = {4}></Col>
                    
                    <Modal
                      open={openModal}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Form onSubmit={handleSubmit}>
                          <Form.Group controlId="formFile" className="mb-3">
                              <Form.Label><h3 className='my-3 py-3'>Upload Data in CSV Format</h3></Form.Label>
                              <Form.Control type="file" onChange={handleFileUpload}/>
                            </Form.Group>
                            <Button className = 'btn  btn-block' type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>Upload Data <i className="fa-solid fa-upload mx-2"></i></Button>
                        </Form>
                        </Typography>
                      </Box>
                    </Modal>
                    </Row>
                    <Row>
                    <Table striped bordered hover>
                      <tbody>
                        {showData && showData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((cell, index) => (
                              <td key={index}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    </Row>
                  </div>
              }
    </div>
  ) 
}

export default UploadFileScreen