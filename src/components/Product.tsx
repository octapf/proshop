
'use client';
import React from 'react'
import Link from 'next/link'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({ product }: any) => {
	return (
		<Card className='my-3 p-3 rounded'>
			<Link href={`/product/${product._id}`} passHref>
				<Card.Img src={product.image} variant='top' />
			</Link>

			<Card.Body>
				<Link href={`/product/${product._id}`} passHref legacyBehavior>
                    <a style={{ textDecoration: 'none' }}>
    					<Card.Title as='div'>
	    					<strong>{product.name}</strong>
		    			</Card.Title>
                    </a>
				</Link>

				<Card.Text as='div'>
					<Rating
						value={product.rating}
						text={`${product.numReviews} reviews`}
					/>
				</Card.Text>

				<Card.Text as='h3'>${product.price.toFixed(2)}</Card.Text>
			</Card.Body>
		</Card>
	)
}

export default Product
