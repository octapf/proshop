'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '@/components/Message';
import Loader from '@/components/Loader';
import FormContainer from '@/components/FormContainer';
import { register } from '@/redux/actions/userActions';
import { useRouter, useSearchParams } from 'next/navigation';

export const RegisterContent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useDispatch();

  const userRegister = useSelector((state: any) => state.userRegister);
  const { loading, error, userInfo, validationErrors } = userRegister;

  // Check userLogin state as well in case they are logged in
  const userLogin = useSelector((state: any) => state.userLogin);
  const { userInfo: userInfoLogin } = userLogin;

  const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/';

  useEffect(() => {
    if (userInfo || userInfoLogin) {
      // @ts-ignore
      router.push(redirect);
    }
  }, [router, userInfo, userInfoLogin, redirect]);

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      // @ts-ignore
      dispatch(register(name, email, password));
    }
  };

  return (
    <FormContainer>
      <Card className="shadow-lg rounded-4 border-0 overflow-hidden">
        <Card.Body className="p-5">
          <h1 className="text-center mb-4 fw-bold font-poppins">Sign Up</h1>
          {message && <Message variant="danger">{message}</Message>}
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" htmlFor="name">
                Name
              </Form.Label>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`form-control rounded-pill px-3 py-2 border-light shadow-sm bg-light ${
                  validationErrors?.name ? 'is-invalid' : ''
                }`}
                id="name"
              />
              {validationErrors?.name && (
                <div className="invalid-feedback d-block ms-2">{validationErrors.name[0]}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" htmlFor="email">
                Email Address
              </Form.Label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-control rounded-pill px-3 py-2 border-light shadow-sm bg-light ${
                  validationErrors?.email ? 'is-invalid' : ''
                }`}
                id="email"
              />
              {validationErrors?.email && (
                <div className="invalid-feedback d-block ms-2">{validationErrors.email[0]}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" htmlFor="password">
                Password
              </Form.Label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-control rounded-pill px-3 py-2 border-light shadow-sm bg-light ${
                  validationErrors?.password ? 'is-invalid' : ''
                }`}
                id="password"
              />
              {validationErrors?.password && (
                <div className="invalid-feedback d-block ms-2">{validationErrors.password[0]}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold" htmlFor="confirmPassword">
                Confirm Password
              </Form.Label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control rounded-pill px-3 py-2 border-light shadow-sm bg-light"
                id="confirmPassword"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 rounded-pill py-2 shadow fw-bold"
            >
              Register
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center py-4 bg-light border-0">
          <span className="text-muted">Have an Account? </span>
          <Link
            href={redirect ? `/login?redirect=${redirect}` : '/login'}
            className="text-decoration-none fw-bold"
          >
            Login
          </Link>
        </Card.Footer>
      </Card>
    </FormContainer>
  );
};

const RegisterScreen = () => {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterContent />
    </Suspense>
  );
};

export default RegisterScreen;
