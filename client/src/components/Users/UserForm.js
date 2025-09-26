import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { usersAPI } from '../../services/api';

const UserForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.create(formData);
      setAlert({
        show: true,
        message: 'User created successfully!',
        type: 'success'
      });
      setFormData({ full_name: '', email: '', phone: '' });
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'Error creating user',
        type: 'danger'
      });
    }
  };

  return (
    <Card>
      <Card.Header>
        <h4>Create New User</h4>
      </Card.Header>
      <Card.Body>
        {alert.show && (
          <Alert variant={alert.type} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name *</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              minLength="2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Create User
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UserForm;