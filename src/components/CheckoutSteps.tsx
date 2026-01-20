'use client';
import React from 'react';
import { Nav, Row } from 'react-bootstrap';
import Link from 'next/link';

const CheckoutSteps = ({ step1, step2, step3, step4 }: any) => {
  return (
    <Nav className="justify-content-center mb-5 align-items-center checkout-steps">
      <Nav.Item>
        {step1 ? (
          <Nav.Link as={Link} href="/login" className="fw-bold text-success">
            <i className="fas fa-check-circle me-1"></i> Sign In
          </Nav.Link>
        ) : (
          <Nav.Link disabled className="text-muted">
            Sign In
          </Nav.Link>
        )}
      </Nav.Item>

      <div className={`step-line ${step2 ? 'active' : ''}`}></div>

      <Nav.Item>
        {step2 ? (
          <Nav.Link as={Link} href="/shipping" className="fw-bold">
            {step3 ? (
              <i className="fas fa-check-circle me-1 text-success"></i>
            ) : (
              <span className="step-number me-1">2</span>
            )}
            Shipping
          </Nav.Link>
        ) : (
          <Nav.Link disabled className="text-muted">
            Shipping
          </Nav.Link>
        )}
      </Nav.Item>

      <div className={`step-line ${step3 ? 'active' : ''}`}></div>

      <Nav.Item>
        {step3 ? (
          <Nav.Link as={Link} href="/payment" className="fw-bold">
            {step4 ? (
              <i className="fas fa-check-circle me-1 text-success"></i>
            ) : (
              <span className="step-number me-1">3</span>
            )}
            Payment
          </Nav.Link>
        ) : (
          <Nav.Link disabled className="text-muted">
            Payment
          </Nav.Link>
        )}
      </Nav.Item>

      <div className={`step-line ${step4 ? 'active' : ''}`}></div>

      <Nav.Item>
        {step4 ? (
          <Nav.Link as={Link} href="/placeorder" className="fw-bold text-primary">
            <span className="step-number active me-1">4</span> Place Order
          </Nav.Link>
        ) : (
          <Nav.Link disabled className="text-muted">
            Place Order
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
