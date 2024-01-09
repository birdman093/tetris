
import "~/styles/globals.css";
import { Inter } from "next/font/google";



const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Tetris",
  description: "Tetris - For Fun",
  icons: [{ rel: "icon", url: "/feathers.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
