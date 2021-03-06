import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Image, Table } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Link } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import { getProduct, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

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
	const [uploading, setUploading] = useState(false)

	const { userInfo } = useSelector((state) => state.userLogin)
	const { product, loading, error } = useSelector((state) => state.getProduct)

	const {
		loading: loadingProductUpdate,
		error: errorProductUpdate,
		success: successProductUpdate,
	} = useSelector((state) => state.productUpdate)

	useEffect(() => {
		if (!userInfo.name || !userInfo.isAdmin) {
			history.push('/login')
		} else if (
			!product ||
			productId !== product._id ||
			product === undefined ||
			!product.name
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
	}, [dispatch, history, userInfo, productId, product])

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0]
		const formData = new FormData()
		formData.append('image', file)
		setUploading(true)
		try {
			const response = await fetch('/api/upload', {
				headers: { authorization: `Bearer ${userInfo.token}` },
				method: 'POST',
				body: formData,
			})

			const data = await response.text()

			setImage(data)
			setUploading(false)
		} catch (error) {
			console.error(error)
			setUploading(false)
		}
	}

	const submitHandler = (e) => {
		e.preventDefault()

		dispatch(
			updateProduct({
				_id: id,
				user: userInfo._id,
				description,
				category,
				brand,
				image,
				name,
				rating,
				price,
				numReviews,
				countInStock,
			})
		)

		setTimeout(() => {
			dispatch({ type: PRODUCT_UPDATE_RESET })
		}, 4000)
	}

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
						<Form.Group controlId='image'>
							<Form.Label>Image</Form.Label>
							<Image src={image} alt={name} fluid />
							<Form.Control
								className='my-3'
								type='text'
								required
								onChange={(e) => setName(e.target.value)}
								value={image}
								placeholder='Enter image Url'
							></Form.Control>
							<Form.File
								id='image-file'
								label='Choose an image'
								custom
								onChange={uploadFileHandler}
							></Form.File>
							{uploading && <Loader />}
						</Form.Group>

						<Form.Group controlId='id'>
							<Form.Label>Id</Form.Label>
							<Form.Control
								disabled
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

						<Form.Group controlId='brand'>
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

						<Table bordered size='sm'>
							<thead>
								<tr>
									<th>Rating</th>
									<th>Number of Reviews</th>
									<th>Price</th>
									<th>Count in Stock</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td style={{ width: '21%' }}>
										<Form.Control
											type='number'
											required
											onChange={(e) => setRating(e.target.value)}
											value={rating}
											placeholder='0'
										></Form.Control>
									</td>
									<td style={{ width: '25%' }}>
										<Form.Control
											type='number'
											required
											onChange={(e) => setNumReviews(e.target.value)}
											value={numReviews}
											placeholder='0'
										></Form.Control>
									</td>
									<td style={{ width: '30%' }}>
										<Form.Control
											type='number'
											required
											onChange={(e) => setPrice(e.target.value)}
											value={price}
											placeholder='0'
										></Form.Control>
									</td>
									<td>
										<Form.Control
											type='number'
											required
											onChange={(e) => setCountInStock(e.target.value)}
											value={countInStock}
											placeholder='0'
										></Form.Control>
									</td>
								</tr>
							</tbody>
						</Table>

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

						<Button type='submit' variant='outline-dark' className='my-3'>
							Update product
						</Button>
						{loadingProductUpdate ? (
							<Loader />
						) : errorProductUpdate ? (
							<Message variant='danger'>{errorProductUpdate}</Message>
						) : (
							successProductUpdate && (
								<Message className='float-right' variant='success'>
									Product Updated
								</Message>
							)
						)}
					</Form>
				)}
			</FormContainer>
			<Link to={`/admin/productlist`} className='btn btn-light btn-sm py-3'>
				Go Back
			</Link>
		</>
	)
}

export default ProductEditScreen
