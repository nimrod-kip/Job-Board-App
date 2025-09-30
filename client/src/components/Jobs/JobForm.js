import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { jobsAPI, companiesAPI } from '../../services/api';

const validationSchema = Yup.object({
  title: Yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
  location: Yup.string(),
  salary: Yup.number().min(0, 'Salary must be positive').integer('Salary must be a whole number'),
  description: Yup.string(),
  company_id: Yup.number().required('Company is required')
});

const JobForm = ({ job, onSave }) => {
  const [companies, setCompanies] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadCompanies();
  }, []);

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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (job) {
        await jobsAPI.update(job.id, values);
        setAlert({
          show: true,
          message: 'Job updated successfully!',
          type: 'success'
        });
        onSave && onSave();
      } else {
        await jobsAPI.create(values);
        setAlert({
          show: true,
          message: 'Job created successfully!',
          type: 'success'
        });
        resetForm();
      }
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || `Error ${job ? 'updating' : 'creating'} job`,
        type: 'danger'
      });
    }
    setSubmitting(false);
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
        <Formik
          initialValues={{
            title: job?.title || '',
            location: job?.location || '',
            salary: job?.salary || '',
            description: job?.description || '',
            company_id: job?.company_id || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Job Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.title && errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={values.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      value={values.salary}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.salary && errors.salary}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.salary}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company *</Form.Label>
                    <Form.Select
                      name="company_id"
                      value={values.company_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.company_id && errors.company_id}
                    >
                      <option value="">Select a company</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.company_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {job ? 'Update Job' : 'Create Job'}
              </Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default JobForm;