'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="py-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6} lg={5}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
