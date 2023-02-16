import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Card, Pagination } from 'react-bootstrap';
import axios from 'axios';

const DataTable: React.FC = () => {

  const [scannedData, setScannedData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [scanningInterval, setScanningInterval] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [pageItems, setPageItems] = useState<any[]>([]);
  const [pageTotal, setPageTotal] = useState(0);

  const scanClick = () => {
    axios('http://localhost:8081/scrape').then(res => {
      console.log(res.data);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      console.log('scanning clicked');
      // scanningInterval = setInterval()
    });
  };

  const getData = () => {
    axios(`http://localhost:8081/getData?page=${page}`).then(res => {
      setScannedData(res.data.data);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    })
  };

  const changePage = (p: number) => {
    setPage(p);
    getData();
  }

  const makePageItems = () => {
    if (scannedData.length) {
      const dataItem: any = scannedData[0];
      const total = dataItem.total_count;
      const items = [];
      for(let i=page-1 ?? 0; i<(page+5 < total / 20 ? page+5 : (total / 20) - page); i++) {
        items.push(
          <Pagination.Item onClick={() => {changePage(i);}} key={i} active={i === page}>{i}</Pagination.Item>
        );
      }
      setPageItems(items);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    makePageItems();
  }, [scannedData])

  return (
    <div className="DataTable">
       <Row className="HeaderButton justify-content-md-center">
        <Col className="ScanButtonBox">
          <Button onClick={scanClick} variant='primary' size='lg'>Scan Sreality Flats</Button>
        </Col>
      </Row>

      <Row>
        <Col className="pageBox">
          <br />
          <Pagination>
            {pageItems}
          </Pagination>
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col className="adsBox">
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
                      <Card className="adCard" key={data.ad_id}>
                        <Card.Body>
                          <Card.Title>{data.name}</Card.Title>
                          <Card.Subtitle>{data.price}</Card.Subtitle>
                          <Card.Text>{data.location}</Card.Text>
                        </Card.Body>
                      </Card>
                    );
                  });
                }
              }
            })()
          }
        </Col>
      </Row>
      <Row>
        <Col className="pageBox">
          <br />
          <Pagination>
            {pageItems}
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

export default DataTable;
