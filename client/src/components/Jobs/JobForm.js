import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { jobsAPI, companiesAPI } from '../../services/api';

const JobForm = ({ job, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salary: '',
    description: '',
    company_id: ''
  });
  const [companies, setCompanies] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadCompanies();
    if (job) {
      setFormData({
        title: job.title || '',
        location: job.location || '',
        salary: job.salary || '',
        description: job.description || '',
        company_id: job.company_id || ''
      });
    }
  }, [job]);

  const loadCompanies = async () => {
    try {
      const response = await companiesAPI.getAll();
      setCompanies(response.data);
    } catch (error) {
      setAlert({
        show: true,
        message: 'Error loading companies',
        type: 'danger'
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (job) {
        await jobsAPI.update(job.id, formData);
        setAlert({
          show: true,
          message: 'Job updated successfully!',
          type: 'success'
        });
        onSave && onSave();
      } else {
        await jobsAPI.create(formData);
        setAlert({
          show: true,
          message: 'Job created successfully!',
          type: 'success'
        });
        setFormData({
          title: '',
          location: '',
          salary: '',
          description: '',
          company_id: ''
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || `Error ${job ? 'updating' : 'creating'} job`,
        type: 'danger'
      });
    }
  };

  return (
    <Card>
      <Card.Header>
        <h4>{job ? 'Edit Job' : 'Create New Job'}</h4>
      </Card.Header>
      <Card.Body>
        {alert.show && (
          <Alert variant={alert.type} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Job Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  minLength="3"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Company *</Form.Label>
                <Form.Select
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {job ? 'Update Job' : 'Create Job'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default JobForm;