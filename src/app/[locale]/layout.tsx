
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from 'react-bootstrap';
import ReduxProvider from '@/components/ReduxProvider';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Welcome to ProShop',
  description: 'Find the best products for the cheapest prices',
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: Promise<{locale: string}>
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
			integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w=="
			crossOrigin="anonymous"
		/>
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider>
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
              <Header />
              <main className="py-3">
                  <Container>
                      {children}
                  </Container>
              </main>
              <Footer />
          </ReduxProvider>
        </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
