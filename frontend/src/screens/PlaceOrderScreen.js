import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'

const PlaceOrderScreen = ({ history }) => {
	const dispatch = useDispatch()

	const cart = useSelector((state) => state.cart)

	const { loading, success, error, order } = useSelector(
		(state) => state.orderCreate
	)

	const { userInfo } = useSelector(state => state.userLogin)

	if (!userInfo) {
		history.push('/login')
	} else if (!cart.paymentMethod) {
		history.push('/payment')
	}

	const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2)

	//calculate prices
	//items , shipping, tax, total

	cart.itemsPrice = addDecimals(
		Number(
			cart.cartItems
				.reduce((acc, cur) => acc + cur.price * cur.qty, 0)
				.toFixed(2)
		)
	)

	cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)

	cart.taxPrice = addDecimals(
		Number(cart.itemsPrice && (cart.itemsPrice * 0.15).toFixed(2))
	)

	cart.totalPrice = (
		Number(cart.itemsPrice) +
		Number(cart.shippingPrice) +
		Number(cart.taxPrice)
	).toFixed(2)



	useEffect(() => {
		if (success) {
			history.push(`/order/${order._id}`)
		}
	}, [history, success])

	const placeOrderHandler = () => {
		dispatch(createOrder({ ...cart, orderItems: cart.cartItems }))
	}

	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Address: </strong>
								{cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
								{cart.shippingAddress.postalCode}, {cart.shippingAddress.city}
							</p>
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{cart.paymentMethod}
							</p>
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items </h2>

							{cart.cartItems.length === 0 ? (
								<Message>Your cart is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{cart.cartItems.map((item) => (
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
									<Col>${cart.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${cart.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${cart.taxPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${cart.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Button
									type='button'
									className='btn-block'
									disabled={cart.cartItems.length === 0}
									onClick={placeOrderHandler}
								>
									Place Order
								</Button>
							</ListGroup.Item>

							{error && (
								<ListGroup.Item>
									<Message variant='danger'>{error}</Message>
								</ListGroup.Item>
							)}
							{loading && (
								<ListGroup.Item>
									<Loader />
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default PlaceOrderScreen
