import React, { useState, useEffect } from 'react';
import { Table, Card, Spinner, Alert } from 'react-bootstrap';
import { companiesAPI } from '../../services/api';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await companiesAPI.getAll();
      setCompanies(response.data);
    } catch (error) {
      setError('Error loading companies');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card>
      <Card.Header>
        <h4>Companies ({companies.length})</h4>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Website</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => (
              <tr key={company.id}>
                <td>{company.id}</td>
                <td>{company.name}</td>
                <td>
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      {company.website}
                    </a>
                  ) : '-'}
                </td>
                <td>{company.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default CompanyList;