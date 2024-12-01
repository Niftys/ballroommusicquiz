import { Lato, Megrim } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Head from "next/head";

const megrim = Megrim({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-megrim',
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"], // Include the weights you need
});

export const metadata = {
  title: "Ballroom Music Quiz",
  description: "Do you know your partner dance genres?",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${megrim.variable} ${lato.variable}`}
    >
      <Head>
        {/* Viewport meta tag ensures proper scaling on mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body
        className={`${lato.variable} antialiased`}
      >
        <main className="container">{children}</main>
      </body>
    </html>
  );
}