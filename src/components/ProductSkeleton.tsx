
import React from 'react'
import { Card, Col } from 'react-bootstrap'

const ProductSkeleton = () => {
    return (
        <Card className='skeleton-card mb-3'>
            <div className='skeleton skeleton-img'></div>
            <Card.Body className='skeleton-body'>
                <div className='skeleton skeleton-title'></div>
                <div className='skeleton skeleton-text' style={{ width: '60%' }}></div>
                <div className='skeleton skeleton-price'></div>
            </Card.Body>
        </Card>
    )
}

export default ProductSkeleton
