import React, { useState, useEffect } from 'react';
import { Table, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { applicationsAPI } from '../../services/api';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await applicationsAPI.getAll();
      setApplications(response.data);
    } catch (error) {
      setError('Error loading applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'submitted': return 'primary';
      case 'reviewed': return 'info';
      case 'rejected': return 'danger';
      case 'hired': return 'success';
      default: return 'secondary';
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card>
      <Card.Header>
        <h4>Applications ({applications.length})</h4>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Job</th>
              <th>Company</th>
              <th>Expected Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.user?.full_name}</td>
                <td>{app.job?.title}</td>
                <td>{app.job?.company?.name}</td>
                <td>
                  {app.expected_salary ? (
                    `$${app.expected_salary.toLocaleString()}`
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <Badge bg={getStatusVariant(app.status)}>
                    {app.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ApplicationList;