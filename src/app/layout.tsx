
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './bootstrap.min.css';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from 'react-bootstrap';
import ReduxProvider from '@/components/ReduxProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Welcome to ProShop',
  description: 'Find the best products for the cheapest prices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
			integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w=="
			crossOrigin="anonymous"
		/>
      </head>
      <body className={inter.className}>
        <ReduxProvider>
            <Header />
            <main className="py-3">
                <Container>
                    {children}
                </Container>
            </main>
            <Footer />
        </ReduxProvider>
      </body>
    </html>
  )
}
