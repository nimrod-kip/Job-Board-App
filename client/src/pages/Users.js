import React from 'react';
import { Row, Col } from 'react-bootstrap';
import UserForm from '../components/Users/UserForm';
import UserList from '../components/Users/UserList';

const Users = () => {
  return (
    <div>
      <h1 className="mb-4">Users Management</h1>
      <Row className="g-4">
        <Col lg={4}>
          <UserForm />
        </Col>
        <Col lg={8}>
          <UserList />
        </Col>
      </Row>
    </div>
  );
};

export default Users;