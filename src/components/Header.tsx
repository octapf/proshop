
'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { logout } from '@/redux/actions/userActions';

const Header = () => {
    const dispatch = useDispatch();
    
    const userLogin = useSelector((state: any) => state.userLogin) || {};
    const { userInfo } = userLogin;

    const logoutHandler = () => {
        // @ts-ignore
        dispatch(logout());
    };

    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <Link href="/" passHref legacyBehavior>
                         <Navbar.Brand>ProShop</Navbar.Brand>
                    </Link>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                     <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ml-auto'>
                            <Link href="/cart" passHref legacyBehavior>
                                <Nav.Link><i className='fas fa-shopping-cart'></i> Cart</Nav.Link>
                            </Link>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                     <Link href="/profile" passHref legacyBehavior>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                     </Link>
                                     <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Link href="/login" passHref legacyBehavior>
                                    <Nav.Link><i className='fas fa-user'></i> Sign In</Nav.Link>
                                </Link>
                            )}
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title='Admin' id='adminmenu'>
                                    <Link href="/admin/userlist" passHref legacyBehavior>
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </Link>
                                    <Link href="/admin/productlist" passHref legacyBehavior>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </Link>
                                    <Link href="/admin/orderlist" passHref legacyBehavior>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </Link>
                                </NavDropdown>
                            )}
                        </Nav>
                     </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};
export default Header;
