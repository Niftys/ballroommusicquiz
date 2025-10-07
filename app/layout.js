import { Inter } from "next/font/google";
import "./globals.css";
import AnimationWrapper from "./components/AnimationWrapper"; // Import wrapper

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Ballroom Music Quiz",
  description: "Do you know your partner dance genres?",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable}`}
    >
      <body className={`${inter.variable} antialiased`}>
        <AnimationWrapper>
          {children}
        </AnimationWrapper>
      </body>
    </html>
  );
}
