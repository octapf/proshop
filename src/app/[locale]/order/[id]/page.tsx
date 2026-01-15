
'use client';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Message from '@/components/Message';
import Loader from '@/components/Loader';
import { getOrderDetails, payOrder, deliverOrder }  from '@/redux/actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '@/redux/constants/orderConstants';
import { useParams, useRouter } from 'next/navigation';


const OrderScreen = () => {
    const params = useParams();
    const router = useRouter();
    // @ts-ignore
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const orderId = params?.id as string;
    const dispatch = useDispatch();

    const [paypalClientId, setPaypalClientId] = useState('');
    const [mercadoPagoPublicKey, setMercadoPagoPublicKey] = useState('');
    const [preferenceId, setPreferenceId] = useState(null);

    const orderDetails = useSelector((state: any) => state.orderDetails)
    const { order, loading, error } = orderDetails;
    
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin;

    const orderPay = useSelector((state: any) => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay;

    const orderDeliver = useSelector((state: any) => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    if (!loading) {
        //   Calculate prices
        const addDecimals = (num: number) => {
            return (Math.round(num * 100) / 100).toFixed(2);
        }

        order.itemsPrice = addDecimals(
            order.orderItems.reduce((acc: any, item: any) => acc + item.price * item.qty, 0)
        );
    }
    
    useEffect(() => {
        if (!userInfo) {
            router.push('/login')
        }

        const getPayPalClientId = async () => {
             const { data: clientId } = await axios.get('/api/config/paypal')
             setPaypalClientId(clientId)
        }

        const getMercadoPagoPublicKey = async () => {
             const { data: publicKey } = await axios.get('/api/config/mercadopago');
             if (publicKey) {
                 setMercadoPagoPublicKey(publicKey);
                 initMercadoPago(publicKey);
                 createPreference();
             }
        }

        const createPreference = async () => {
             try {
                 const { data } = await axios.post('/api/mercadopago/preference', { orderId });
                 setPreferenceId(data.id);
             } catch (error) {
                 console.error(error);
             }
        }

        if (!order || successPay || successDeliver || order._id !== orderId) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            // @ts-ignore
            dispatch(getOrderDetails(orderId)) 
        } else if (!order.isPaid) {
            if (!paypalClientId) {
                getPayPalClientId()
            }
            if (!mercadoPagoPublicKey) {
                getMercadoPagoPublicKey()
            }
        }

        if (searchParams && searchParams.get('payment_status') === 'approved' && !order?.isPaid) {
             const paymentResult = {
                 id: searchParams.get('payment_id'),
                 status: searchParams.get('status'),
                 update_time: new Date().toISOString(),
                 email_address: 'N/A' // Mercado Pago return url doesn't strictly provide payer email in query
             }
             // @ts-ignore
             dispatch(payOrder(orderId, paymentResult))
        }
    }, [dispatch, orderId, successPay, order, successDeliver, userInfo, router, paypalClientId, mercadoPagoPublicKey])

    const successPaymentHandler = (paymentResult: any) => {
        // @ts-ignore
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        // @ts-ignore
        dispatch(deliverOrder(order))
    }

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                             {order.isDelivered ? (
                                <Message variant='success'>
                                    Delivered at {order.deliveredAt}
                                </Message>
                            ) : (
                                <Message variant='danger'>Not Delivered</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                             {order.isPaid ? (
                                <Message variant='success'>Paid at {order.paidAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Paid</Message>
                            )}
                        </ListGroup.Item>

                         <ListGroup.Item>
                            <h2>Order Items </h2>
                            {order.orderItems.length === 0 ? (
                                <Message>Order is empty</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item: any, index: number) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link href={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = $
                                                    {(item.qty * item.price).toFixed(2)}
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
                    <Card>
                         <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                             <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <>
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!paypalClientId ? (
                                        <Loader />
                                    ) : (
                                        <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    currency_code: "USD",
                                                                    value: order.totalPrice,
                                                                },
                                                            },
                                                        ],
                                                        intent: "CAPTURE"
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture().then((details) => {
                                                        successPaymentHandler(details);
                                                    });
                                                }}
                                            />
                                        </PayPalScriptProvider>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                     {preferenceId && (
                                         <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts: { valueProp: 'smart_option'}}} />
                                     )}
                                </ListGroup.Item>
                            </>
                            )}
                            {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button
                                        type='button'
                                        className='btn btn-block'
                                        onClick={deliverHandler}
                                    >
                                        Mark As Delivered
                                    </Button>
                                </ListGroup.Item>
                            )}
                         </ListGroup>
                    </Card>
                 </Col>
            </Row>
        </>
    )
    
}

export default OrderScreen;
