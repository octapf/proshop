
'use client';
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslations } from 'next-intl';

const Footer = () => {
    const t = useTranslations('Footer');
	return (
		<footer>
			<Container>
				<Row>
					<Col className='text-center py-3' dangerouslySetInnerHTML={{__html: t('copyright')}}></Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
