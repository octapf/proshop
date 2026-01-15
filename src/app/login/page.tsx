
'use client';

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' // Remove
import LinkNext from 'next/link'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '@/components/Message'
import Loader from '@/components/Loader'
import FormContainer from '@/components/FormContainer'
import { login } from '@/redux/actions/userActions'
import { useRouter, useSearchParams } from 'next/navigation';

const LoginScreen = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

    const router = useRouter();
    const searchParams = useSearchParams();

	const dispatch = useDispatch()

	const userLogin = useSelector((state: any) => state.userLogin)
	const { loading, error, userInfo } = userLogin

    const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/';

	useEffect(() => {
		if (userInfo) {
            // @ts-ignore
			router.push(redirect)
		}
	}, [router, userInfo, redirect])

	const submitHandler = (e: any) => {
		e.preventDefault()
        // @ts-ignore
		dispatch(login(email, password))
	}

	return (
		<FormContainer>
			<h1>Sign In</h1>
			{error && <Message variant='danger'>{error}</Message>}
			{loading && <Loader />}
			<Form onSubmit={submitHandler}>
				<Form.Group controlId='email'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Button type='submit' variant='primary'>
					Sign In
				</Button>
			</Form>

			<Row className='py-3'>
				<Col>
					New Customer?{' '}
                    <LinkNext href={redirect ? `/register?redirect=${redirect}` : '/register'}>
                        Register
                    </LinkNext>
				</Col>
			</Row>
		</FormContainer>
	)
}

export default LoginScreen
