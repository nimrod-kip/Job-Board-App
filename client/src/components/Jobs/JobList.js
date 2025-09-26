import React, { useState, useEffect } from 'react';
import { Table, Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data);
    } catch (error) {
      setError('Error loading jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.delete(id);
        setJobs(jobs.filter(job => job.id !== id));
      } catch (error) {
        setError('Error deleting job');
      }
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4>Jobs ({jobs.length})</h4>
        <Button as={Link} to="/jobs/new" variant="success">
          Add New Job
        </Button>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>
                  <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                </td>
                <td>{job.company?.name}</td>
                <td>{job.location || '-'}</td>
                <td>
                  {job.salary ? (
                    <Badge bg="success">${job.salary.toLocaleString()}</Badge>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <Button
                    as={Link}
                    to={`/jobs/${job.id}/edit`}
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default JobList;