
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
						<Link href='/login' legacyBehavior passHref>
							<Nav.Link>Sign In</Nav.Link>
						</Link>
					) : (
						<Nav.Link disabled>Sign In</Nav.Link>
					)}
				</Nav.Item>

				<Nav.Item>
					{step2 ? (
						<Link href='/shipping' legacyBehavior passHref>
							<Nav.Link>Shipping</Nav.Link>
						</Link>
					) : (
						<Nav.Link disabled>Shipping</Nav.Link>
					)}
				</Nav.Item>

				<Nav.Item>
					{step3 ? (
						<Link href='/payment' legacyBehavior passHref>
							<Nav.Link>Payment</Nav.Link>
						</Link>
					) : (
						<Nav.Link disabled>Payment</Nav.Link>
					)}
				</Nav.Item>

				<Nav.Item>
					{step4 ? (
						<Link href='/placeorder' legacyBehavior passHref>
							<Nav.Link>Place Order</Nav.Link>
						</Link>
					) : (
						<Nav.Link disabled>Place Order</Nav.Link>
					)}
				</Nav.Item>
			</Row>
		</Nav>
	)
}

export default CheckoutSteps
