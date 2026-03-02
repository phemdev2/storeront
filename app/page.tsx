import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <ProductGrid />
      </main>

      <Footer />
    </>
  );
}