import "./globals.css";
import { Roboto, Oleo_Script } from "next/font/google";
import Nav from "@/components/Nav";
import Hydrate from "@/components/Hydrate";
import { Suspense } from "react";
import Loading from "./loading";
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "Travelgram",
  description: "A simple & fun wat to share your travel photos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <Hydrate>
        <Suspense fallback={<Loading />}>{children}</Suspense>
        <Nav />
      </Hydrate>
    </html>
  );
}
