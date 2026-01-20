'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '@/components/Rating';
import Loader from '@/components/Loader';
import Message from '@/components/Message';
import Product from '@/components/Product';
import ProductGallery from '@/components/ProductGallery';
import { getProduct, listRelatedProducts } from '@/redux/actions/productActions';
import { useParams, useRouter } from 'next/navigation';

const ProductScreen = () => {
  const params = useParams();
  const router = useRouter();
  // @ts-ignore
  const { id } = params;

  const [qty, setQty] = useState(1);
  // const [rating, setRating] = useState(0);
  // const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const productDetails = useSelector((state: any) => state.getProduct);
  const { loading, error, product } = productDetails;

  const productRelated = useSelector((state: any) => state.productRelated);
  const {
    loading: loadingRelated,
    error: errorRelated,
    products: relatedProducts,
  } = productRelated;

  // userLogin for review logic... skipped for now

  useEffect(() => {
    if (id) {
      // @ts-ignore
      dispatch(getProduct(id));
      // @ts-ignore
      dispatch(listRelatedProducts(id));
    }
  }, [dispatch, id]);

  const addToCartHandler = () => {
    router.push(`/cart/${id}?qty=${qty}`);
  };

  return (
    <>
      <Link href="/" className="btn btn-light my-3 rounded-pill px-4">
        <i className="fas fa-arrow-left me-2"></i> Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="align-items-start">
            <Col md={6}>
              <ProductGallery product={product} />
            </Col>
            <Col md={3}>
              <h2 className="fw-bold mb-3 font-poppins">{product.name}</h2>
              <div className="mb-3 border-bottom pb-3">
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              </div>
              <div className="my-4">
                <h3 className="fw-bold text-primary display-6">${product.price}</h3>
              </div>
              <p className="text-secondary lh-lg mb-4">{product.description}</p>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                <ListGroup variant="flush">
                  <ListGroup.Item className="bg-light py-3">
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item className="bg-light py-3">
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <span className="badge bg-success">In Stock</span>
                        ) : (
                          <span className="badge bg-danger">Out Of Stock</span>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item className="bg-light py-3">
                      <Row className="align-items-center">
                        <Col>Qty</Col>
                        <Col>
                          <Form.Select
                            value={qty}
                            onChange={(e: any) => setQty(e.target.value)}
                            className="form-select-sm border-0 shadow-sm"
                            style={{ cursor: 'pointer' }}
                          >
                            {[...Array(product.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className="p-4 bg-light">
                    <Button
                      onClick={addToCartHandler}
                      className="btn-primary w-100 py-2 rounded-pill shadow"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      <i className="fas fa-shopping-cart me-2"></i>
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <h2>Related Products</h2>
              {loadingRelated ? (
                <Loader />
              ) : errorRelated ? (
                <Message variant="danger">{errorRelated}</Message>
              ) : (
                <Row>
                  {relatedProducts &&
                    relatedProducts.map((product: any) => (
                      <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                      </Col>
                    ))}
                  {relatedProducts && relatedProducts.length === 0 && (
                    <Message>No related products found</Message>
                  )}
                </Row>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
