'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, Form, Button, FormCheck } from 'react-bootstrap';
import { listProductFilters } from '@/redux/actions/productActions';
import { useRouter, useSearchParams } from 'next/navigation';

const FilterSidebar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const productFilters = useSelector((state: any) => state.productFilters);
    const { loading, error, filters } = productFilters;

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
        const maxP = filters?.maxPrice ? Number(searchParams.get('maxPrice')) || filters.maxPrice : 1000;
        const rate = Number(searchParams.get('rating')) || 0;

        setSelectedCategory(cat);
        setSelectedBrand(brand);
        if (filters?.maxPrice) setPriceRange([minP, maxP]); 
        setSelectedRating(rate);
    }, [searchParams, filters]);


    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (selectedCategory) params.set('category', selectedCategory);
        else params.delete('category');

        if (selectedBrand) params.set('brand', selectedBrand);
        else params.delete('brand');

        params.set('minPrice', priceRange[0].toString());
        params.set('maxPrice', priceRange[1].toString());

        if (selectedRating > 0) params.set('rating', selectedRating.toString());
        else params.delete('rating');

        // Reset page to 1 on filter change
        params.set('pageNumber', '1');

        router.push(`/?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('/');
        setSelectedCategory('');
        setSelectedBrand('');
        if (filters?.maxPrice) setPriceRange([0, filters.maxPrice]);
        setSelectedRating(0);
    }

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
                         <Form.Label>Range: ${priceRange[0]} - ${priceRange[1]}</Form.Label>
                         <Form.Range 
                            min={0} 
                            max={filters?.maxPrice || 1000} 
                            value={priceRange[1]} 
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
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
                            onChange={() => setSelectedCategory('')}
                        />
                        {filters?.categories?.map((cat: string) => (
                            <Form.Check 
                                key={cat}
                                type="radio" 
                                label={cat} 
                                name="category" 
                                checked={selectedCategory === cat}
                                onChange={() => setSelectedCategory(cat)}
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
                            onChange={() => setSelectedBrand('')}
                        />
                        {filters?.brands?.map((brand: string) => (
                            <Form.Check 
                                key={brand}
                                type="radio" 
                                label={brand} 
                                name="brand" 
                                checked={selectedBrand === brand}
                                onChange={() => setSelectedBrand(brand)}
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
                                label={<>
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={
                                            rating >= i + 1 
                                            ? 'fas fa-star text-warning' 
                                            : 'far fa-star text-warning'
                                        }></i>
                                    ))} & Up
                                </>}
                                name="rating" 
                                checked={selectedRating === rating}
                                onChange={() => setSelectedRating(rating)}
                            />
                        ))}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            
            <Button variant="primary" className="mt-3 w-100" onClick={applyFilters}>
                Apply Filters
            </Button>
        </div>
    );
};

export default FilterSidebar;
