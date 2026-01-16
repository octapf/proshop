
'use client';

import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import FormContainer from '@/components/FormContainer'
import { saveShippingAddress } from '@/redux/actions/cartActions'
import CheckoutSteps from '@/components/CheckoutSteps'

const ShippingScreen = () => {
    const router = useRouter();
	const { shippingAddress, guestInfo } = useSelector((state: any) => state.cart)
	const { userInfo } = useSelector((state: any) => state.userLogin)

    useEffect(() => {
        if (!userInfo && !guestInfo) {
            router.push('/login')
        }
    }, [userInfo, guestInfo, router]);

	const [address, setAddress] = useState(shippingAddress.address || '')
	const [city, setCity] = useState(shippingAddress.city || '')
	const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
	const [country, setCountry] = useState(shippingAddress.country || '')

	const dispatch = useDispatch()

	const submitHandler = (e: any) => {
		e.preventDefault()
        // @ts-ignore
		dispatch(saveShippingAddress({ address, city, postalCode, country }))
		router.push('/payment')
	}
	return (
		<FormContainer>
			<CheckoutSteps step1 step2 />
			<h1>Shipping</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group controlId='address'>
					<Form.Label>Address</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter address'
						onChange={(e) => setAddress(e.target.value)}
						value={address}
						required
					/>
				</Form.Group>
				<Form.Group controlId='city'>
					<Form.Label>City</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter city'
						onChange={(e) => setCity(e.target.value)}
						value={city}
						required
					/>
				</Form.Group>
				<Form.Group controlId='postalCode'>
					<Form.Label>Postal Code</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter postal code'
						onChange={(e) => setPostalCode(e.target.value)}
						value={postalCode}
						required
					/>
				</Form.Group>
				<Form.Group controlId='country'>
					<Form.Label>Country</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter country'
						onChange={(e) => setCountry(e.target.value)}
						value={country}
						required
					/>
				</Form.Group>
				<Button type='submit' variant='outline-dark'>
					Continue
				</Button>
			</Form>
		</FormContainer>
	)
}

export default ShippingScreen
