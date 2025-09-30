import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { companiesAPI } from '../../services/api';

const validationSchema = Yup.object({
  name: Yup.string().required('Company name is required'),
  website: Yup.string().url('Must be a valid URL'),
  description: Yup.string()
});

const CompanyForm = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await companiesAPI.create(values);
      setAlert({
        show: true,
        message: 'Company created successfully!',
        type: 'success'
      });
      resetForm();
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'Error creating company',
        type: 'danger'
      });
    }
    setSubmitting(false);
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
        <Formik
          initialValues={{
            name: '',
            website: '',
            description: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Company Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.name && errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="url"
                  name="website"
                  value={values.website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://example.com"
                  isInvalid={touched.website && errors.website}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.website}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Create Company
              </Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default CompanyForm;