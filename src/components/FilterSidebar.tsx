'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, Form, Button } from 'react-bootstrap';
import { listProductFilters } from '@/redux/actions/productActions';
import { useRouter, useSearchParams } from 'next/navigation';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const productFilters = useSelector((state: any) => state.productFilters);
  const { filters } = productFilters;

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    // @ts-ignore
    dispatch(listProductFilters());
  }, [dispatch]);

  useEffect(() => {
    if (filters && filters.maxPrice) {
      setPriceRange([0, filters.maxPrice]);
    }
  }, [filters]);

  // Read current filters from URL
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minP = Number(searchParams.get('minPrice')) || 0;
    const maxP = filters?.maxPrice
      ? Number(searchParams.get('maxPrice')) || filters.maxPrice
      : 1000;
    const rate = Number(searchParams.get('rating')) || 0;

    setSelectedCategory(cat);
    setSelectedBrand(brand);
    if (filters?.maxPrice) setPriceRange([minP, maxP]);
    setSelectedRating(rate);
  }, [searchParams, filters]);

  const updateFilters = (changes: any = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    const cat = 'category' in changes ? changes.category : selectedCategory;
    const br = 'brand' in changes ? changes.brand : selectedBrand;
    const minP = 'minPrice' in changes ? changes.minPrice : priceRange[0];
    const maxP = 'maxPrice' in changes ? changes.maxPrice : priceRange[1];
    const rate = 'rating' in changes ? changes.rating : selectedRating;

    if (cat) params.set('category', cat);
    else params.delete('category');

    if (br) params.set('brand', br);
    else params.delete('brand');

    params.set('minPrice', minP.toString());
    params.set('maxPrice', maxP.toString());

    if (rate > 0) params.set('rating', rate.toString());
    else params.delete('rating');

    params.set('pageNumber', '1');

    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/');
    setSelectedCategory('');
    setSelectedBrand('');
    if (filters?.maxPrice) setPriceRange([0, filters.maxPrice]);
    setSelectedRating(0);
  };

  if (loading) return <div>Loading filters...</div>;
  // if (error) return <div>Error loading filters</div>;

  return (
    <div className="mb-4">
      <h4>Filters</h4>
      <Button variant="outline-secondary" size="sm" className="mb-3 w-100" onClick={clearFilters}>
        Clear All
      </Button>

      <Accordion defaultActiveKey={['0', '1', '2', '3']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Price</Accordion.Header>
          <Accordion.Body>
            <Form.Label>
              Range: ${priceRange[0]} - ${priceRange[1]}
            </Form.Label>
            <Form.Range
              min={0}
              max={filters?.maxPrice || 1000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              onMouseUp={() => updateFilters({ maxPrice: priceRange[1] })}
              onTouchEnd={() => updateFilters({ maxPrice: priceRange[1] })}
            />
            {/* Simple implementation: only max price slider for now, or use a proper double slider library */}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Category</Accordion.Header>
          <Accordion.Body>
            <Form.Check
              type="radio"
              label="All"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => {
                setSelectedCategory('');
                updateFilters({ category: '' });
              }}
            />
            {filters?.categories?.map((cat: string) => (
              <Form.Check
                key={cat}
                type="radio"
                label={cat}
                name="category"
                checked={selectedCategory === cat}
                onChange={() => {
                  setSelectedCategory(cat);
                  updateFilters({ category: cat });
                }}
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Brand</Accordion.Header>
          <Accordion.Body>
            <Form.Check
              type="radio"
              label="All"
              name="brand"
              checked={selectedBrand === ''}
              onChange={() => {
                setSelectedBrand('');
                updateFilters({ brand: '' });
              }}
            />
            {filters?.brands?.map((brand: string) => (
              <Form.Check
                key={brand}
                type="radio"
                label={brand}
                name="brand"
                checked={selectedBrand === brand}
                onChange={() => {
                  setSelectedBrand(brand);
                  updateFilters({ brand: brand });
                }}
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Rating</Accordion.Header>
          <Accordion.Body>
            {[4, 3, 2, 1].map((rating) => (
              <Form.Check
                key={rating}
                type="radio"
                label={
                  <>
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={
                          rating >= i + 1 ? 'fas fa-star text-warning' : 'far fa-star text-warning'
                        }
                      ></i>
                    ))}{' '}
                    & Up
                  </>
                }
                name="rating"
                checked={selectedRating === rating}
                onChange={() => {
                  setSelectedRating(rating);
                  updateFilters({ rating: rating });
                }}
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
