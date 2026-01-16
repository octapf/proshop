'use client';
import React, { useEffect, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { Row, Col, ListGroup, Form, Button, Card, Image } from 'react-bootstrap'
import { addToCart, removeFromCart } from '@/redux/actions/cartActions'
import Message from '@/components/Message'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import Loader from '@/components/Loader'

const CartContent = () => {
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
				<h1 className="mb-4">Shopping Cart</h1>
				{cartItems.length === 0 ? (
					<Message>
						Your cart is empty, <Link href='/'>Go Back</Link>
					</Message>
				) : (
                    <div className="cart-items">
						{cartItems.map((item: any) => (
                            <Card key={item.product} className="mb-3 border-0 shadow-sm rounded-4 overflow-hidden">
                                <Card.Body className="p-0">
                                    <Row className="align-items-center g-0">
                                        <Col md={3} className="p-3 bg-light d-flex align-items-center justify-content-center">
                                            <Image src={item.image} alt={item.name} fluid rounded style={{ maxHeight: '100px', objectFit: 'contain' }} />
                                        </Col>
                                        <Col md={9} className="p-3">
                                            <Row className="align-items-center">
                                                <Col md={5}>
                                                    <Link href={`/product/${item.product}`} className="text-decoration-none fw-bold text-dark stretch-link-z-index">
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={2} className="text-muted fw-semibold">
                                                    $ {item.price.toFixed(2)}
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Select
                                                        value={item.qty}
                                                        onChange={(e) =>
                                                            // @ts-ignore
                                                            dispatch(addToCart(item.product, Number(e.target.value)))
                                                        }
                                                        className="form-select-sm border-0 bg-light"
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {[...Array(item.countInStock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Col>
                                                <Col md={2} className="text-end">
                                                    <Button
                                                        type='button'
                                                        variant='light'
                                                        className="text-danger rounded-circle p-2"
                                                        onClick={() => removeFromCartHandler(item.product)}
                                                    >
                                                        <i className='fas fa-trash'></i>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
						))}
                    </div>
				)}
			</Col>

			<Col md={4} className="mt-4 mt-md-0">
				<Card className="border-0 shadow-lg rounded-4 sticky-top" style={{ top: '100px' }}>
					<ListGroup variant='flush'>
						<ListGroup.Item className="bg-white border-0 pt-4 px-4">
							<h2 className="fs-4 fw-bold">
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
						<ListGroup.Item className="bg-white border-0 pb-4 px-4">
							<Button
								type='button'
								className='btn-block w-100 rounded-pill'
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

const CartScreen = () => {
    return (
        <Suspense fallback={<Loader />}>
            <CartContent />
        </Suspense>
    )
}

export default CartScreen;
