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

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Ballroom Music Quiz",
  description: "Do you know your partner dance genres?",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${megrim.variable} ${lato.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}