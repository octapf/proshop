
'use client';
import React from 'react'
import { Alert } from 'react-bootstrap'

const Message = ({ variant = 'info', children }: { variant?: string, children: React.ReactNode }) => {
	return <Alert variant={variant}>{children}</Alert>
}

export default Message
