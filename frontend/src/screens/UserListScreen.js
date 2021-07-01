import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { listUsers, deleteUser } from '../actions/userActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

const UserListScreen = ({ history }) => {
	const dispatch = useDispatch()

	const { userInfo } = useSelector((state) => state.userLogin)
	const {
		loading: deleteUserLoading,
		error: deleteUserError,
		success: deleteUserSuccess,
	} = useSelector((state) => state.userDelete)

	useEffect(() => {
		if (!userInfo) {
			history.push('/login')
		} else if (!userInfo.isAdmin) {
			history.push('/')
		} else {
			dispatch(listUsers())
		}
	}, [history, userInfo, dispatch, deleteUserSuccess])

	const { users, loading, error } = useSelector((state) => state.userList)

	const deleteHandler = (id) => {
		if (window.confirm('Are you sure?')) {
			dispatch(deleteUser(id))
		}
	}

	return (
		<div>
			<h1>Users</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Admin</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>
									<a href={`mailto:${user.email}`}>{user.email}</a>
								</td>
								<td>
									{user.isAdmin ? (
										<i className='fas fa-check' style={{ color: 'green' }}></i>
									) : (
										<i className='fas fa-times' style={{ color: 'red' }}></i>
									)}
								</td>
								<td>
									<LinkContainer to={`/admin/user/${user._id}/edit`}>
										<Button variant='outline-dark' className='btn-sm'>
											<i className='fas fa-edit'></i>
										</Button>
									</LinkContainer>
									<Button
										variant='outline-danger'
										className='btn-sm'
										onClick={() => deleteHandler(user._id)}
									>
										<i className='fas fa-trash'></i>
									</Button>
								</td>
								{deleteUserLoading ? (
									<td>
										<Loader width='50' height='50' />
									</td>
								) : (
									deleteUserError && (
										<td>
											<Message variant='danger'>User not found</Message>
										</td>
									)
								)}
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</div>
	)
}

export default UserListScreen
