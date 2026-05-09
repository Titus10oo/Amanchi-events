import "./globals.css";

export const metadata = {
  title: "Amanchi Events",
  description: "A modern event and community operating system."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
