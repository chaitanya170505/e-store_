import { products } from "@/app/data/products";
import AddToCartButton from "@/components/AddToCartButton";
import styles from "./ProductDetailsPage.module.css";

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;

  const product = products.find((p) => p.id === id);

  if (!product) {
    return <p className={styles.notFound}>Product not found</p>;
  }

  return (
    <section className={styles.container}>
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className={styles.image}
      />

      {/* Product Info */}
      <div className={styles.infoCard}>
        <h1 className={styles.name}>{product.name}</h1>
        <p className={styles.price}>₹{product.price}</p>
        <p className={styles.text}>
          <strong>Category:</strong> {product.category}
        </p>
        <p className={styles.text}>
          <strong>Description:</strong>{" "}
          {product.description ||
            "This is a premium quality product carefully crafted for you."}
        </p>

        {/* Add to Cart Button */}
        <AddToCartButton productId={product.id} />
      </div>
    </section>
  );
}
