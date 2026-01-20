'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Row, Col, ListGroup, Button, Image } from 'react-bootstrap';
import { removeFromWishlist } from '@/redux/actions/wishlistActions';
import { addToCart } from '@/redux/actions/cartActions';
import Message from '@/components/Message';
import { useRouter } from 'next/navigation';

const WishlistScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const wishlist = useSelector((state: any) => state.wishlist);
  const { wishlistItems } = wishlist;

  const removeFromWishlistHandler = (id: string) => {
    // @ts-ignore
    dispatch(removeFromWishlist(id));
  };

  const addToCartHandler = (id: string) => {
    // @ts-ignore
    dispatch(addToCart(id, 1));
    router.push('/cart');
  };

  return (
    <Row>
      <Col md={12}>
        <h1>My Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <Message>
            Your wishlist is empty, <Link href="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {wishlistItems.map((item: any) => (
              <ListGroup.Item key={item.product}>
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={4}>
                    <Link href={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>$ {item.price}</Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="primary"
                      className="btn-sm"
                      onClick={() => addToCartHandler(item.product)}
                    >
                      Add To Cart
                    </Button>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromWishlistHandler(item.product)}
                    >
                      <i className="fas fa-trash text-danger"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
    </Row>
  );
};

export default WishlistScreen;
