import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { companiesAPI } from '../../services/api';

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: ''
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
      await companiesAPI.create(formData);
      setAlert({
        show: true,
        message: 'Company created successfully!',
        type: 'success'
      });
      setFormData({ name: '', website: '', description: '' });
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'Error creating company',
        type: 'danger'
      });
    }
  };

  return (
    <Card>
      <Card.Header>
        <h4>Create New Company</h4>
      </Card.Header>
      <Card.Body>
        {alert.show && (
          <Alert variant={alert.type} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Company Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Website</Form.Label>
            <Form.Control
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Create Company
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CompanyForm;