import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Image, Table } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Link } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import { getProduct } from '../actions/productActions'

const ProductEditScreen = ({ history, match }) => {
	const productId = match.params.id

	const dispatch = useDispatch()

	const [id, setId] = useState('')
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

	const { userInfo } = useSelector((state) => state.userLogin)
	const productGet = useSelector((state) => state.getProduct)
	const { product, loading, error } = productGet

	useEffect(() => {
		if (!userInfo || !userInfo.isAdmin) {
			history.push('/login')
		} else if (
			!productGet.product ||
			productId !== product._id ||
			productGet.product === undefined ||
			!productGet.product.name
		) {
			dispatch(getProduct(productId))
		} else {
			setId(product._id)
			setName(product.name)
			setImage(product.image)
			setBrand(product.brand)
			setCategory(product.category)
			setDescription(product.description)
			setReviews(product.reviews)
			setRating(product.rating)
			setNumReviews(product.numReviews)
			setPrice(product.price)
			setCountInStock(product.countInStock)
		}
	}, [dispatch, history, userInfo, productId, productGet])

	const submitHandler = () => {}

	return (
		<>
			<Link to={`/admin/productlist`} className='btn btn-light btn-sm py-3'>
				Go Back
			</Link>

			<FormContainer>
				<h2>Edit Product</h2>
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Image</Form.Label>
							<Image src={image} alt={name} fluid />
						</Form.Group>

						<Form.Group controlId='id'>
							<Form.Label>Id</Form.Label>
							<Form.Control
								as='input'
								type='text'
								onChange={(e) => setId(e.target.value)}
								value={id}
							/>
						</Form.Group>

						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								as='input'
								type='text'
								onChange={(e) => setName(e.target.value)}
								value={name}
							/>
						</Form.Group>

						<Form.Group controlId='name'>
							<Form.Label>Brand</Form.Label>
							<Form.Control
								as='input'
								type='text'
								onChange={(e) => setBrand(e.target.value)}
								value={brand}
							/>
						</Form.Group>

						<Form.Group controlId='category'>
							<Form.Label>Category</Form.Label>
							<Form.Control
								as='input'
								type='text'
								onChange={(e) => setCategory(e.target.value)}
								value={category}
							/>
						</Form.Group>

						<Form.Group controlId='description'>
							<Form.Label>Description</Form.Label>
							<Form.Control
								as='textarea'
								rows={description.length / 50}
								style={{ resize: 'none', outline: 'none' }}
								onChange={(e) => setDescription(e.target.value)}
								value={description}
							/>
						</Form.Group>

						<Form.Group controlId='reviews'>
							<Form.Label>Reviews</Form.Label>

							<Table bordered striped hover>
								<thead>
									<tr>
										<td>Name</td>
										<td>Rating</td>
										<td>Comment</td>
									</tr>
								</thead>
								<tbody>
									{product &&
										product.reviews.map((review, index) => (
											<tr key={index}>
												<td>{review.name}</td>
												<td>{review.rating}</td>
												<td>{review.comment}</td>
											</tr>
										))}
								</tbody>
							</Table>
						</Form.Group>

						<Form.Group controlId='rating'>
							<Form.Label>Rating</Form.Label>
							<Form.Control
								as='input'
								type='text'
								onChange={(e) => setRating(e.target.value)}
								value={rating}
							/>
						</Form.Group>

						<Form.Group controlId='numReviews'>
							<Form.Label>NumReviews</Form.Label>
							<Form.Control
								as='input'
								type='text'
								onChange={(e) => setNumReviews(e.target.value)}
								value={numReviews}
							/>
						</Form.Group>

						<Form.Group controlId='price'>
							<Form.Label>Price</Form.Label>
							<Form.Control
								as='input'
								type='text'
								onChange={(e) => setPrice(e.target.value)}
								value={price}
							/>
						</Form.Group>

						<Form.Group controlId='countInStock'>
							<Form.Label>Count In Stock</Form.Label>
							<Form.Control
								as='input'
								type='text'
								onChange={(e) => setCountInStock(e.target.value)}
								value={countInStock}
							/>
						</Form.Group>
					</Form>
				)}
			</FormContainer>
		</>
	)
}

export default ProductEditScreen
