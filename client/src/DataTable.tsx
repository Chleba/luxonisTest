import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const DataTable: React.FC = () => {

  const [scannedData, setScannedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanningInterval, setScanningInterval] = useState<any | null>(null);
  const [page, setPage] = useState(1);

  const scanClick = () => {
    axios('http://localhost:8081/scrape').then(res => {
      console.log(res.data);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      console.log('scanning clicked');
      // scanningInterval = setInterval()
    });
  }

  const getData = () => {
    axios(`http://localhost:8081/getData?page=${page}`).then(res => {
      setScannedData(res.data.data);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <div className="DataTable">
       <Row className="HeaderButton justify-content-md-center">
        <Col className="ScanButtonBox">
          <Button onClick={scanClick} variant='primary' size='lg'>Scan Sreality Flats</Button>
        </Col>
      </Row>
      <Row>
        {
          (() => {
            if (loading) { 
              return (<Col><span>Loading...</span></Col>);
            } else {
              if (!scannedData.length) {
                return (<Col><Button variant='warning' onClick={getData}>Refresh Data</Button></Col>);
              } else {
                return scannedData.map((data: any) => {
                  return (
                    <Col>
                      <Card className="adCard">
                        <Card.Body>
                          <Card.Title>{data.name}</Card.Title>
                          <Card.Subtitle>{data.price}</Card.Subtitle>
                          <Card.Text>{data.location}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                });
              }
            }
          })()
        }
      </Row>
    </div>
  );
};

export default DataTable;
