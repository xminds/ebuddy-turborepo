
import './globals.css';
import ReduxProvider  from "../providers/ReduxProvider"

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <ReduxProvider>
   <html lang="en">
     <body>
      {children}
     </body>
   </html>
   </ReduxProvider>
 );
}
