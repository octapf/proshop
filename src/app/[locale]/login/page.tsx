'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '@/components/Message';
import Loader from '@/components/Loader';
import FormContainer from '@/components/FormContainer';
import { login } from '@/redux/actions/userActions';
import { useRouter, useSearchParams } from 'next/navigation';

import { saveGuestInfo } from '@/redux/actions/cartActions';

export const LoginContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Guest checkout state
  const [guestEmail, setGuestEmail] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useDispatch();

  const userLogin = useSelector((state: any) => state.userLogin);
  const { loading, error, userInfo, validationErrors } = userLogin;

  const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/';

  useEffect(() => {
    if (userInfo) {
      // @ts-ignore
      router.push(redirect);
    }
  }, [router, userInfo, redirect]);

  const submitHandler = (e: any) => {
    e.preventDefault();
    // @ts-ignore
    dispatch(login(email, password));
  };

  const guestSubmitHandler = (e: any) => {
    e.preventDefault();
    if (guestEmail) {
      // @ts-ignore
      dispatch(saveGuestInfo({ email: guestEmail }));
      router.push('/shipping');
    }
  };

  return (
    <FormContainer>
      <Card className="shadow-lg rounded-4 border-0 overflow-hidden">
        <Card.Body className="p-5">
          <h1 className="text-center mb-4 fw-bold font-poppins">Sign In</h1>
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label className="fw-semibold">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-pill px-3 py-2 border-light shadow-sm bg-light"
                isInvalid={!!validationErrors?.email}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {validationErrors?.email?.[0]}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password" className="mb-4">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-pill px-3 py-2 border-light shadow-sm bg-light"
                isInvalid={!!validationErrors?.password}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {validationErrors?.password?.[0]}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 rounded-pill py-2 shadow fw-bold"
            >
              Sign In
            </Button>
          </Form>

          {redirect === 'shipping' && (
            <>
              <div className="text-center my-3 text-muted">OR</div>
              <Button
                variant="outline-success"
                className="w-100 rounded-pill py-2 fw-bold"
                onClick={() => setShowGuestForm(!showGuestForm)}
              >
                Continue as Guest
              </Button>

              {showGuestForm && (
                <Form
                  onSubmit={guestSubmitHandler}
                  className="mt-4 p-3 border rounded bg-light anim-fade-in"
                >
                  <h5 className="text-center mb-3">Guest Checkout</h5>
                  <Form.Group controlId="guestEmail" className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="rounded-3"
                    ></Form.Control>
                  </Form.Group>
                  <Button type="submit" variant="dark" className="w-100 rounded-3">
                    Proceed to Shipping <i className="fas fa-arrow-right ms-2"></i>
                  </Button>
                </Form>
              )}
            </>
          )}
        </Card.Body>
        <Card.Footer className="text-center py-4 bg-light border-0">
          <span className="text-muted">New Customer? </span>
          <Link
            href={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="text-decoration-none fw-bold"
          >
            Register
          </Link>
        </Card.Footer>
      </Card>
    </FormContainer>
  );
};

const LoginScreen = () => {
  return (
    <Suspense fallback={<Loader />}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginScreen;
