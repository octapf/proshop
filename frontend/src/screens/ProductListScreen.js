import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct } from '../actions/productActions'
import { PRODUCT_DELETE_RESET } from '../constants/productConstants'

const ProductListScreen = ({ history, match }) => {
	const pageNumber = match.params.pageNumber || 1

	const dispatch = useDispatch()
	const [reRender, setReRender] = useState(false)

	const { userInfo } = useSelector((state) => state.userLogin)
	const { loading, error, products, page, pages } = useSelector(
		(state) => state.productList
	)
	const { error: errorDeleteProduct, success: successDelete } = useSelector(
		(state) => state.productDelete
	)

	useEffect(() => {
		if (!userInfo.name || !userInfo.isAdmin) {
			history.push('/login')
		} else {
			dispatch(listProducts('', pageNumber))
		}
	}, [history, dispatch, userInfo, reRender, pageNumber])

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure?')) {
			await dispatch(deleteProduct(id))
			setReRender(!reRender)
		}
		setTimeout(() => {
			dispatch({ type: PRODUCT_DELETE_RESET })
		}, 4000)
	}

	return (
		<>
			<h2 className='py-3'>Products</h2>
			{loading ? (
				<Loader />
			) : (
				<>
					<Table striped bordered hover size='sm' style={{ width: '1200px' }}>
						<thead>
							<tr>
								<th>ID</th>
								<th>Image</th>
								<th>Name</th>
								<th>Brand</th>
								<th>Category</th>

								<th>NumReviews</th>
								<th>Rating</th>
								<th>Price</th>
								<th>Count In Stock</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{error ? (
								<Message variant='danger'>{error}</Message>
							) : !products ? (
								<Message variant='danger'>
									There are no products. Create One.
								</Message>
							) : (
								products &&
								products.map((product) => (
									<tr key={product._id}>
										<td>
											<Link to={`/product/${product._id}`}>{product._id}</Link>
										</td>

										<td>
											<Link to={`/product/${product._id}`}>
												<Image
													src={product.image}
													width='350'
													height='350'
													fluid
												></Image>
											</Link>
										</td>
										<td>
											<Link to={`/product/${product._id}`}>{product.name}</Link>
										</td>

										<td>{product.brand}</td>
										<td>{product.category}</td>

										<td>{product.numReviews}</td>
										<td>{product.rating}</td>
										<td>${product.price.toFixed(2)}</td>
										<td>{product.countInStock}</td>
										<td>
											<LinkContainer to={`/admin/product/${product._id}/edit`}>
												<Button variant='outline-dark' className='btn-sm'>
													<i className='fas fa-edit'></i>
												</Button>
											</LinkContainer>
										</td>
										<td>
											<Button
												variant='outline-danger'
												className='btn-sm'
												onClick={(e) => handleDelete(product._id)}
											>
												<i className='fas fa-trash'></i>
											</Button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</Table>
					<Paginate pages={pages} page={page} isAdmin={true} />
				</>
			)}

			<LinkContainer to={`/admin/product/create`}>
				<Button type='button' variant='outline-dark' className='my-3'>
					<i className='fas fa-plus'></i> Create Product
				</Button>
			</LinkContainer>
			{errorDeleteProduct ? (
				<Message variant='danger'>{errorDeleteProduct}</Message>
			) : (
				successDelete && <Message variant='danger'>Product Deleted</Message>
			)}
		</>
	)
}

export default ProductListScreen
