import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { getUser, updateUser } from '../actions/userActions'
import { Link } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import * as userActions from '../constants/userConstants'

const UserEditScreen = ({ history, match }) => {
	const userId = match.params.id
	const dispatch = useDispatch()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [isAdmin, setIsAdmin] = useState(false)

	const { userInfo } = useSelector((state) => state.userLogin)

	const {
		user,
		loading: userGetLoading,
		error: userGetError,
	} = useSelector((state) => state.userGet)
	const {
		userUpdate,
		error: userUpdateError,
		success: userUpdateSuccess,
	} = useSelector((state) => state.userUpdate)

	useEffect(() => {
		if (!userInfo || !userInfo.isAdmin) {
			history.push('/login')
		} else if (!user || user._id !== userId) {
			dispatch(getUser(userId))
		} else {
			setName(user.name)
			setEmail(user.email)
			setIsAdmin(user.isAdmin)
		}
	}, [dispatch, user, userId, history])

	const submitHandler = (e) => {
		e.preventDefault()
		if (user && window.confirm('Are you sure?')) {
			dispatch(updateUser({ _id: userId, name, email, isAdmin }))
			dispatch(getUser(userId))
		}
	}

	return (
		<>
			<Link to='/admin/userlist' className='btn btn-light btn-sm py-3'>
				Go Back
			</Link>

			{userGetLoading ? (
				<Loader />
			) : userGetError ? (
				<Message variant='danger'>{userGetError}</Message>
			) : (
				<FormContainer>
					<h2 className='py-3'>Edit User</h2>
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='name'
								placerholder='Enter name'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId='email'>
							<Form.Label>Email address</Form.Label>
							<Form.Control
								type='email'
								placerholder='Enter email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId='isadmin'>
							<Form.Check
								type='switch'
								label='Admin'
								id='admin-switch'
								checked={isAdmin}
								onChange={(e) => setIsAdmin(e.target.checked)}
							/>
						</Form.Group>

						<Button className='my-3' type='submit' variant='primary'>
							Update
						</Button>

						{userUpdateError ? (
							<Message variant='danger'>{userUpdateError}</Message>
						) : (
							userUpdateSuccess && (
								<Message variant='success'>User updated</Message>
							)
						)}
					</Form>
				</FormContainer>
			)}
		</>
	)
}

export default UserEditScreen
