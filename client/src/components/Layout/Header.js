import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Job Board</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/jobs">
              <Nav.Link>Jobs</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/companies">
              <Nav.Link>Companies</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/users">
              <Nav.Link>Users</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/applications">
              <Nav.Link>Applications</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;