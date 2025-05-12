import TopNav from "@/app/(root)/components/NavTop";
import MainNav from "@/app/(root)/components/NavMain";
import MainMenu from "@/app/(root)/components/MainMenu";
import BottomFooter from "./components/FooterBottom";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopNav />
      <MainNav />
      <MainMenu />
      <main>{children}</main>
      <BottomFooter />
    </>
  );
}
