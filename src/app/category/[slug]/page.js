import { products } from "@/app/data/products";
import ProductCard from "@/components/ProductCard";
import styles from "./CategoryPage.module.css"; // import CSS module

export default async function CategoryPage({ params }) {
  // Unwrap params if it's a Promise
  const { slug } = await params; // <-- await here

  const filteredProducts = products.filter(
    (product) => product.category === slug
  );

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{slug?.toUpperCase()}</h2>

      {filteredProducts.length === 0 ? (
        <p className={styles.noProducts}>No products found</p>
      ) : (
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
