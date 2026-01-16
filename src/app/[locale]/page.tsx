
'use client';

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '@/components/Product'
import Loader from '@/components/Loader'
import ProductSkeleton from '@/components/ProductSkeleton'
import Message from '@/components/Message'
import FilterSidebar from '@/components/FilterSidebar'
import { listProducts } from '@/redux/actions/productActions'
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export default function Home() {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const productList = useSelector((state: any) => state.productList);
    const { loading, error, products } = productList;
    const t = useTranslations('HomeScreen');

    const keyword = searchParams.get('keyword') || '';
    const pageNumber = searchParams.get('pageNumber') || '1';
    
    // Filters from URL
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');

    useEffect(() => {
        const filters = {
            category,
            brand,
            minPrice,
            maxPrice,
            rating
        };
        // @ts-ignore
        dispatch(listProducts(keyword, pageNumber, filters));
    }, [dispatch, keyword, pageNumber, category, brand, minPrice, maxPrice, rating]);

    return (
        <>
            <h1>{t('latestProducts')}</h1>
            <Row>
                <Col md={3} className="d-none d-md-block">
                    <FilterSidebar />
                </Col>
                <Col md={9}>
            {loading ? (
                <Row>
                    {[...Array(8)].map((_, i) => (
                        <Col key={i} sm={12} md={6} lg={4} xl={4}>
                            <ProductSkeleton />
                        </Col>
                    ))}
                </Row>
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Row>
                    {products && products.map((product: any) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={4}>
                            <Product product={product} />
                        </Col>
                    ))}
                     {products && products.length === 0 && (
                        <Message>No products found matching your criteria</Message>
                    )}
                </Row>
            )}
                </Col>
            </Row>
        </>
    )
}
