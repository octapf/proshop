
'use client';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { Row, Col, ListGroup, UserImage, Form, Button, Card, Image } from 'react-bootstrap'
import { addToCart, removeFromCart } from '@/redux/actions/cartActions'
import Message from '@/components/Message'
import { useSearchParams, useRouter, useParams } from 'next/navigation'

const CartScreen = () => {
    // Handling routing / params
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();

    // If id is in URL params (e.g. /cart/[id])
    const productId = params?.id as string;
    const qty = searchParams.get('qty') ? Number(searchParams.get('qty')) : 1;

	const dispatch = useDispatch()

	const cart = useSelector((state: any) => state.cart)
    const { cartItems } = cart;

	useEffect(() => {
		if (productId) {
            // @ts-ignore
			dispatch(addToCart(productId, qty))
		}
	}, [dispatch, productId, qty])
    
    const removeFromCartHandler = (id: string) => {
        // @ts-ignore
		dispatch(removeFromCart(id))
	}

	const checkoutHandler = () => {
		router.push('/login?redirect=shipping')
	}

    return (
        <Row>
			<Col md={8}>
				<h1>Shopping Cart</h1>
				{cartItems.length === 0 ? (
					<Message>
						Your cart is empty, <Link href='/'>Go Back</Link>
					</Message>
				) : (
					<ListGroup variant='flush'>
						{cartItems.map((item: any) => (
							<ListGroup.Item key={item.product}>
								<Row>
									<Col md={2}>
										<Image src={item.image} alt={item.name} fluid rounded />
									</Col>
									<Col md={3}>
										<Link href={`/product/${item.product}`}>{item.name}</Link>
									</Col>
									<Col md={2}>$ {item.price.toFixed(2)}</Col>
									<Col md={2}>
										<Form.Control
											as='select'
											value={item.qty}
											onChange={(e) =>
                                                // @ts-ignore
												dispatch(addToCart(item.product, Number(e.target.value)))
											}
										>
											{[...Array(item.countInStock).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</Form.Control>
									</Col>
									<Col md={2}>
										<Button
											type='button'
											variant='light'
											onClick={() => removeFromCartHandler(item.product)}
										>
											<i className='fas fa-trash'></i>
										</Button>
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Col>

			<Col md={4}>
				<Card>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>
								SubTotal ({cartItems.reduce((acc: number, item: any) => acc + item.qty, 0)})
								items
							</h2>
							$
							{cartItems
								.reduce(
									(acc: number, item: any) => acc + item.qty * item.price,
									0
								)
								.toFixed(2)}
						</ListGroup.Item>
						<ListGroup.Item>
							<Button
								type='button'
								className='btn-block'
                                disabled={cartItems.length === 0}
								onClick={() => checkoutHandler()}
							>
								Proceed To Checkout
							</Button>
						</ListGroup.Item>
					</ListGroup>
				</Card>
			</Col>
		</Row>
    )

}

export default CartScreen;
