'use client';
import React, { useState } from 'react';
import { Image, Row, Col } from 'react-bootstrap';

const ProductGallery = ({ product }: { product: any }) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  // Ensure we have an array to work with, including the main image
  const images =
    product.images && product.images.length > 0
      ? [product.image, ...product.images]
      : [product.image];

  // Remove duplicates just in case
  const uniqueImages = [...new Set(images)];

  const handleMouseMove = (e: any) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="product-gallery">
      <div
        className="main-image-container mb-3 position-relative overflow-hidden border rounded"
        style={{
          cursor: 'crosshair',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
      >
        <Image
          src={selectedImage}
          alt={product.name}
          fluid
          style={{ maxHeight: '100%', objectFit: 'contain' }}
        />

        {showZoom && (
          <div
            className="zoom-lens position-absolute w-100 h-100 top-0 start-0"
            style={{
              backgroundImage: `url(${selectedImage})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: '200%', // Zoom level
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {uniqueImages.length > 1 && (
        <Row className="g-2">
          {uniqueImages.map((img: string, index: number) => (
            <Col xs={3} key={index}>
              <div
                className={`thumbnail-container border rounded p-1 ${selectedImage === img ? 'border-primary' : ''}`}
                style={{
                  cursor: 'pointer',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => setSelectedImage(img)}
                onMouseEnter={() => setSelectedImage(img)}
              >
                <Image
                  src={img}
                  alt={`Product thumbnail ${index}`}
                  fluid
                  style={{ maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductGallery;
