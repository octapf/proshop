'use client';
import React from 'react';
import { Link } from '@/i18n/routing';
import { Card, Button } from 'react-bootstrap';
import Rating from './Rating';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/actions/cartActions';
import { addToWishlist, removeFromWishlist } from '@/redux/actions/wishlistActions';

const Product = ({ product }: any) => {
  const t = useTranslations('Product');
  const dispatch = useDispatch();

  const wishlist = useSelector((state: any) => state.wishlist) || { wishlistItems: [] };
  const { wishlistItems } = wishlist;

  const isWishlisted = wishlistItems.find((x: any) => x.product === product._id);

  const addToCartHandler = () => {
    // @ts-ignore
    dispatch(addToCart(product._id, 1));
  };

  const toggleWishlistHandler = () => {
    if (isWishlisted) {
      // @ts-ignore
      dispatch(removeFromWishlist(product._id));
    } else {
      // @ts-ignore
      dispatch(addToWishlist(product._id));
    }
  };

  return (
    <Card className="my-3 p-3 rounded position-relative">
      <Button
        variant="light"
        className="position-absolute top-0 end-0 m-2 rounded-circle p-2 d-flex align-items-center justify-content-center border-0 shadow-sm"
        style={{ width: '40px', height: '40px', zIndex: 10 }}
        onClick={toggleWishlistHandler}
      >
        <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart text-danger`}></i>
      </Button>
      <Link href={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating value={product.rating} text={`${product.numReviews} ${t('reviews')}`} />
        </Card.Text>

        <div className="mt-3">
          <h3 className="product-price">${product.price.toFixed(2)}</h3>

          <div className="card-actions">
            <Button
              className="btn-block w-100"
              type="button"
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              {t('addToCart')}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;
