'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, InputGroup, ListGroup, Image } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SearchBox = () => {
  const router = useRouter();

  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.trim().length > 1) {
        try {
          const { data } = await axios.get(`/api/products/search?query=${keyword}`);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [keyword]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      // @ts-ignore
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/?keyword=${keyword}`);
      setShowSuggestions(false);
    } else {
      router.push('/');
    }
  };

  const suggestionClickHandler = (id: string) => {
    router.push(`/product/${id}`);
    setShowSuggestions(false);
    setKeyword('');
  };

  return (
    <Form
      onSubmit={submitHandler}
      className="d-flex position-relative flex-grow-1 mx-lg-4"
      ref={wrapperRef}
    >
      <InputGroup>
        <Form.Control
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder="Search Products..."
          className="mr-sm-2 ml-sm-5"
          autoComplete="off"
        ></Form.Control>
        <Button type="submit" variant="outline-success" className="p-2">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>

      {showSuggestions && suggestions.length > 0 && (
        <ListGroup
          className="position-absolute w-100 shadow"
          style={{ top: '40px', zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}
        >
          {suggestions.map((product: any) => (
            <ListGroup.Item
              key={product._id}
              action
              onClick={() => suggestionClickHandler(product._id)}
              className="d-flex align-items-center"
            >
              <Image
                src={product.image}
                alt={product.name}
                rounded
                style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
              />
              <div>
                <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>
                  {product.name}
                </div>
                <small className="text-muted">${product.price}</small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Form>
  );
};

export default SearchBox;
