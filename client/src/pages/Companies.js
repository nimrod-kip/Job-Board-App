import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CompanyForm from '../components/Companies/CompanyForm';
import CompanyList from '../components/Companies/CompanyList';

const Companies = () => {
  return (
    <div>
      <h1 className="mb-4">Companies Management</h1>
      <Row className="g-4">
        <Col lg={4}>
          <CompanyForm />
        </Col>
        <Col lg={8}>
          <CompanyList />
        </Col>
      </Row>
    </div>
  );
};

export default Companies;