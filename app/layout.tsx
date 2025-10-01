import MainLayoutProvider from "./MainLayoutProvider";
import "../src/index.css";

export const metadata = {
  title: 'ExiBy | Organization',
  description: 'ExiBy Organization Management Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <MainLayoutProvider>
          {children}
        </MainLayoutProvider>
      </body>
    </html>
  )
}
