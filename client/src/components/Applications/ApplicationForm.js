import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { applicationsAPI, usersAPI, jobsAPI } from '../../services/api';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    job_id: '',
    resume_url: '',
    cover_letter: '',
    expected_salary: '',
    status: 'submitted'
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadUsers();
    loadJobs();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      setAlert({
        show: true,
        message: 'Error loading users',
        type: 'danger'
      });
    }
  };

  const loadJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data);
    } catch (error) {
      setAlert({
        show: true,
        message: 'Error loading jobs',
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
      await applicationsAPI.create(formData);
      setAlert({
        show: true,
        message: 'Application submitted successfully!',
        type: 'success'
      });
      setFormData({
        user_id: '',
        job_id: '',
        resume_url: '',
        cover_letter: '',
        expected_salary: '',
        status: 'submitted'
      });
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'Error submitting application',
        type: 'danger'
      });
    }
  };

  return (
    <Card>
      <Card.Header>
        <h4>Submit Application</h4>
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
                <Form.Label>User *</Form.Label>
                <Form.Select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Job *</Form.Label>
                <Form.Select
                  name="job_id"
                  value={formData.job_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a job</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.company?.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Resume URL</Form.Label>
            <Form.Control
              type="url"
              name="resume_url"
              value={formData.resume_url}
              onChange={handleChange}
              placeholder="https://example.com/resume.pdf"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Expected Salary</Form.Label>
            <Form.Control
              type="number"
              name="expected_salary"
              value={formData.expected_salary}
              onChange={handleChange}
              min="0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover Letter</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleChange}
              maxLength="5000"
            />
            <Form.Text className="text-muted">
              {formData.cover_letter.length}/5000 characters
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="submitted">Submitted</option>
              <option value="reviewed">Reviewed</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit Application
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ApplicationForm;