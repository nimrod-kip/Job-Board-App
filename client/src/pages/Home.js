import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-4">Welcome to Job Board</h1>
        <p className="lead">Find your dream job or post opportunities</p>
      </div>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Jobs</Card.Title>
              <Card.Text>
                Browse available job opportunities and find your next career move.
              </Card.Text>
              <Button as={Link} to="/jobs" variant="primary">
                View Jobs
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Companies</Card.Title>
              <Card.Text>
                Explore companies and learn about their culture and opportunities.
              </Card.Text>
              <Button as={Link} to="/companies" variant="primary">
                View Companies
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Users</Card.Title>
              <Card.Text>
                Manage job seekers and their profiles in the system.
              </Card.Text>
              <Button as={Link} to="/users" variant="primary">
                View Users
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Applications</Card.Title>
              <Card.Text>
                Track job applications and their status throughout the hiring process.
              </Card.Text>
              <Button as={Link} to="/applications" variant="primary">
                View Applications
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;