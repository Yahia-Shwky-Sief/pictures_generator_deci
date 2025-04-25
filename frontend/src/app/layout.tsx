import Header from '@/components/header';
import '../styles/globals.css';
import { ReactNode } from 'react';
import Footer from '@/components/footer';

export const metadata = {
    title: 'Pictures Generator',
    description: 'Generate pictures with ease',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html>
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}