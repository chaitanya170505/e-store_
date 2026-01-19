import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link
  href={`/product/${product.id}`}
  style={{
    ...styles.card,
    backgroundImage: `linear-gradient(
      rgba(1, 69, 96, 0.65),
      rgba(1, 69, 96, 0.65)
    ), url(${product.image})`,
  }}
>

      <div style={styles.content}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.price}>₹{product.price}</p>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    height: "280px",
    borderRadius: "18px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    textDecoration: "none",
    boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "flex-end",
    transition: "transform 0.3s ease",
  },
  content: {
    width: "100%",
    padding: "18px",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))",
    borderBottomLeftRadius: "18px",
    borderBottomRightRadius: "18px",
  },
  name: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  price: {
    color: "#fbbf24",
    fontSize: "16px",
    fontWeight: 700,
  },
};
