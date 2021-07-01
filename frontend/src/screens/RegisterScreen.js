import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { register } from '../actions/userActions'
import { Form, Row, Col, Button } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { Link } from 'react-router-dom'

const RegisterScreen = ({ location, history }) => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState(null)

	const dispatch = useDispatch()

	const userRegister = useSelector((state) => state.userRegister)

	const { loading, userInfo, error } = userRegister

	const redirect = location.search ? location.search.split('=')[1] : null

	useEffect(() => {
		if (userInfo) {
			history.push(redirect)
		}
	}, [redirect, history, userInfo])

	const submitHandler = (e) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			setMessage('Passwords do not match')
		} else {
			dispatch(register(name, email, password))
			setMessage(null)
		}
	}

	return (
		<FormContainer>
			<h1>Sing Up</h1>

			<Form onSubmit={submitHandler}>
				<Form.Group controlId='name'>
					<Form.Label>User Name</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter name'
						onChange={(e) => setName(e.target.value)}
						value={name}
					/>
				</Form.Group>

				<Form.Group controlId='email'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</Form.Group>

				<Form.Group controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
				</Form.Group>

				<Form.Group controlId='confirmPassword'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Confirm password'
						onChange={(e) => setConfirmPassword(e.target.value)}
						value={confirmPassword}
					/>
				</Form.Group>

				<Button type='submit' variant='primary'>
					Register
				</Button>
			</Form>

			<Row className='py-3'>
				<Col>
					Have an account?{' '}
					<Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
						Login
					</Link>
				</Col>
			</Row>
			{error && <Message variant='danger'>{error}</Message>}
			{message && <Message variant='danger'>{message}</Message>}
			{loading && <Loader />}
		</FormContainer>
	)
}

export default RegisterScreen
