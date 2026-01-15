
'use client';
import React from 'react'
import { Nav, Row } from 'react-bootstrap'
import Link from 'next/link'

const CheckoutSteps = ({ step1, step2, step3, step4 }: any) => {
	return (
        <Nav className='justify-content-md-center mb-4'>
            <Row>
				<Nav.Item>
					{step1 ? (
						<Nav.Link as={Link} href='/login'>Sign In</Nav.Link>
					) : (
						<Nav.Link disabled>Sign In</Nav.Link>
					)}
				</Nav.Item>

				<Nav.Item>
					{step2 ? (
						<Nav.Link as={Link} href='/shipping'>Shipping</Nav.Link>
					) : (
						<Nav.Link disabled>Shipping</Nav.Link>
					)}
				</Nav.Item>

				<Nav.Item>
					{step3 ? (
						<Nav.Link as={Link} href='/payment'>Payment</Nav.Link>
					) : (
						<Nav.Link disabled>Payment</Nav.Link>
					)}
				</Nav.Item>

				<Nav.Item>
					{step4 ? (
						<Nav.Link as={Link} href='/placeorder'>Place Order</Nav.Link>
					) : (
						<Nav.Link disabled>Place Order</Nav.Link>
					)}
				</Nav.Item>
			</Row>
        </Nav>
    );
}

export default CheckoutSteps
