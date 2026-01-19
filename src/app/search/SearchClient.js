"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { products } from "@/app/data/products";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>
        Search results for "{query}"
      </h2>

      {results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={styles.grid}>
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

const styles = {
  section: {
    padding: "60px 40px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
  },
};
