import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Label } from 'reactstrap';
import {Alert, Button, Card, Col, Container, Form, FormGroup, Row, Table } from 'react-bootstrap'
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Papa from 'papaparse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { Input, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

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


const styleOverview = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 1,
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

  const [showMsg, setShowMsg] = useState(false)
//alert msg 
const [errorMsg, setErrorMsg] = useState("")
// let errorMsg = ""
const [uploadedMsg, setUploadedMsg] = useState(false)
const [missingValuesUpdatedMsg, setMissingValuesUpdatedMsg] = useState(false)
const [missingValuesErrorMsg, setMissingValuesErrorMsg] = useState(false)
const [outliersHandledMsg, setOutliersHandledMsg] = useState(false)
const [outliersErrorMsg, setOutliersErrorMsg] = useState(false)
const [dataEncodedMsg, setDataEncodedMsg] = useState(false)
const [dataEncodedErrorMsg, setDataEncodedErrorMsg] = useState(false)
const [trainTestSplitMsg, setTrainTestSplitMsg] = useState(false)
const [trainTestSplitErrorMsg, setTrainTestSplitErrorMsg] = useState(false)
const [featureScalingMsg, setFeatureScalingMsg] = useState(false)
const [featureScalingErrorMsg, setFeatureScalingErrorMsg] = useState(false)


  // const [step, setStep] = useState(1);
  const [gotFile, setGotFile] = useState(false)

  // about data
  const [targetExists, setTargetExists] = useState("")
  const [targetCol, setTargetCol] = useState("")
  const [targetType, setTargetType] = useState("")
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);
  // const [seletedTargetCol, setSelectedTargetCol] = useState([])

  // about data modal
  const [showAboutModal, setShowAboutModal]=useState(false);
  const [showOverviewData, setShowOverviewData] = useState([]);
  // for handling Missing values
  const [opr, setOpr] = useState("");
  const [selectedHandlingMissingValuesCol, setSelectedHandlingMissingValuesCol] = useState([]);
  let selectedCol = []
  const [showHandlingMissingModal, setShowHandlingMissingModal] = useState(false);
  // For Handling Outliers
  const [col_HadlingOutliers, setCol_HadlingOutliers] = useState("");
  const [selected_MethodHandlingOutliers, setSelected_MethodHandlingOutliers] = useState("");
  const [showHandlingOutliersModal, setShowHandlingOutliersModal] = useState(false);

  // for encoding data
  const [selectedEncodingCol, setSelectedEncodingCol] = useState("");
  const [selectedEncodingMethod, setSelectedEncodingMethod] = useState("");
  const [selectedEncodingVariables, setSelectedEncodingVariables] = useState("");
  const [showEncodingDataModal, setShowEncodingDataModal] = useState(false);
  

  // For train and test data
  const [trainTestRatio, setTrainTestRatio] = useState(0.2)
  const [showTrainTestModal, setShowTrainTestModal] = useState(false);

  // For Feature Scaling
  const [featureScalingCol, setSelectedFeatureScalingCol] = useState([""]);
  const [featureScalingMethod, setSelectedFeatureScalingMethod] = useState("");
  const [showFeatureScalingModal, setShowFeatureScalingModal] = useState(false);


  const [selectedOption, setSelectedOption] = useState('');
  

  const theme = useTheme();
  const [colName, setColName] = useState([]);
  
  const targetToggle = () => setTargetDropdownOpen(prevState => !prevState);

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


//Upload data again
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
// overview
  const handleOptionClick0 = async event => {
    setShowAboutModal(true)
    const formdata = new FormData();
    formdata.append('file_name', file.name)
    try{
      const response = await axios.post('http://127.0.0.1:8000/api/getOverviewOfData/', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
        response.data = String(response.data).split('\n')
        setShowOverviewData(response.data.map(row => row.split(',')))
        console.log(response.data)
    })
    }catch(error){
      console.log(error);
    }
  };
  const handleCloseModal0 = () => setShowAboutModal(false);
  
// update missing values
  const handleOptionClick1 = () => setShowHandlingMissingModal(true);
  const handleCloseModal1 = () => setShowHandlingMissingModal(false);
// handling outliers 
  const handleOptionClick2 = () => setShowHandlingOutliersModal(true);
  const handleCloseModal2 = () => setShowHandlingOutliersModal(false);
// encoding data
  const handleOptionClick3 = () => setShowEncodingDataModal(true);
  const handleCloseModal3 = () => setShowEncodingDataModal(false);
// split dataset
  const handleOptionClick4 = () => setShowTrainTestModal(true);
  const handleCloseModal4 = () => setShowTrainTestModal(false);
// Feature scaling
  const handleOptionClick5 = () => setShowFeatureScalingModal(true);
  const handleCloseModal5 = () => setShowFeatureScalingModal(false);



  const handleFileUpload = event => {
    setFile(event.target.files[0]);
  };

const handleSelectTargetCol = (value) => {
  setTargetCol(value);
  console.log(targetCol)
}

// useEffect(() => {
//   const fetchData = async () => {
//     const response = await axios.get('http://127.0.0.1:8000/api/uploadData/');
//     let csvData = await axios.get(`http://127.0.0.1:8000${response.data.data}`)
//                                 .then(response => ( response.data));
//     setData(csvData);
//     csvData = String(csvData).split('\n');
//     setShowData(csvData.map(row => row.split(',')));
//     setUploaded(true);

//     // console.log(response);
//   };
//   fetchData();
// },[])

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
      
      setGotFile(true)
      setUploaded(false);
      setOpenModal(false);
      setShowAboutModal(false);
      setShowHandlingMissingModal(false);
      setShowHandlingOutliersModal(false);
      setShowEncodingDataModal(false);
      setShowTrainTestModal(false);
      setShowFeatureScalingModal(false);
  
    } catch (error) {
      console.log(error);
    }

    const fetchData = async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/uploadData/');
      let csvData = await axios.get(`http://127.0.0.1:8000${response.data.data}`)
                                  .then(response => ( response.data));
      setData(csvData);
      csvData = String(csvData).split('\n');
      setShowData(csvData.map(row => row.split(',')));
      // console.log(response);
    };
    fetchData();
  } 

    const columns = showData[0]
    console.log(columns);
    const columnsNames = [].concat(columns)
    console.log(columnsNames)
    console.log(targetExists)


    const handleMissingValueColChange = (event) => {
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

    const handleOutlierColChange = (event) => {
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
      setCol_HadlingOutliers(selectedCol);
    };

    const handleEncodingColChange = (event) => {
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
      setSelectedEncodingCol(selectedCol);
    };

    const handleFeatureScalingColChange = (event) => {
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
      setSelectedFeatureScalingCol(selectedCol);
    };

  const handleSelectTargetValues = async event => {
    console.log(targetCol)
    event.preventDefault();
    const formdata = new FormData();
    formdata.append('target_exists', targetExists)
    formdata.append('target_col', targetCol)
    formdata.append('target_type', targetType)
    console.log(setSelectedHandlingMissingValuesCol)

    setShowMsg(true)

    try{
      const response = await axios.post('http://127.0.0.1:8000/api/handleTargetValueData/', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
        console.log(response);
        setUploaded(true)
        setUploadedMsg(true)
    })
    }catch(error){
      console.log(error);
    }
  }
  const handlingMissingValues = async event => {
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
        selectedCol = []
        setColName([])
        setShowMsg(true)
        setMissingValuesUpdatedMsg(true)
        console.log(response.data)
    })
    .catch(error => {
    let error_message = error.response.data.error;
    setErrorMsg(error_message);
    setMissingValuesErrorMsg(true)
  })
}catch(error){
  console.log('Error:', error);
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
            response.data = String(response.data).split('\n')
            setShowData(response.data.map(row => row.split(',')))
            selectedCol = []
            setColName([])
            setShowMsg(true)
            setOutliersHandledMsg(true)
            console.log(response.data)
        })
        .catch(error => {
        let error_message = error.response.data.error;
        setErrorMsg(error_message);
        setOutliersErrorMsg(true)
      })
    }catch(error){
      console.log('Error:', error);
    }
  }

  const handleEncoding = async event => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append('file_name', file.name)
    formdata.append('col', selectedEncodingCol)
    formdata.append('varType', selectedEncodingVariables)

    try{
      const response = await axios.post('http://127.0.0.1:8000/api/handleEncoding/', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
            response.data = String(response.data).split('\n')
            setShowData(response.data.map(row => row.split(',')))
            selectedCol = []
            setColName([])
            setShowMsg(true)
            setDataEncodedMsg(true)
            console.log(response.data)
        })
        .catch(error => {
        let error_message = error.response.data.error;
        setErrorMsg(error_message);
        setDataEncodedErrorMsg(true)
      })
    }catch(error){
      console.log('Error:', error);
    }
  }


  const handleTrainTestSplit = async event => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append('file_name', file.name)
    formdata.append('ratio', trainTestRatio)


    try{
      const response = await axios.post('http://127.0.0.1:8000/api/trainTestDataSet/', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
            response.data = String(response.data).split('\n')
            setShowData(response.data.map(row => row.split(',')))
            selectedCol = []
            setColName([])
            setShowMsg(true)
            setTrainTestSplitMsg(true)
            console.log(response.data)
        })
        .catch(error => {
        let error_message = error.response.data.error;
        setErrorMsg(error_message);
        setTrainTestSplitErrorMsg(true)
      })
    }catch(error){
      console.log('Error:', error);
    }
  }

  const handleFeatureScaling = async event => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append('file_name', file.name)
    formdata.append('method', featureScalingMethod)
    formdata.append('col', featureScalingCol)
    formdata.append('cols', showData[0])

    try{
      const response = await axios.post('http://127.0.0.1:8000/api/handleFeatureScaling/', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
            response.data = String(response.data).split('\n')
            setShowData(response.data.map(row => row.split(',')))
            selectedCol = []
            setColName([])
            setShowMsg(true)
            setFeatureScalingMsg(true)
            console.log(response.data)
        })
        .catch(error => {
        let error_message = error.response.data.error;
        setErrorMsg(error_message);
        setFeatureScalingErrorMsg(true)
      })
    }catch(error){
      console.log('Error:', error);
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

    console.log(targetCol);

}
   
  return (
    <div>
      {loading ? <h2><Loader /></h2> 
            :errors ? <Message variant='danger' onClose={() => setShowMsg(false)}>{errors}</Message> 
            // :uploaded ? 
            :

              !uploaded ? <div><Row>
                  <Col md = {4}>
                    
{/* ------------------------------------- Upload Data Form ---------------------------- */}
                
                {!gotFile ?  
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label><h3 className='my-3 py-3'>Upload Data in CSV Format</h3></Form.Label>
                      <Form.Control type="file" onChange={handleFileUpload}/>
                    </Form.Group>
                    <Button className = 'btn  btn-block' type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>Upload Data <i className="fa-solid fa-upload mx-2"></i></Button>
                </Form> 
                : 
                  // is there any target value for this data 
                  gotFile === true ? 
                  <Form>
                    <div>
                      <h4 className='my-3 py-3'>Is there any Target Value for this data?</h4>
                      <div className="radio">
                          <label>
                            <input type="radio" name="options" value="true" onChange={e => setTargetExists(true)} />
                            Yes
                          </label>
                        </div>
                        <div className="radio">
                          <label>
                            <input type="radio" name="options" value="false" onChange={e => setTargetExists(false)} />
                            No
                          </label>
                        </div>
                    </div>
                  </Form>
                : 
                <div></div>
                }
                
                {targetExists === true && gotFile === true ?
                    <div className='my-3 py-3'>
                        <Dropdown isOpen={targetDropdownOpen} toggle={targetToggle}>
                          <DropdownToggle className="bg-dark text-white">
                              {targetCol || `Select Target Column`}
                          </DropdownToggle>
                          <DropdownMenu dark>
                            {columnsNames.map((column) => (
                                <DropdownItem value = {column} onClick={() => handleSelectTargetCol(column)}>{column}</DropdownItem>
                            ))}
                          
                          </DropdownMenu>
                          </Dropdown>
                          <br></br>
                          <Form>
                            <div>
                              <h4 className='my-3 py-3'>What is the type of target variable?</h4>
                              <div className="radio">
                                  <label>
                                    <input type="radio" name="options" value="Categorical" onChange={e => setTargetType("Categorical")} />
                                    Categorical
                                  </label>
                                </div>
                                <div className="radio">
                                  <label>
                                    <input type="radio" name="options" value="NonCategorical" onChange={e => setTargetType("NonCategorical")} />
                                    Non Categorical
                                  </label>
                                </div>
                            </div>
                          </Form>
                          <Button className = 'btn  btn-block' type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}} onClick = {handleSelectTargetValues}>Submit</Button>
                    </div> 
                    : gotFile === false ?  <div></div> : gotFile === true  && targetExists === false ? 
                    <div>
                      <Button className = 'btn  btn-block' type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}} onClick = {handleSelectTargetValues}>Submit</Button>
                    </div> : <div></div>}
               

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
                          <Col md = {4}
                          ></Col>
                        </Row>
                      </Card>
                    </Col>
                    </Row>
                    </div>
                  : 
                  
                  <div>
                    {/* <Message variant='success'>{"Data Uploaded Successfully"}</Message> ? } */}
                    {uploadedMsg ? <Alert variant="success" onClose={() => setUploadedMsg(false)} dismissible>
                      Data Uploaded Successfully
                    </Alert> : <></>}
                    
                    {missingValuesUpdatedMsg ? <Alert variant="success" onClose={() => setMissingValuesUpdatedMsg(false)} dismissible>
                          Missing Values are replaced by {opr}
                        </Alert>: <></> }
                    {missingValuesErrorMsg ? <Alert variant="danger" onClose={() => setMissingValuesErrorMsg(false)} dismissible>
                          {errorMsg}
                        </Alert>: <></> }

                    {outliersHandledMsg ? <Alert variant="success" onClose={() => setOutliersHandledMsg(false)} dismissible>
                          Outliers are succesfully handled by {selected_MethodHandlingOutliers} Method
                        </Alert>: <></> }
                    {outliersErrorMsg ? <Alert variant="danger" onClose={() => setOutliersErrorMsg(false)} dismissible>
                          {errorMsg}
                        </Alert>: <></> }

                    {dataEncodedMsg ? <Alert variant="success" onClose={() => setDataEncodedMsg(false)} dismissible>
                          Data has been Successfully Encoded.
                        </Alert>: <></> }
                    {dataEncodedErrorMsg ? <Alert variant="danger" onClose={() => setDataEncodedErrorMsg(false)} dismissible>
                          {errorMsg}
                        </Alert>: <></> }

                    {trainTestSplitMsg ? <Alert variant="success" onClose={() => setTrainTestSplitMsg(false)} dismissible>
                          Data has been split in {trainTestRatio} ratio
                        </Alert>: <></> }
                    {trainTestSplitErrorMsg ? <Alert variant="danger" onClose={() => setTrainTestSplitErrorMsg(false)} dismissible>
                          {errorMsg}
                        </Alert>: <></> }

                    { featureScalingMsg? <Alert variant="success" onClose={() => setFeatureScalingMsg(false)} dismissible>
                          Selected column has been feature scaled by using {featureScalingMethod}
                        </Alert>: <></> }
                    { featureScalingErrorMsg? <Alert variant="danger" onClose={() => setFeatureScalingErrorMsg(false)} dismissible>
                          {errorMsg}
                        </Alert>: <></> }
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
                      
                    <Container style={{ height: '400px', overflow: 'auto' }} className = 'my-5'>
                    <Table stickyHeader striped bordered hover >
                     
                      <TableHead className='bg-dark'>
                        <TableRow>
                          {columnsNames.map((column) => (
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
                        {showData && showData.slice(1,1000).map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((cell, index) => (
                              <td key={index}>{cell}</td>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </Container> 

                      <Row className = 'justify-content-between'>          
{/*------------------------------------ Overview Of Data --------------------------------------- */}
                      <Col><Button style = {{width: '170px'}} onClick={handleOptionClick0}>Overview Data</Button></Col>
                        <Modal
                          open={showAboutModal}
                          onClose={handleCloseModal0}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={styleOverview}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              <h2>Overview Of Data</h2>
                              <Container style={{ height: '400px', widht :'400px', overflow: 'auto' }} className = 'my-3'>
                                <Table stickyHeader striped bordered hover >
                                
                                  <TableHead className='bg-dark'>
                                    <TableRow>
                                    <TableCell
                                          className = 'text-white bg-dark'
                                          style = {{position: 'sticky', top: 0}}
                                        >
                                          Properties
                                        </TableCell>
                                      {columnsNames.map((column) => (
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
                                    {showOverviewData && showOverviewData.slice(1,1000).map((row, index) => (
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
                            
                            <Button className = 'btn  btn-block' type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}} onClick = {handleCloseModal0}>Ok</Button>
                          </Box>
                        </Modal>   
{/* ----------------------------------Handling Missing Values Modal -----------------------------------*/}
                        
                        <Col><Button style = {{width: '170px'}} onClick={handleOptionClick1}>Handling Missing values</Button></Col>
                        <Modal
                          open={showHandlingMissingModal}
                          onClose={handleCloseModal1}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              <h1>Handling Missing Values</h1>
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                              <Row>
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
                                  onChange={handleMissingValueColChange}
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
{/* ----------------------------------Handling Outliers Modal -----------------------------------*/}
                        <Col><Button style = {{width: '170px'}} onClick={handleOptionClick2}>Handling Outliers</Button></Col>
                        <Modal
                          open={showHandlingOutliersModal}
                          onClose={handleCloseModal2}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              <h1>Handling Outliers</h1>
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                              <Row>
                              <div className="container">
                                <div className="row">
                                  <div className="col-sm-12">
                                    <form>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="z-score" onChange={e => setSelected_MethodHandlingOutliers(e.target.value)} />
                                          Z-Score
                                        </label>
                                      </div>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="iqr" onChange={e => setSelected_MethodHandlingOutliers(e.target.value)} />
                                          InterQuartile Range
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
                                  onChange={handleOutlierColChange}
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
                            <Button className = 'btn  btn-block' onClick = {handlingOutliers} type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>Submit</Button>
                          </Box>
                        </Modal>
{/* ----------------------------------Handle Encoding Modal -----------------------------------*/}
                        <Col><Button style = {{width: '170px'}} onClick={handleOptionClick3}>Encoding Data</Button></Col>
                        <Modal
                          open={showEncodingDataModal}
                          onClose={handleCloseModal3}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              <h1>Encoding Data</h1>
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                              <Row>
                              <div className="container">
                                <div className="row">
                                  <div className="col-sm-12">
                                    <form>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="independent" onChange={e => setSelectedEncodingVariables(e.target.value)} />
                                          Independent
                                        </label>
                                      </div>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="dependent" onChange={e => setSelectedEncodingVariables(e.target.value)} />
                                          Dependent
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
                                  onChange={handleEncodingColChange}
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
                            <Button className = 'btn  btn-block' onClick = {handleEncoding} type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>Submit</Button>
                          </Box>
                        </Modal>    
{/* ------------------------------Split datasets------------------------------------- */}             
                        <Col><Button style = {{width: '170px'}} onClick={handleOptionClick4}>Split Datasets</Button></Col>
                        <Modal
                          open={showTrainTestModal}
                          onClose={handleCloseModal4}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              <h1>Split Datasets</h1>
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                              <Row>
                              <div className="container">
                                <div className="row">
                                  <Form>
                                    <FormGroup>
                                      <Label for="trainTestRatio">Enter the ratio</Label>
                                      <Input type="number" name="ratio" id="trainTestRatio" placeholder="0.2" onChange={e => setTrainTestRatio(e.target.value)}/>
                                    </FormGroup>
                                  </Form>
                                </div>
                              </div>
                            </Row>
                            <Row>
                      </Row>
                            </Typography>
                            <Button className = 'btn  btn-block' onClick = {handleTrainTestSplit} type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>Submit</Button>
                          </Box>
                        </Modal>
{/* ------------------------------Handle Feature Scaling------------------------------------- */}     
                        <Col><Button style = {{width: '170px'}} onClick={handleOptionClick5}>Feature Scaling</Button></Col>
                        <Modal
                          open={showFeatureScalingModal}
                          onClose={handleCloseModal5}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              <h1>Feature Scaling</h1>
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                              <Row>
                              <div className="container">
                                <div className="row">
                                  <div className="col-sm-12">
                                    <form>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="StandardScaler" onChange={e => setSelectedFeatureScalingMethod(e.target.value)} />
                                          Standardisation
                                        </label>
                                      </div>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="Normalisation" onChange={e => setSelectedFeatureScalingMethod(e.target.value)} />
                                          Normalisation
                                        </label>
                                      </div>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="MinMaxScaler" onChange={e => setSelectedFeatureScalingMethod(e.target.value)} />
                                          Min Max Scaler
                                        </label>
                                      </div>
                                      <div className="radio">
                                        <label>
                                          <input type="radio" name="options" value="RobustScaler" onChange={e => setSelectedFeatureScalingMethod(e.target.value)} />
                                          Robust Scaler
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
                                  onChange={handleFeatureScalingColChange}
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
                            <Button className = 'btn  btn-block' onClick = {handleFeatureScaling} type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>Submit</Button>
                          </Box>
                        </Modal>
{/*----------------------------------------------------------------------------- */}
                      </Row>
                    </Row>
                  </div>
              
            }
          
    </div>
  ) 
}
export default UploadFileScreen
