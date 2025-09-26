import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ApplicationForm from '../components/Applications/ApplicationForm';
import ApplicationList from '../components/Applications/ApplicationList';

const Applications = () => {
  return (
    <div>
      <h1 className="mb-4">Applications Management</h1>
      <Row className="g-4">
        <Col lg={5}>
          <ApplicationForm />
        </Col>
        <Col lg={7}>
          <ApplicationList />
        </Col>
      </Row>
    </div>
  );
};

export default Applications;