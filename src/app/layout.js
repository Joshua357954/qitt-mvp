import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";
import ProtectedRoute from "@/utils/ProtectedRoute";
import Head from "next/head";

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

const atypDisplay = localFont({
  src: [
    { path: "./fonts/AtypDisplayTRIAL-Light.otf", weight: "300" },
    { path: "./fonts/AtypDisplayTRIAL-Regular.otf", weight: "400" },
    { path: "./fonts/AtypDisplayTRIAL-Medium.otf", weight: "500" },
    { path: "./fonts/AtypDisplayTRIAL-Semibold.otf", weight: "600" },
    { path: "./fonts/AtypDisplayTRIAL-Bold.otf", weight: "700" },
  ],
  variable: "--font-aeonik",
});

export const metadata = {
  title: "Qitt - Smart Learning",
  description:
    "Qitt helps students access academic resources, career opportunities, and financial aid.",
};

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang="en">
        <body
          className={`${atypDisplay.variable} ${geistMono.variable} antialiased`}
        >
          <ProtectedRoute>
            <Suspense
              fallback={
                <div className="text-center my-12 text-md font-semibold font-aeonik">
                  Loading...
                </div>
              }
            >
              {children}
            </Suspense>
          </ProtectedRoute>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={true}
          />
        </body>
      </html>
    </StoreProvider>
  );
}
