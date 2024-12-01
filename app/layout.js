import { Lato, Megrim } from "next/font/google";
import "./globals.css";

const megrim = Megrim({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-megrim",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"], // Include the weights you need
});

export const metadata = {
  title: "Ballroom Music Quiz",
  description: "Do you know your partner dance genres?",
  viewport: "width=device-width, initial-scale=1.0", // Add the viewport meta tag here
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${megrim.variable} ${lato.variable}`}
    >
      <body
        className={`${lato.variable} antialiased`}
      >
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
