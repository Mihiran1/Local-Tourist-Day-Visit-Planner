import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { AuthProvider } from '../context/AuthContext';
import "./globals.css";
import { TripPlanProvider } from "@/context/TripPlanContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Web UI",
  description: "Generated for Travel App",
};

// 1. Define the global theme for the entire project, including the primary color palette
const theme = createTheme({
  primaryColor: 'darkGreen', // Set 'darkGreen' as the primary color used throughout the entire website
  colors: {
    // Custom dark green color scale used for headings and primary UI elements
    darkGreen: [
      '#eef8f2', '#dcf1e4', '#b5e3c8', '#8cd5aa', '#6ac890',
      '#53bf7e', '#45ba74', '#36a362', '#2c9256', '#1b4332' // Index 9 is the darkest shade (#1b4332)
    ],
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* 2. Apply the custom theme defined above to the entire application */}
        <MantineProvider theme={theme}>
          <AuthProvider>
             <TripPlanProvider>   
            {children}
            </TripPlanProvider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
