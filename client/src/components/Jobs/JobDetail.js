import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import { jobsAPI } from '../../services/api';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJob = useCallback(async () => {
    try {
      const response = await jobsAPI.getById(id);
      setJob(response.data);
    } catch (error) {
      setError('Error loading job details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);



  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!job) return <Alert variant="warning">Job not found</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{job.title}</h2>
        <Button as={Link} to="/jobs" variant="outline-secondary">
          Back to Jobs
        </Button>
      </div>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <h5>Job Details</h5>
              <p><strong>Company:</strong> {job.company?.name}</p>
              <p><strong>Location:</strong> {job.location || 'Not specified'}</p>
              <p><strong>Salary:</strong> {job.salary ? `$${job.salary.toLocaleString()}` : 'Not specified'}</p>
              <p><strong>Description:</strong></p>
              <p>{job.description || 'No description provided.'}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h6>Quick Actions</h6>
            </Card.Header>
            <Card.Body>
              <Button as={Link} to={`/jobs/${job.id}/edit`} variant="primary" className="w-100 mb-2">
                Edit Job
              </Button>
              <Button as={Link} to="/applications" variant="success" className="w-100">
                Apply for Job
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default JobDetail;