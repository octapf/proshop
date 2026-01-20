'use client';
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import axios from 'axios';

const Footer = () => {
  const t = useTranslations('Footer');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submitHandler = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post('/api/newsletter', { email });
      setMessage('Thanks for subscribing!');
      setEmail('');
    } catch (error: any) {
      setMessage(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Something went wrong'
      );
    }
  };

  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <Container>
        <Row>
          <Col md={3} className="mb-4">
            <h5 className="text-uppercase mb-3 fw-bold text-white">{t('about')}</h5>
            <p className="text-secondary small">{t('aboutText')}</p>
          </Col>
          <Col md={3} className="mb-4">
            <h5 className="text-uppercase mb-3 fw-bold text-white">{t('links')}</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/" className="text-secondary text-decoration-none hover-light">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/cart" className="text-secondary text-decoration-none hover-light">
                  Cart
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/login" className="text-secondary text-decoration-none hover-light">
                  Login
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-4">
            <h5 className="text-uppercase mb-3 fw-bold text-white">{t('contact')}</h5>
            <ul className="list-unstyled text-secondary">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2 text-primary"></i> {t('address')}
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope me-2 text-primary"></i> {t('email')}
              </li>
              <li className="mb-2">
                <i className="fas fa-phone me-2 text-primary"></i> +1 234 567 890
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-4">
            <h5 className="text-uppercase mb-3 fw-bold text-white">Newsletter</h5>
            <p className="text-secondary small">Subscribe to get the latest updates and offers.</p>
            <Form onSubmit={submitHandler}>
              <InputGroup className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Enter your email"
                  className="bg-dark text-light border-secondary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button variant="primary" type="submit">
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </InputGroup>
            </Form>
            {message && (
              <small className={message.includes('Thanks') ? 'text-success' : 'text-danger'}>
                {message}
              </small>
            )}
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3 border-top border-secondary text-secondary small">
            &copy; {new Date().getFullYear()} ProShop. All Rights Reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
