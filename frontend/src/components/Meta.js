import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({
	title,
	base,
	meta,
	link,
	script,
	noscript,
	description,
	keywords,
}) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name='description' content={description} />
			<meta name='description' content={keywords} />
		</Helmet>
	)
}

Meta.defaultProps = {
	title: 'Welcome to Proshop',
	description: 'Wel sell the best products for cheap',
	keywords: 'electronics, buy electronics, cheap electronics',
}

export default Meta
