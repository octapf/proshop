
'use client';

import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import Message from '@/components/Message'
import CheckoutSteps from '@/components/CheckoutSteps'
import { createOrder } from '@/redux/actions/orderActions'
import { useRouter } from 'next/navigation'
// import { ORDER_CREATE_RESET } from '../constants/orderConstants'

const PlaceOrderScreen = () => {
    const router = useRouter();
	const dispatch = useDispatch()

	const cart = useSelector((state: any) => state.cart)

    if (!cart.shippingAddress.address) {
		router.push('/shipping')
	} else if (!cart.paymentMethod) {
		router.push('/payment')
	}

	const orderCreate = useSelector(
		(state: any) => state.orderCreate
	)
    const { order, success, error } = orderCreate || {};

	// const { userInfo } = useSelector((state: any) => state.userLogin)

    // Helper to add decimals
	const addDecimals = (num: number) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

	cart.itemsPrice = addDecimals(
		Number(
			cart.cartItems
				.reduce((acc: any, cur: any) => acc + cur.price * cur.qty, 0)
				.toFixed(2)
		)
	)

	cart.shippingPrice = addDecimals(Number(cart.itemsPrice) > 100 ? 0 : 100)

	cart.taxPrice = addDecimals(
		Number((Number(cart.itemsPrice) * 0.15).toFixed(2))
	)

	cart.totalPrice = (
		Number(cart.itemsPrice) +
		Number(cart.shippingPrice) +
		Number(cart.taxPrice)
	).toFixed(2)

	useEffect(() => {
		if (success) {
			router.push(`/order/${order._id}`)
            // dispatch({ type: ORDER_CREATE_RESET })
		}
        // eslint-disable-next-line
	}, [router, success])

	const placeOrderHandler = () => {
		// @ts-ignore
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        }))
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
								{cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
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
									{cart.cartItems.map((item: any, index: number) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={1}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													/>
												</Col>
												<Col>
													<Link href={`/product/${item.product}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x ${item.price} = $
													{(item.qty * item.price).toFixed(2)}
												</Col>
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
						<ListGroup variant='flush'>
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
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>

							<ListGroup.Item>
								<Button
									type='button'
									className='btn-block'
                                    disabled={cart.cartItems === 0}
									onClick={placeOrderHandler}
								>
									Place Order
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
        </>
    )

}

export default PlaceOrderScreen
