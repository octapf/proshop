'use client';

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '@/components/Message'
import Loader from '@/components/Loader'
import FormContainer from '@/components/FormContainer'
import { register } from '@/redux/actions/userActions'
import { useRouter, useSearchParams } from 'next/navigation';

const RegisterContent = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState<string | null>(null)

    const router = useRouter();
    const searchParams = useSearchParams();

	const dispatch = useDispatch()

	const userRegister = useSelector((state: any) => state.userRegister)
	const { loading, error, userInfo } = userRegister
    
    // Check userLogin state as well in case they are logged in
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo: userInfoLogin } = userLogin;


    const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/';

	useEffect(() => {
		if (userInfo || userInfoLogin) {
             // @ts-ignore
			router.push(redirect)
		}
	}, [router, userInfo, userInfoLogin, redirect])

	const submitHandler = (e: any) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			setMessage('Passwords do not match')
		} else {
             // @ts-ignore
			dispatch(register(name, email, password))
		}
	}

	return (
		<FormContainer>
			<h1>Sign Up</h1>
			{message && <Message variant='danger'>{message}</Message>}
			{error && <Message variant='danger'>{error}</Message>}
			{loading && <Loader />}
			<Form onSubmit={submitHandler}>
				<Form.Group controlId='name'>
					<Form.Label>Name</Form.Label>
					<Form.Control
						type='name'
						placeholder='Enter name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					></Form.Control>
				</Form.Group>

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

				<Form.Group controlId='confirmPassword'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Confirm password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Button type='submit' variant='primary'>
					Register
				</Button>
			</Form>

			<Row className='py-3'>
				<Col>
					Have an Account?{' '}
                    <Link href={redirect ? `/login?redirect=${redirect}` : '/login'}>
                        Login
                    </Link>
				</Col>
			</Row>
		</FormContainer>
	)
}

const RegisterScreen = () => {
    return (
        <Suspense fallback={<Loader />}>
            <RegisterContent />
        </Suspense>
    )
}

export default RegisterScreen
