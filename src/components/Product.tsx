
'use client';
import React from 'react'
import { Link } from '@/i18n/routing'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { useTranslations } from 'next-intl';

const Product = ({ product }: any) => {
    const t = useTranslations('Product');
	return (
        <Card className='my-3 p-3 rounded'>
            <Link href={`/product/${product._id}`}>
				<Card.Img src={product.image} variant='top' />
			</Link>
            <Card.Body>
				<Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>

                    <Card.Title as='div'>
                        <strong>{product.name}</strong>
                    </Card.Title>

                </Link>

				<Card.Text as='div'>
					<Rating
						value={product.rating}
						text={`${product.numReviews} ${t('reviews')}`}
					/>
				</Card.Text>

				<Card.Text as='h3'>${product.price.toFixed(2)}</Card.Text>
			</Card.Body>
        </Card>
    );
}

export default Product
