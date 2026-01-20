'use client';

import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Message from '@/components/Message';
import CheckoutSteps from '@/components/CheckoutSteps';
import { createOrder } from '@/redux/actions/orderActions';
import { useRouter } from 'next/navigation';
// import { ORDER_CREATE_RESET } from '../constants/orderConstants'

const PlaceOrderScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const cart = useSelector((state: any) => state.cart);

  if (!cart.shippingAddress.address) {
    router.push('/shipping');
  } else if (!cart.paymentMethod) {
    router.push('/payment');
  }

  const orderCreate = useSelector((state: any) => state.orderCreate);
  const { order, success, error } = orderCreate || {};

  // const { userInfo } = useSelector((state: any) => state.userLogin)

  // Helper to add decimals
  const addDecimals = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(
    Number(cart.cartItems.reduce((acc: any, cur: any) => acc + cur.price * cur.qty, 0).toFixed(2))
  );

  const shippingPrice = addDecimals(Number(itemsPrice) > 100 ? 0 : 100);

  const taxPrice = addDecimals(Number((Number(itemsPrice) * 0.15).toFixed(2)));

  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

  useEffect(() => {
    if (success) {
      router.push(`/order/${order._id}`);
      // dispatch({ type: ORDER_CREATE_RESET })
    }
    // eslint-disable-next-line
  }, [router, success]);

  const placeOrderHandler = () => {
    // @ts-ignore
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
      })
    );
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush" className="shadow-sm rounded-4 overflow-hidden mb-4">
            <ListGroup.Item className="p-4">
              <h2 className="mb-3">Shipping</h2>
              <p className="mb-0 text-secondary">
                <strong className="text-dark">Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item className="p-4">
              <h2 className="mb-3">Payment Method</h2>
              <p className="mb-0 text-secondary">
                <strong className="text-dark">Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item className="p-4">
              <h2 className="mb-3">Order Items </h2>

              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item: any, index: number) => (
                    <ListGroup.Item key={index} className="border-0 px-0 py-3 border-bottom">
                      <Row className="align-items-center">
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                            className="shadow-sm"
                          />
                        </Col>
                        <Col>
                          <Link
                            href={`/product/${item.product}`}
                            className="text-decoration-none text-dark fw-bold"
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} className="text-muted">
                          {item.qty} x ${item.price} ={' '}
                          <strong className="text-dark">
                            ${(item.qty * item.price).toFixed(2)}
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-lg rounded-4 sticky-top" style={{ top: '20px' }}>
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-primary text-white pt-4 pb-3 rounded-top-4">
                <h2 className="text-white fs-4 mb-0">Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item className="px-4 py-3">
                <Row>
                  <Col className="text-secondary">Items</Col>
                  <Col className="fw-bold">${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="px-4 py-3">
                <Row>
                  <Col className="text-secondary">Shipping</Col>
                  <Col className="fw-bold">${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="px-4 py-3">
                <Row>
                  <Col className="text-secondary">Tax</Col>
                  <Col className="fw-bold">${taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="px-4 py-3 bg-light">
                <Row className="align-items-center">
                  <Col className="text-uppercase fw-bold text-dark">Total</Col>
                  <Col className="fs-4 fw-bold text-primary">${totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="px-4">
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item className="p-4">
                <Button
                  type="button"
                  className="btn-block w-100 rounded-pill py-2 shadow"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
