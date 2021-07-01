import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Image } from 'react-bootstrap'
import { listProducts } from '../actions/productActions'

const ProductListScreen = ({ history }) => {
	const dispatch = useDispatch()

	const { userInfo } = useSelector((state) => state.userLogin)
	const { products } = useSelector((state) => state.productList)

	useEffect(() => {
		if (!userInfo || !userInfo.isAdmin) {
			history.push('/login')
		} else if (!products || products.length === 0) {
			dispatch(listProducts())
		}
	}, [history, products, dispatch, userInfo])

	const handleDelete = (id) => {
		//dispatch deleteProduct -p -ad
	}

	return (
		<Table striped bordered hover responsive size='sm'>
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Image</th>
					<th>Brand</th>
					<th>Category</th>
					<th>Description</th>
					<th>NumReviews</th>
					<th>Rating</th>
					<th>Price</th>
					<th>Count In Stock</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{products &&
					products.map((product) => (
						<tr>
							<th>{product._id.slice(0, 7)}...</th>
							<th>{product.name.slice(0, 10)}...</th>
							<th>
								<Image src={product.image} size='sm' fluid></Image>
							</th>
							<th>{product.brand}</th>
							<th>{product.category}</th>
							<th>{product.description.slice(0, 10)}...</th>
							<th>{product.numReviews}</th>
							<th>{product.rating}</th>
							<th>${product.price}</th>
							<th>{product.countInStock}</th>
							<th>
								<LinkContainer to={`/admin/product/${product._id}/edit`}>
									<Button variant='outline-dark' className='btn-sm'>
										<i className='fas fa-edit'></i>
									</Button>
								</LinkContainer>
							</th>
							<th>
								<Button
									variant='outline-danger'
									className='btn-sm'
									onClick={(e) => handleDelete(product._id)}
								>
									<i className='fas fa-trash'></i>
								</Button>
							</th>
						</tr>
					))}
			</tbody>
		</Table>
	)
}

export default ProductListScreen
