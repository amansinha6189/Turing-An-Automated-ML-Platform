// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
// import Loader from '../Components/Loader';
// import Message from '../Components/Message';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import Papa from 'papaparse';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import DataPreprocessing from './DataPreprocessing';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// function UploadFileScreen() {
//   const [file, setFile] = useState(null);  
//   const [data, setData] = useState(null);
//   const [uploaded, setUploaded] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState("");
//   const [user, setUser] = useState(1); 
//   const [showData, setShowData] = useState([]);
//   const [dragAndDrop, setDragAndDrop] = useState(true);
//   const [openModal, setOpenModal] = useState(false);
//   const [opr, setOpr] = useState("mean")
//   const [col_HadlingOutliers, setCol_HadlingOutliers] = useState(2)
//   const [selected_MethodHandlingOutliers, setSelected_MethodHandlingOutliers] = useState("z-score")


//   const selectedCol = []

//   const handleOpen = () => setOpenModal(true);
//   const handleClose = () => setOpenModal(false);

//   const handleFileUpload = event => {
//     setFile(event.target.files[0]);
//   };

//   const handleSubmit = async event => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append('data', file);
//     formData.append('user', user);
//     console.log(formData);

//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/uploadData/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
  
//       setUploaded(true);
//       setOpenModal(false);
//       // console.log(response);
//     } catch (error) {
//       console.log(error);
//     }

//     const fetchData = async () => {
//       const response = await axios.get('http://127.0.0.1:8000/api/uploadData/');
//       // console.log(response.data.data);
//       let csvData = await axios.get(`http://127.0.0.1:8000${response.data.data}`)
//                                   .then(response => ( response.data));
//       setData(csvData);
//       csvData = String(csvData).split('\n');
//       setShowData(csvData.map(row => row.split(',')));
//     };
//     fetchData();
//   } 

//   const handlingMissingValues = async event => {
//     event.preventDefault();
//     const formdata = new FormData();
//     formdata.append('file_name', file.name)
//     formdata.append('opr', opr)
//     formdata.append('selected_Col', selectedCol)

//     try{
//       const response = await axios.post('http://127.0.0.1:8000/api/handlingMissingValues/', formdata, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       }).then(response => {
//         response.data = String(response.data).split('\n')
//         setShowData(response.data.map(row => row.split(',')))
//     })
//     }catch(error){
//       console.log(error);
//     }
//   }

//   const handlingOutliers = async event => {
//     event.preventDefault();
//     const formdata = new FormData();
//     formdata.append('file_name', file.name)
//     formdata.append('col', col_HadlingOutliers) // pass index of column
//     formdata.append('selected_Method', selected_MethodHandlingOutliers)

//     try{
//       const response = await axios.post('http://127.0.0.1:8000/api/handlingOutliers/', formdata, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       }).then(response => {
//         console.log(response.data);
//     })
//     }catch(error){
//       console.log(error);
//     }
//   }

//   const handleEncoding = async event => {
//     event.preventDefault();
//     const formdata = new FormData();
//     formdata.append('file_name', file.name)
//     formdata.append('col', col_HadlingOutliers)
//     formdata.append('selected_Method', selected_MethodHandlingOutliers)

//     try{
//       const response = await axios.post('http://127.0.0.1:8000/api/handlingOutliers/', formdata, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       }).then(response => {
//         console.log(response.data);
//     })
//     }catch(error){
//       console.log(error);
//     }
//   }
//   console.log('selected_col->', selectedCol);
//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     setFile(file);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const diffToast=()=>{
//     toast.success("File Uploaded Successfully!",{
//       position:"top-center"
//     });
// }
   
//   return (
//     <div>
//       {/* {loading ? <h2><Loader /></h2>  */}
//             {/* :errors ? <Message variant='danger'>{errors}</Message>  */}
//             {/* : uploaded ? <Message variant='success'>{"Data Uploaded Successfully"}</Message>  */}
//             {/* : */}

//               {!uploaded ? <div><Row>
//                   <Col md = {4}>
//                 <Form onSubmit={handleSubmit}>
//                   <Form.Group controlId="formFile" className="mb-3">
//                       <Form.Label><h3 className='my-3 py-3'>Upload Data in CSV Format</h3></Form.Label>
//                       <Form.Control type="file" onChange={handleFileUpload}/>
//                     </Form.Group>
//                     <Button className = 'btn  btn-block' type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>Upload Data <i className="fa-solid fa-upload mx-2"></i></Button>
//                 </Form>
//                 </Col>
//                       <Col md = {8} className = 'py-4'>
//                       <Card style={{
//                         display:"flex",
//                         alignContent: "center",
//                         justifyContent: "center",
//                         minHeight: '70vh',
//                         textAlign: 'center',
//                       }}
//                         onDrop={handleDrop} 
//                         onDragOver={handleDragOver} 
//                       >
//                           {file ? (
//                             <p>{file.name}</p>
//                           ) : (
//                             <p>Drag and drop a file here</p>
//                           )}
//                         <p>OR</p>
//                         <Row>
//                           <Col md = {4}></Col>
//                           <Col md = {4}>
//                             <Button type="button" style = {{backgroundColor : 'rgb(53,58,63)'}}>Get a Dummy Data <i className="fa-solid fa-download mx-2"></i></Button>
//                           </Col>
//                           <Col md = {4}></Col>
//                         </Row>
//                       </Card>
//                     </Col>
//                     </Row>
//                     </div>
//                   : 
//                   <div>
// {/* ----------------------------------Upload New Data Modal Starts here-------------------------------------------------------*/}
//                     <Row className='my-3'>
//                     <Col md = {4}><Button onClick={handleOpen}>Upload New Data</Button></Col>
//                     <Col md = {4}></Col>
//                     <Col md = {4}></Col>
                    
//                     <Modal
//                       open={openModal}
//                       onClose={handleClose}
//                       aria-labelledby="modal-modal-title"
//                       aria-describedby="modal-modal-description"
//                     >
//                       <Box sx={style}>
//                         <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//                         <Form onSubmit={handleSubmit}>
//                           <Form.Group controlId="formFile" className="mb-3">
//                               <Form.Label><h3 className='my-3 py-3'>Upload Data in CSV Format</h3></Form.Label>
//                               <Form.Control type="file" onChange={handleFileUpload}/>
//                             </Form.Group>
//                             <Button className = 'btn  btn-block' type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>Upload Data <i className="fa-solid fa-upload mx-2"></i></Button>
//                         </Form>
//                         </Typography>
//                       </Box>
//                     </Modal>
//                     </Row>
//                     <Row>
// {/*-----------------------------------Upload New Data Modal Ends here------------------------------------------------------- */}
// {/* ======================================================================================================================== */}
// {/* ----------------------------------Uploaded Data Table Starts here ------------------------------------------------------ */}
//                     <Table striped bordered hover>
//                       <tbody>
//                         {showData && showData.map((row, index) => (
//                           <tr key={index}>
//                             {Object.values(row).map((cell, index) => (
//                               <td key={index}>{cell}</td>
//                             ))}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
// {/* ----------------------------------Uploaded Data Table Ends here ------------------------------------------------------ */}
//                     <Button className = 'btn' type="submit" onClick = {handlingMissingValues} style = {{backgroundColor : 'rgb(53,58,63)'}}>Data Preprocessing<i className="fa-solid fa-upload mx-2"></i></Button>
//                     <Button className = 'btn' type="submit" onClick = {handlingOutliers} style = {{backgroundColor : 'rgb(53,58,63)'}}>Handling Outliers<i className="fa-solid fa-upload mx-2"></i></Button>
//                     <Button className = 'btn' type="submit" onClick = {handleEncoding} style = {{backgroundColor : 'rgb(53,58,63)'}}>Encode Data<i className="fa-solid fa-upload mx-2"></i></Button>
                   
//                     <Row>
//                       <DataPreprocessing data = {showData[0]} selectedCol = {selectedCol}/>
//                     </Row>
//                     </Row>
//                   </div>
//               }
//     </div>

//   ) 
// }

// export default UploadFileScreen




import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Papa from 'papaparse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import DataPreprocessing from './DataPreprocessing';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#137cbd',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3',
  },
});

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
  const [data, setData] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [user, setUser] = useState(1);
  const [showData, setShowData] = useState([]);
  const [dragAndDrop, setDragAndDrop] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [opr, setOpr] = useState("mean");
  const [col_HadlingOutliers, setCol_HadlingOutliers] = useState("Salary");
  const [selected_MethodHandlingOutliers, setSelected_MethodHandlingOutliers] = useState("z-score");
  // const [selectedCol, setSelectedCol] = useState([])
  const [selectedHandlingMissingValuesCol, setSelectedHandlingMissingValuesCol] = useState([]);
  let selectedCol = []
  const [selectedOption, setSelectedOption] = useState('');
  const [showModal, setShowModal] = useState(false);

  const theme = useTheme();
  const [colName, setColName] = useState([]);
  
  function BpRadio() {
    return (
      <Radio
        disableRipple
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
      />
    );
  }
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  
  function getStyles(col, colName, theme) {
    return {
      fontWeight:
        colName.indexOf(col) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium
    };
  }

  

 
  

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleOptionClick = () => {
    setShowModal(true);
  };

  // Event listener to hide the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFileUpload = event => {
    setFile(event.target.files[0]);
  };

  // const handleSelectChange = (event) => {
  //   const optionValue = event.target.value;
  //   setSelectedOption(optionValue);
  //   if (optionValue === 'option1') {
  //     setOpenModal(true);
  //   } else {
  //     setOpenModal(false);
  //   }

  // };

  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('data', file);
    formData.append('user', user);
    console.log(formData);

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
      setData(csvData);
      csvData = String(csvData).split('\n');
      setShowData(csvData.map(row => row.split(',')));
    };
    fetchData();
  } 

    // console.log(columns.data)
    const columns = showData[0]
    console.log(columns);
    const columnsNames = [].concat(columns)
    console.log(columnsNames)
    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setColName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value
      );
      // selectedCol.push(value[0])
      console.log(value);
      selectedCol = value;
      console.log(selectedCol);
      // setColName(selectedCol);
      console.log("selectedCol-> " + selectedCol)
      setSelectedHandlingMissingValuesCol(selectedCol);
    };

  const handlingMissingValues = async event => {
    console.log(opr)
    event.preventDefault();
    const formdata = new FormData();
    formdata.append('file_name', file.name)
    formdata.append('opr', opr)
    formdata.append('selected_Col', selectedHandlingMissingValuesCol)
    console.log(setSelectedHandlingMissingValuesCol)

    try{
      const response = await axios.post('http://127.0.0.1:8000/api/handlingMissingValues/', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
        response.data = String(response.data).split('\n')
        setShowData(response.data.map(row => row.split(',')))
    })
    }catch(error){
      console.log(error);
    }
  }

  const handlingOutliers = async event => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append('file_name', file.name)
    formdata.append('col', col_HadlingOutliers) // pass index of column
    formdata.append('selected_Method', selected_MethodHandlingOutliers)

    try{
      const response = await axios.post('http://127.0.0.1:8000/api/handlingOutliers/', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
        console.log(response.data);
    })
    }catch(error){
      console.log(error);
    }
  }

  const handleEncoding = async event => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append('file_name', file.name)
    formdata.append('col', col_HadlingOutliers)
    formdata.append('selected_Method', selected_MethodHandlingOutliers)

    try{
      const response = await axios.post('http://127.0.0.1:8000/api/handlingOutliers/', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
        console.log(response.data);
    })
    }catch(error){
      console.log(error);
    }
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const diffToast=()=>{
    toast.success("File Uploaded Successfully!",{
      position:"top-center"
    });

    console.log(selectedCol);
}
   
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
                      {/* <ToastContainer /> */}
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
                
                                    {/* <div className="dropdown">
                      <button className="dropbtn">Data Preprocessing</button>
                      <div className="dropdown-content"> */}
                      <Col md = {3}><Button onClick={handleOptionClick}>Handling Missing values</Button></Col>
                         <Modal
                          open={showModal}
                          onClose={handleCloseModal}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              <h1>Handling Missing Values</h1>
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                              {/* Duis mollis, est non commodo luctus, nisi erat porttitor ligula. */}
                              <Row>
                              {/* <FormLabel id="demo-customized-radios">Operations</FormLabel> */}
                              {/* <RadioGroup
                                defaultValue="Mean"
                                aria-labelledby="demo-customized-radios"
                                name="customized-radios"
                              >
                                <FormControlLabel value="Mean" control={<BpRadio />} label="Mean" checked={opr === 'Mean'} 
                                onChange={e => setOpr(e.target.value)} />
                                <FormControlLabel value="Median" control={<BpRadio />} label="Median" checked={opr === 'Median'} 
                                 onChange={() => setOpr('Median')}/>
                                <FormControlLabel value="Drop Row" control={<BpRadio />} label="Drop Row" checked={opr === 'Drop Row'} 
                                 onChange={() => setOpr('Drop Row')}/>
                                <FormControlLabel value="Replace with value 0" control={<BpRadio />} label="Replace with value 0"checked={opr === 'Replace with value 0'} 
                                 onChange={() => setOpr('Replace with value 0')} />
                                
                              </RadioGroup> */}

                              <div className="container">
                                <div className="row">
                                  <div className="col-sm-12">
                                    <form>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="mean" onChange={e => setOpr(e.target.value)} />
                                          Mean
                                        </label>
                                      </div>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="median" onChange={e => setOpr(e.target.value)} />
                                          Median
                                        </label>
                                      </div>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="drop" onChange={e => setOpr(e.target.value)} />
                                          Drop Row
                                        </label>
                                      </div>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="Else" onChange={e => setOpr(e.target.value)} />
                                          Replace with value 0
                                        </label>
                                      </div>
                                    </form>  
                                  </div>
                                </div>
                              </div>
                            </Row>
                            <Row>
                      <FormControl>
                          <Col>
                            <Row>
                              <InputLabel id="demo-multiple-chip-label">Select Columns</InputLabel>
                                <Select
                                  labelId="demo-multiple-chip-label"
                                  id="demo-multiple-chip"
                                  multiple
                                  value={colName}
                                  onChange={handleChange}
                                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                  renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                      ))}
                                    </Box>
                                  )}
                                  MenuProps={MenuProps}
                                >
                                  {columnsNames.map((col) => (
                                    <MenuItem
                                      key={col}
                                      value={col}
                                      style={getStyles(col, colName, theme)}
                                    >
                                      {col}
                                    </MenuItem>
                                  ))}
                                </Select>
                            </Row>
                            </Col>
                          
                        </FormControl>
                      </Row>
                              
                            </Typography>
                            <Button className = 'btn  btn-block' onClick = {handlingMissingValues} type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>Submit</Button>
                          </Box>
                        </Modal>
                        <Col md = {3}><Button onClick={handlingOutliers}>Handling Outliers</Button></Col>
                        <Col md = {3}><Button onClick={handleOptionClick}>Encoding Data</Button></Col>
                        <Col md = {3}><Button onClick={handleOptionClick}>Feature Scaling</Button></Col>
                      {/* </div> */}

                      {/* Render modal conditionally based on state */}
                      {/* {showModal  && (
                        <div className="modal">
                          <div className="modal-content">
                            <span className="close" onClick={handleCloseModal}>&times;</span>
                            <h1>Handle Missing Values</h1>
                    
                          </div>
                        </div>
                      )} */}
                    {/* </div> */}
                    {/* <Button className = 'btn' type="submit" onClick = {handlingMissingValues} style = {{backgroundColor : 'rgb(53,58,63)'}}>Data Preprocessing<i className="fa-solid fa-upload mx-2"></i></Button> */}
                    {/* <Button className = 'btn' type="submit" onClick = {handlingOutliers} style = {{backgroundColor : 'rgb(53,58,63)'}}>Handling Outliers<i className="fa-solid fa-upload mx-2"></i></Button>
                    <Button className = 'btn' type="submit" onClick = {handleEncoding} style = {{backgroundColor : 'rgb(53,58,63)'}}>Encode Data<i className="fa-solid fa-upload mx-2"></i></Button>
                    */}
                    {/* <Row>
                      <DataPreprocessing data = {showData[0]} selectedCol = {selectedCol}/>
                    </Row> */}
                    

                    {/* <Row>
                      <FormControl>
                          <Col>
                            <Row>
                              <InputLabel id="demo-multiple-chip-label">Select Columns</InputLabel>
                                <Select
                                  labelId="demo-multiple-chip-label"
                                  id="demo-multiple-chip"
                                  multiple
                                  value={colName}
                                  onChange={handleChange}
                                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                  renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                      ))}
                                    </Box>
                                  )}
                                  MenuProps={MenuProps}
                                >
                                  {columnsNames.map((col) => (
                                    <MenuItem
                                      key={col}
                                      value={col}
                                      style={getStyles(col, colName, theme)}
                                    >
                                      {col}
                                    </MenuItem>
                                  ))}
                                </Select>
                            </Row> */}
                            {/* <Row>
                              <FormLabel id="demo-customized-radios">Operations</FormLabel>
                              <RadioGroup
                                defaultValue="Mean"
                                aria-labelledby="demo-customized-radios"
                                name="customized-radios"
                              >
                                <FormControlLabel value="Mean" control={<BpRadio />} label="Mean" />
                                <FormControlLabel value="Median" control={<BpRadio />} label="Median" />
                                <FormControlLabel value="Drop Row" control={<BpRadio />} label="Drop Row" />
                                <FormControlLabel value="Replace with value 0" control={<BpRadio />} label="Replace with value 0" />
                                
                              </RadioGroup>
                            </Row> */}
                          {/* </Col>
                          
                        </FormControl>
                      </Row> */}
                    </Row>
                  </div>
              }
    </div>
  ) 
}

export default UploadFileScreen
