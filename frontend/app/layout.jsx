import "@/styles/globals.css";

export const metadata = {
    title: "Wallet Wiz",
    description: "Splitting Payments Made Easy",
  };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}
        
      </body>
    </html>
  );
}
