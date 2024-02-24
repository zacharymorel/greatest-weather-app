// Node modules.
import { Lato } from "next/font/google";
// Relative modules.
import "@/styles/globals.css";

const googleFont = Lato({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export default function App({ Component, pageProps: { ...pageProps } }) {
  return (
    <div className={googleFont.className}>
      <Component {...pageProps} />
    </div>
  );
}
