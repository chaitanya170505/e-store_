import Link from "next/link";

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Clothing",
    slug: "clothing",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Categories() {
  return (
    <section className="categories-section">
      <h2 className="categories-heading">Shop by Category</h2>

      <div className="categories-grid">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="category-card"
            style={{
              backgroundImage: `linear-gradient(
                rgba(1, 69, 96, 0.65), 
                rgba(1, 69, 96, 0.65)
              ), url(${cat.image})`,
            }}
          >
            <h3 className="category-card-text">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}