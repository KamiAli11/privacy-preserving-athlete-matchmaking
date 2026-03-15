
import "./globals.css";
import {AuthProvider} from "@/lib/AuthContext";
import {ToastContainer} from "react-toastify";


export const metadata = {
    title: {
        default: "Boxing System",
        template: "%s | Boxing System",
    },
    description: "Secure boxing matchmaking system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
          style={{ fontFamily: 'system-ui, sans-serif' }}
      >
      <ToastContainer position={'top-center'} />
      <AuthProvider>
          {children}
      </AuthProvider>

      </body>
    </html>
  );
}
