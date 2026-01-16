
'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { logout } from '@/redux/actions/userActions';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from './ThemeProvider';
import SearchBox from './SearchBox';

const Header = () => {
    const dispatch = useDispatch();
    const { theme, toggleTheme } = useTheme();
    const t = useTranslations('Header');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    
    const userLogin = useSelector((state: any) => state.userLogin) || {};
    const { userInfo } = userLogin;

    const logoutHandler = () => {
        // @ts-ignore
        dispatch(logout());
    };

    const changeLanguage = (newLocale: string) => {
        router.replace(pathname, {locale: newLocale});
    }

    return (
        <header>
            <Navbar className="glass-navbar ms-auto" variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <Navbar.Brand as={Link} href="/">{t('title')}</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                     <Navbar.Collapse id='basic-navbar-nav'>
                        <SearchBox />
                        <Nav className='ms-auto'>
                             <Nav.Link onClick={toggleTheme}>
                                <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
                             </Nav.Link>
                             <NavDropdown title={locale.toUpperCase()} id='language'>
                                <NavDropdown.Item onClick={() => changeLanguage('en')}>English</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => changeLanguage('es')}>Español</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => changeLanguage('it')}>Italiano</NavDropdown.Item>
                             </NavDropdown>

                            <Nav.Link as={Link} href="/wishlist">
                                <i className='fas fa-heart'></i> Wishlist
                            </Nav.Link>

                            <Nav.Link as={Link} href="/cart">
                                <i className='fas fa-shopping-cart'></i> {t('cart')}
                            </Nav.Link>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                     <NavDropdown.Item as={Link} href="/profile">{t('profile')}</NavDropdown.Item>
                                     <NavDropdown.Item onClick={logoutHandler}>{t('logout')}</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link as={Link} href="/login">
                                    <i className='fas fa-user'></i> {t('login')}
                                </Nav.Link>
                            )}
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title={t('admin')} id='adminmenu'>
                                    <NavDropdown.Item as={Link} href="/admin/userlist">{t('users')}</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} href="/admin/productlist">{t('products')}</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} href="/admin/orderlist">{t('orders')}</NavDropdown.Item>
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
