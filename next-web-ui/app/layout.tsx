import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { AuthProvider } from '../context/AuthContext';
import "./globals.css";

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

// 1. අපි මෙතනින් මුළු ප්‍රොජෙක්ට් එකටම අදාළ ප්‍රධාන පාටවල් (Global Colors) නිර්වචනය කරනවා
const theme = createTheme({
  primaryColor: 'darkGreen', // මුළු වෙබ්සයිට් එකේම ප්‍රධාන පාට (Primary) විදියට 'teal' (කොළ පාට) දානවා
  colors: {
    // අර Title වලට පාවිච්චි කරපු තද කොළ පාටත් අපි වෙනමම නමකින් ('darkGreen') හදලා තියාගන්නවා
    darkGreen: [
      '#eef8f2', '#dcf1e4', '#b5e3c8', '#8cd5aa', '#6ac890',
      '#53bf7e', '#45ba74', '#36a362', '#2c9256', '#1b4332' // Index 9 තමයි #1b4332
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
        {/* 2. අපි හදපු ඒ Theme එක මෙතනින් මුළු App එකටම Apply කරනවා */}
        <MantineProvider theme={theme}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
