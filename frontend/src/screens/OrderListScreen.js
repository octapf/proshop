import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listOrders } from '../actions/orderActions'
import { LinkContainer } from 'react-router-bootstrap'

const OrderListScreen = ({ history }) => {
	const dispatch = useDispatch()

	const { userInfo } = useSelector((state) => state.userLogin)

	const { orders, loading, error } = useSelector((state) => state.orderList)

	useEffect(() => {
		if (!userInfo.name) {
			history.push('/login')
		} else if (!userInfo.isAdmin) {
			history.push('/')
		} else {
			dispatch(listOrders())
		}
	}, [dispatch, history, userInfo])

	return (
		<>
			<h2 className='my-3'>Order List</h2>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Table hover striped bordered size='sm' style={{ width: '1200px' }}>
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Order Items</th>
							<th>Shipping Address</th>
							<th>Payment Method</th>
							<th>Tax Price</th>
							<th>Shipping Price</th>
							<th>Items Price</th>
							<th>Total Price</th>
							<th>Paid</th>
							<th>Delivered</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{orders.length === 0 ? (
							<Message variant='danger'>No orders found</Message>
						) : (
							orders.map((order) => (
								<tr>
									<td>
										<Link to={`/order/${order._id}`}>{order._id}</Link>
									</td>
									<td>{order.orderItems.length}</td>
									<td style={{ width: '15%' }}>
										{order.shippingAddress.address}
										{', '}
										{order.shippingAddress.city}
										{', '}
										{order.shippingAddress.postalCode}
										{', '}
										{order.shippingAddress.country}
									</td>
									<td>{order.paymentMethod}</td>
									<td>${order.taxPrice}</td>
									<td>${order.shippingPrice}</td>
									<td>${order.itemsPrice}</td>
									<td>${order.totalPrice}</td>
									<td style={{ width: '30%' }}>
										{order.isPaid ? (
											order.createdAt.substring(0, 10)
										) : (
											<i className='fas fa-times' style={{ color: 'red' }}></i>
										)}
									</td>
									<td>
										{order.isDelivered ? (
											order.deliveredAt.substring(0, 10)
										) : (
											<i className='fas fa-times' style={{ color: 'red' }}></i>
										)}
									</td>
									<td>
										<LinkContainer to={`/order/${order._id}`}>
											<Button className='btn-sm' variant='outline-dark'>
												<i className='fas fa-edit'></i>
											</Button>
										</LinkContainer>
									</td>
								</tr>
							))
						)}
					</tbody>
				</Table>
			)}
		</>
	)
}

export default OrderListScreen
