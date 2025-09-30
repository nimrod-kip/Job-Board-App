import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { usersAPI } from '../../services/api';

const validationSchema = Yup.object({
  full_name: Yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().matches(/^[\d\s\-\+\(\)]*$/, 'Invalid phone number format')
});

const UserForm = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await usersAPI.create(values);
      setAlert({
        show: true,
        message: 'User created successfully!',
        type: 'success'
      });
      resetForm();
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'Error creating user',
        type: 'danger'
      });
    }
    setSubmitting(false);
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
        <Formik
          initialValues={{
            full_name: '',
            email: '',
            phone: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="full_name"
                  value={values.full_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.full_name && errors.full_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.full_name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.phone && errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Create User
              </Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default UserForm;