
'use client';
import React from 'react'
import { Link } from '@/i18n/routing'
import { Card, Button } from 'react-bootstrap'
import Rating from './Rating'
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/actions/cartActions';

const Product = ({ product }: any) => {
    const t = useTranslations('Product');
    const dispatch = useDispatch();

    const addToCartHandler = () => {
        // @ts-ignore
        dispatch(addToCart(product._id, 1));
    }

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

                <Button
                    className='btn-block'
                    type='button'
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                >
                    {t('addToCart')}
                </Button>
			</Card.Body>
        </Card>
    );
}

export default Product
