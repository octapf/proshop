import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { getProduct } from '../actions/productActions'

const ProductEditScreen = () => {
	const dispatch = useDispatch()

	const [name, setName] = useState('')
	const [image, setImage] = useState('')
	const [brand, setBrand] = useState('')
	const [category, setCategory] = useState('')
	const [description, setDescription] = useState('')
	const [reviews, setReviews] = useState([])
	const [rating, setRating] = useState(0)
	const [numReviews, setNumReviews] = useState(0)
	const [price, setPrice] = useState(0)
	const [countInStock, setCountInStock] = useState(0)

	return <div>ProductEditScreen</div>
}

export default ProductEditScreen
