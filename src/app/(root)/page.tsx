import HeroImage from "@/app/(root)/components/HeroImage";
import MainProducts from "./components/MainProducts";
import TopFooter from "./components/FooterTop";
import BottomFooter from "./components/FooterBottom";

export default function Home() {
  return (
    <>
      <HeroImage />
      <MainProducts />
      <TopFooter />
      <BottomFooter />
    </>
  );
}
