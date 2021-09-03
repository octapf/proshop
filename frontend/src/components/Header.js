import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'

const Header = ({ history }) => {
	const dispatch = useDispatch()

	const [name, setName] = useState('')

	const { userInfo } = useSelector((state) => state.userLogin)
	const { userInfo: userInfoUpdated } = useSelector(
		(state) => state.userUpdateProfile
	)
	useEffect(() => {
		if (userInfoUpdated.name) {
			setName(userInfoUpdated.name)
		} else {
			setName(userInfo.name)
		}
	}, [userInfo, userInfoUpdated])

	const logoutHandler = () => {
		dispatch(logout())
	}

	return (
		<header style={{ position: 'sticky', top: '0', zIndex: '100' }}>
			<Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
				<Container>
					<LinkContainer to='/'>
						<Navbar.Brand>ProShop</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Route render={({ history }) => <SearchBox history={history} />} />
						<Nav className='ml-auto'>
							<LinkContainer to='/cart'>
								<Nav.Link>
									<i className='fas fa-shopping-cart'></i> Cart
								</Nav.Link>
							</LinkContainer>

							{userInfo.name ? (
								<NavDropdown title={name} id='username'>
									<LinkContainer to='/profile'>
										<NavDropdown.Item>Profile</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<>
									<LinkContainer to='/login'>
										<Nav.Link>
											<i className='fas fa-sign-in-alt'></i> Sign in
										</Nav.Link>
									</LinkContainer>

									<LinkContainer to='/register'>
										<Nav.Link>
											<i className='fas fa-user-plus'></i> Join
										</Nav.Link>
									</LinkContainer>
								</>
							)}
							{userInfo.name && userInfo.isAdmin && (
								<NavDropdown title='Admin' id='adminmenu'>
									<LinkContainer to='/admin/userlist'>
										<NavDropdown.Item>Users</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/productlist'>
										<NavDropdown.Item>Products</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/orderlist'>
										<NavDropdown.Item>Orders</NavDropdown.Item>
									</LinkContainer>
								</NavDropdown>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	)
}

export default Header
