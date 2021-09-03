import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ListGroup, Row, Col, Image, Card, Button } from 'react-bootstrap'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
	getOrderDetails,
	payOrder,
	deliverOrder,
} from '../actions/orderActions'
import {
	ORDER_PAY_RESET,
	ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

//FIX item.countInStock ***************************************************

const OrderScreen = ({ history, match }) => {
	const [sdkReady, setSdkReady] = useState(false)

	const dispatch = useDispatch()

	const orderId = match.params.id

	const { loading, error, order } = useSelector((state) => state.orderDetails)
	const { userInfo } = useSelector((state) => state.userLogin)

	const { loading: loadingPay, success: successPay } = useSelector(
		(state) => state.orderPay
	)

	const {
		loading: loadingDeliver,
		success: successDeliver,
		error: errorDeliver,
	} = useSelector((state) => state.orderDeliver)

	useEffect(() => {
		if (!userInfo.name) {
			history.push('/login')
		} else {
			const addPayPalScript = async () => {
				const clientId = await (await fetch('/api/config/paypal')).json()

				const script = document.createElement('script')

				script.type = 'text/javascript'
				script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
				script.async = true
				script.onload = () => {
					setSdkReady(true)
				}
				document.body.appendChild(script)
			}

			if (!order || order._id !== orderId || successPay) {
				dispatch({ type: ORDER_PAY_RESET })
				dispatch({ type: ORDER_DELIVER_RESET })
				dispatch(getOrderDetails(orderId))
			} else if (!order.isPaid) {
				if (!window.paypal) {
					addPayPalScript()
				} else {
					setSdkReady(true)
				}
			}
		}
	}, [order, orderId, dispatch, successPay, successDeliver])

	const handleDeliver = (e) => {
		dispatch(deliverOrder(orderId))
		dispatch(getOrderDetails(orderId))
	}

	const successPaymentHandler = (paymentResult) => {
		dispatch(payOrder(orderId, paymentResult))
	}

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<>
			<h1>Order {order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Name: </strong> {order.user.name}
							</p>

							<p>
								<strong>Email: </strong>
								<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
							</p>
							<p>
								<strong>Address: </strong>
								{order.shippingAddress.address}, {order.shippingAddress.city},{' '}
								{order.shippingAddress.postalCode}, {order.shippingAddress.city}
							</p>
							{order.isDelivered ? (
								<Message variant='success'>
									Delivered at {order.deliveredAt}
								</Message>
							) : (
								<Message variant='danger'>Not Delivered</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant='success'>Paid at {order.paidAt}</Message>
							) : (
								<Message variant='danger'>Not Paid</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items </h2>

							{order.orderItems.length === 0 ? (
								<Message>Your order is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{order.orderItems.map((item) => (
										<ListGroup.Item key={item.product}>
											<Row>
												<Col md={2}>
													<Link to={`/product/${item.product}`}>
														<Image
															src={item.image}
															alt={item.name}
															fluid
															rounded
														/>
													</Link>
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x ${item.price} = ${item.qty * item.price}
												</Col>
												<Col md={1}>
													{item.countInStock ? 'In Stock' : 'Out Of Stock'}
												</Col>
											</Row>
											<Row>
												<Col className='py-3'>{`Product id: ${item.product}`}</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}
									{!sdkReady ? (
										<Loader />
									) : (
										<PayPalButton
											amount={order.totalPrice}
											onSuccess={successPaymentHandler}
										/>
									)}
								</ListGroup.Item>
							)}

							{userInfo.isAdmin && order.isPaid && !order.isDelivered && (
								<ListGroup.Item>
									<Button
										type='button'
										className='btn btn-block'
										onClick={handleDeliver}
									>
										Mark as Delivered
									</Button>
								</ListGroup.Item>
							)}
							{loadingDeliver && <Loader />}
							{errorDeliver && (
								<Message variant='danger'>{errorDeliver}</Message>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default OrderScreen
