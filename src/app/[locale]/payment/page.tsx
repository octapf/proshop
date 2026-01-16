
'use client';

import React, { useState, useEffect } from 'react'
import { Form, Button, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import FormContainer from '@/components/FormContainer'
import CheckoutSteps from '@/components/CheckoutSteps'
import { savePaymentMethod } from '@/redux/actions/cartActions'

const PaymentScreen = () => {
    const router = useRouter();
	const { shippingAddress, guestInfo } = useSelector((state: any) => state.cart)
	const { userInfo } = useSelector((state: any) => state.userLogin)

    useEffect(() => {
        if (!userInfo && !guestInfo) {
		    router.push('/login')
	    } else if (!shippingAddress.address) {
		    router.push('/shipping')
	    }
    }, [userInfo, guestInfo, shippingAddress, router]);

	const [paymentMethod, setPaymentMethod] = useState('PayPal')

	const dispatch = useDispatch()

	const submitHandler = (e: any) => {
		e.preventDefault()
        // @ts-ignore
		dispatch(savePaymentMethod(paymentMethod))
		router.push('/placeorder')
	}
	return (
		<FormContainer>
			<CheckoutSteps step1 step2 step3 />
            <Card className="border-0 shadow-lg rounded-4 p-4">
                <Card.Body>
                    <h1 className="text-center mb-4">Payment Method</h1>
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='paymentMethod' className="mb-4">
                            <Form.Label as='legend' className="mb-3 fw-bold">Select Method</Form.Label>
                            <Col>
                                <div className="payment-option mb-3">
                                    <Form.Check
                                        type='radio'
                                        id='PayPal'
                                        // @ts-ignore
                                        defaultChecked
                                        name='paymentMethod'
                                        value='PayPal'
                                        onClick={(e: any) => setPaymentMethod(e.target.value)}
                                        required
                                        className="d-none"
                                    />
                                    <label htmlFor="PayPal" className={`d-flex align-items-center p-3 border rounded-3 cursor-pointer ${paymentMethod === 'PayPal' ? 'border-primary bg-light' : ''}`} style={{cursor: 'pointer'}}>
                                        <i className="fab fa-paypal fa-2x text-primary me-3"></i>
                                        <div>
                                            <span className="fw-bold d-block">PayPal or Credit Card</span>
                                            <small className="text-muted">Pay securely with PayPal</small>
                                        </div>
                                        {paymentMethod === 'PayPal' && <i className="fas fa-check-circle text-primary ms-auto"></i>}
                                    </label>
                                </div>
                                {/* <Form.Check
                                    type='radio'
                                    label='Stripe'
                                    id='Stripe'
                                    name='paymentMethod'
                                    value='Stripe'
                                    disabled
                                    onClick={(e: any) => setPaymentMethod(e.target.value)}
                                    required
                                /> */}
                            </Col>
                        </Form.Group>

                        <Button type='submit' variant='primary' className="w-100 rounded-pill py-2">
                            Continue
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
		</FormContainer>
	)
}

export default PaymentScreen
