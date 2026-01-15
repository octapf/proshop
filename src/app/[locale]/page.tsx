
'use client';

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '@/components/Product'
import Loader from '@/components/Loader'
import Message from '@/components/Message'
import { listProducts } from '@/redux/actions/productActions'
import { useTranslations } from 'next-intl';

export default function Home() {
    const dispatch = useDispatch();
    const productList = useSelector((state: any) => state.productList);
    const { loading, error, products } = productList;
    const t = useTranslations('HomeScreen');

    useEffect(() => {
        // @ts-ignore
        dispatch(listProducts());
    }, [dispatch]);

    return (
        <>
            <h1>{t('latestProducts')}</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Row>
                    {products && products.map((product: any) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </>
    )
}
