import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Table, Image } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { createProduct } from '../actions/productActions'
import { Link } from 'react-router-dom'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductCreateScreen = ({ history }) => {
	const dispatch = useDispatch()

	const [name, setName] = useState('')
	const [image, setImage] = useState('/images/phone.jpg')
	const [brand, setBrand] = useState('')
	const [category, setCategory] = useState('')
	const [description, setDescription] = useState('')
	const [rating, setRating] = useState(0)
	const [numReviews, setNumReviews] = useState(0)
	const [price, setPrice] = useState(0)
	const [countInStock, setCountInStock] = useState(0)
	const [uploading, setUploading] = useState(false)

	const { userInfo } = useSelector((state) => state.userLogin)
	const { error, success, loading } = useSelector(
		(state) => state.productCreate
	)

	useEffect(() => {
		if (!userInfo.name) {
			history.push('/login')
		} else if (!userInfo.isAdmin) {
			history.push('/')
		}
	}, [userInfo, history])

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
			createProduct({
				user: userInfo._id,
				name,
				image,
				brand,
				category,
				description,
				rating,
				numReviews,
				price,
				countInStock,
			})
		)
		setTimeout(() => {
			dispatch({ type: PRODUCT_CREATE_RESET })
		}, 4000)
	}
	return (
		<>
			<Link to='/admin/productlist' className='btn btn-light btn-sm py-3'>
				Go Back
			</Link>
			<FormContainer>
				<h2 className='my-3'>Create Product</h2>
				{loading ? (
					<Loader />
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
								label='Choose File'
								custom
								onChange={uploadFileHandler}
							></Form.File>
							{uploading && <Loader />}
						</Form.Group>

						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='text'
								required
								onChange={(e) => setName(e.target.value)}
								value={name}
								placeholder='Enter name'
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='brand'>
							<Form.Label>Brand</Form.Label>
							<Form.Control
								type='text'
								required
								onChange={(e) => setBrand(e.target.value)}
								value={brand}
								placeholder='Enter brand'
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='category'>
							<Form.Label>Category</Form.Label>
							<Form.Control
								type='text'
								required
								onChange={(e) => setCategory(e.target.value)}
								value={category}
								placeholder='Enter category'
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='description'>
							<Form.Label>Description</Form.Label>
							<Form.Control
								as='textarea'
								required
								onChange={(e) => setDescription(e.target.value)}
								value={description}
								placeholder='Enter description'
							></Form.Control>
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
											type='text'
											required
											onChange={(e) => setCountInStock(e.target.value)}
											value={countInStock}
											placeholder='0'
										></Form.Control>
									</td>
								</tr>
							</tbody>
						</Table>

						<Button
							type='submit'
							variant='outline-dark'
							className='btn-sm mb-3'
						>
							Create Product
						</Button>
						{error ? (
							<Message variant='danger'>{error}</Message>
						) : (
							success && <Message variant='success'>Product Created</Message>
						)}
					</Form>
				)}
			</FormContainer>
			<Link to='/admin/productlist' className='btn btn-light btn-sm py-3'>
				Go Back
			</Link>
		</>
	)
}

export default ProductCreateScreen
