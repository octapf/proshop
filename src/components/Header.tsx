
'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
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
                    <Navbar.Brand as={Link} href="/">ProShop</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                     <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ml-auto'>
                            <Nav.Link as={Link} href="/cart">
                                <i className='fas fa-shopping-cart'></i> Cart
                            </Nav.Link>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                     <NavDropdown.Item as={Link} href="/profile">Profile</NavDropdown.Item>
                                     <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link as={Link} href="/login">
                                    <i className='fas fa-user'></i> Sign In
                                </Nav.Link>
                            )}
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title='Admin' id='adminmenu'>
                                    <NavDropdown.Item as={Link} href="/admin/userlist">Users</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} href="/admin/productlist">Products</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} href="/admin/orderlist">Orders</NavDropdown.Item>
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
