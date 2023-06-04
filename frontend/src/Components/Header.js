import React from 'react'
import { Nav } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap'

function Header() {
  return (
    <header>
        <Navbar bg="dark" variant = "dark" expand="lg" collapseOnSelect>
            <Container>
                <LinkContainer to = '/'>
                    <Navbar.Brand>Turing</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <LinkContainer to = '/upload'>
                        <Nav.Link><i className="fa-solid fa-upload mx-2"></i>Upload Data</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to = '/visualise'>
                        <Nav.Link>Visualise</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to = '/modelTraining'>
                        <Nav.Link>Model Training</Nav.Link>
                    </LinkContainer>
                    {/* <LinkContainer to = '/autoEDA'>
                        <Nav.Link>Auto EDA</Nav.Link>
                    </LinkContainer> */}
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header
