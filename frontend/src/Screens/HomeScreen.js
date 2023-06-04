import React from 'react'
import { Button, Col, Image, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import UploadFile from './UploadFileScreen'

function HomeScreen() {
  return (
    <div>
        <Row className='my-5 py-5'>
            <Col md = {6}>
                <Row>
                    <h1>Turing</h1>
                    <h4 >An Automated Machine Learning Platform</h4>
                    <p>An automated machine learning (Turing) platform is a software system that automates the process of building machine learning models. AutoML platforms use algorithms and techniques to search for the best combination of model architecture, hyperparameters, and data preprocessing techniques that can achieve optimal performance on a given dataset.</p>

                    <p>Turing platform typically provides a user-friendly interface that allows users to upload their data and specify the problem they want to solve, such as regression or classification. The platform then automatically explores the space of possible models and generates the best model based on the specified criteria, such as accuracy, precision, recall, or F1 score. </p>

                    <p>Turing platforms can significantly reduce the time and effort required to build machine learning models, especially for users who do not have extensive knowledge of machine learning. </p>
                </Row>
                <Row className='my-3'>
                    <Col md = {4}>
                        <LinkContainer to='/upload'>
                            <Button className = 'btn  btn-block' type="button" style = {{backgroundColor : 'rgb(53,58,63)'}}>Try Turing <i className="fa-solid fa-upload mx-2"></i></Button>
                        </LinkContainer>    
                    </Col>A
                </Row>
            </Col>
            <Col md = {6}><Image src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZGF0YSUyMHNjaWVuY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60' fluid /></Col>
        </Row>
    </div>
  )
}

export default HomeScreen