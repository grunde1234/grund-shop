import Header from "@/components/shared/header";
import Footer from "@/components/Footer"

type Props = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: Props) {
  return (
    <div className="flex h-screen flex-col inset-0 z-0 bg-gradient-dark">
      <Header />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}
