'use client';
import React, { useEffect, Suspense } from 'react'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '@/components/Message'
import Loader from '@/components/Loader'
import Paginate from '@/components/Paginate'
import {
	listProducts,
	deleteProduct,
	createProduct,
} from '@/redux/actions/productActions'
import { PRODUCT_CREATE_RESET } from '@/redux/constants/productConstants'
import Link from 'next/link'
import { useRouter, useParams, useSearchParams } from 'next/navigation'

const ProductListContent = () => {
    const params = useParams();
    const searchParams = useSearchParams();
	const pageNumber = searchParams.get('pageNumber') || 1
    const router = useRouter();

	const dispatch = useDispatch<any>()

	const productList = useSelector((state: any) => state.productList)
	const { loading, error, products, page, pages } = productList

	const productDelete = useSelector((state: any) => state.productDelete)
	const {
		loading: loadingDelete,
		error: errorDelete,
		success: successDelete,
	} = productDelete

	const productCreate = useSelector((state: any) => state.productCreate)
	const {
		loading: loadingCreate,
		error: errorCreate,
		success: successCreate,
		product: createdProduct,
	} = productCreate

	const userLogin = useSelector((state: any) => state.userLogin)
	const { userInfo } = userLogin

	useEffect(() => {
		dispatch({ type: PRODUCT_CREATE_RESET })

		if (!userInfo || !userInfo.isAdmin) {
			router.push('/login')
		}

		if (successCreate) {
			router.push(`/admin/product/${createdProduct._id}/edit`)
		} else {
            // @ts-ignore
			dispatch(listProducts('', pageNumber))
		}
	}, [
		dispatch,
		router,
		userInfo,
		successDelete,
		successCreate,
		createdProduct,
		pageNumber,
	])

	const deleteHandler = (id: string) => {
		if (window.confirm('Are you sure')) {
            // @ts-ignore
			dispatch(deleteProduct(id))
		}
	}

	const createProductHandler = () => {
        // @ts-ignore
		dispatch(createProduct())
	}

	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className='text-right'>
					<Button className='my-3' onClick={createProductHandler}>
						<i className='fas fa-plus'></i> Create Product
					</Button>
				</Col>
			</Row>
			{loadingDelete && <Loader />}
			{errorDelete && <Message variant='danger'>{errorDelete}</Message>}
			{loadingCreate && <Loader />}
			{errorCreate && <Message variant='danger'>{errorCreate}</Message>}
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>CATEGORY</th>
								<th>BRAND</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{products.map((product: any) => (
								<tr key={product._id}>
									<td>{product._id}</td>
									<td>{product.name}</td>
									<td>${product.price}</td>
									<td>{product.category}</td>
									<td>{product.brand}</td>
									<td>
                                        <Link href={`/admin/product/${product._id}/edit`}>
                                            <Button variant='light' className='btn-sm'>
												<i className='fas fa-edit'></i>
											</Button>
                                        </Link>
										<Button
											variant='danger'
											className='btn-sm'
											onClick={() => deleteHandler(product._id)}
										>
											<i className='fas fa-trash'></i>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Paginate pages={pages} page={page} isAdmin={true} />
				</>
			)}
		</>
	)
}

const ProductListScreen = () => {
    return (
        <Suspense fallback={<Loader />}>
            <ProductListContent />
        </Suspense>
    )
}

export default ProductListScreen
