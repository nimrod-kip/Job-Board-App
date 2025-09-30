import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { applicationsAPI, usersAPI, jobsAPI } from '../../services/api';

const validationSchema = Yup.object({
  user_id: Yup.number().required('User is required'),
  job_id: Yup.number().required('Job is required'),
  resume_url: Yup.string().url('Must be a valid URL'),
  cover_letter: Yup.string().max(5000, 'Cover letter must be less than 5000 characters'),
  expected_salary: Yup.number().min(0, 'Salary must be positive').integer('Salary must be a whole number'),
  status: Yup.string().oneOf(['submitted', 'reviewed', 'rejected', 'hired'])
});

const ApplicationForm = () => {
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await applicationsAPI.create(values);
      setAlert({
        show: true,
        message: 'Application submitted successfully!',
        type: 'success'
      });
      resetForm();
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'Error submitting application',
        type: 'danger'
      });
    }
    setSubmitting(false);
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
        <Formik
          initialValues={{
            user_id: '',
            job_id: '',
            resume_url: '',
            cover_letter: '',
            expected_salary: '',
            status: 'submitted'
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>User *</Form.Label>
                    <Form.Select
                      name="user_id"
                      value={values.user_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.user_id && errors.user_id}
                    >
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.full_name} ({user.email})
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.user_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Job *</Form.Label>
                    <Form.Select
                      name="job_id"
                      value={values.job_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.job_id && errors.job_id}
                    >
                      <option value="">Select a job</option>
                      {jobs.map(job => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.job_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Resume URL</Form.Label>
                <Form.Control
                  type="url"
                  name="resume_url"
                  value={values.resume_url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://example.com/resume.pdf"
                  isInvalid={touched.resume_url && errors.resume_url}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.resume_url}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Expected Salary</Form.Label>
                <Form.Control
                  type="number"
                  name="expected_salary"
                  value={values.expected_salary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.expected_salary && errors.expected_salary}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.expected_salary}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cover Letter</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="cover_letter"
                  value={values.cover_letter}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.cover_letter && errors.cover_letter}
                />
                <Form.Text className="text-muted">
                  {values.cover_letter.length}/5000 characters
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.cover_letter}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="submitted">Submitted</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Submit Application
              </Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default ApplicationForm;