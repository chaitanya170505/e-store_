import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Smartwatch",
    price: 4999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 2599,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Backpack",
    price: 1999,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="featured-section">
      <h2 className="featured-heading">Featured Products</h2>

      <div className="featured-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}