
'use client';
import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '@/components/Message'
import Loader from '@/components/Loader'
import FormContainer from '@/components/FormContainer'
import { getUserDetails, updateUser } from '@/redux/actions/userActions'
import { USER_UPDATE_RESET } from '@/redux/constants/userConstants'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

const UserEditScreen = () => {
    const params = useParams();
	const userId = params?.id as string;
    const router = useRouter();

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [isAdmin, setIsAdmin] = useState(false)

	const dispatch = useDispatch<any>()

	const userDetails = useSelector((state: any) => state.userDetails)
	const { loading, error, user } = userDetails

	const userUpdate = useSelector((state: any) => state.userUpdate)
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate,
	} = userUpdate

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: USER_UPDATE_RESET })
			router.push('/admin/userlist')
		} else {
			if (!user.name || user._id !== userId) {
                // @ts-ignore
				dispatch(getUserDetails(userId))
			} else {
				setName(user.name)
				setEmail(user.email)
				setIsAdmin(user.isAdmin)
			}
		}
	}, [dispatch, router, userId, user, successUpdate])

	const submitHandler = (e: any) => {
		e.preventDefault()
        // @ts-ignore
		dispatch(updateUser({ _id: userId, name, email, isAdmin }))
	}

	return (
		<>
			<Link href='/admin/userlist' className='btn btn-light my-3'>
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit User</h1>
				{loadingUpdate && <Loader />}
				{errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
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

						<Form.Group controlId='isadmin'>
							<Form.Check
								type='checkbox'
								label='Is Admin'
                                checked={isAdmin}
								onChange={(e) => setIsAdmin(e.target.checked)}
							></Form.Check>
						</Form.Group>

						<Button type='submit' variant='primary' className='mt-3'>
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	)
}

export default UserEditScreen
