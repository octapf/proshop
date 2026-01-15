
'use client';

import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import FormContainer from '@/components/FormContainer'
import CheckoutSteps from '@/components/CheckoutSteps'
import { savePaymentMethod } from '@/redux/actions/cartActions'

const PaymentScreen = () => {
    const router = useRouter();
	const { shippingAddress } = useSelector((state: any) => state.cart)
	const { userInfo } = useSelector((state: any) => state.userLogin)

    useEffect(() => {
        if (!userInfo) {
		    router.push('/login')
	    } else if (!shippingAddress.address) {
		    router.push('/shipping')
	    }
    }, [userInfo, shippingAddress, router]);

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
			<h1>Payment Method</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group controlId='paymentMethod'>
					<Form.Label as='legend'>Select Method</Form.Label>
					<Col>
						<Form.Check
							type='radio'
							label='PayPal or Credit Card'
							id='PayPal'
                            // @ts-ignore
							defaultChecked
							name='paymentMethod'
							value='PayPal'
							onClick={(e: any) => setPaymentMethod(e.target.value)}
							required
						/>
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

				<Button type='submit' variant='outline-dark'>
					Continue
				</Button>
			</Form>
		</FormContainer>
	)
}

export default PaymentScreen
