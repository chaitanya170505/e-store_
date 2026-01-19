import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Hero />

      <section style={styles.lightSection}>
        <Categories />
      </section>

      <section style={styles.lightSectionAlt}>
        <FeaturedProducts />
      </section>
    </>
  );
}

const styles = {
  lightSection: {
    backgroundColor: "#f9fafb", // light white
    padding: "80px 60px",
  },
  lightSectionAlt: {
    backgroundColor: "#f5f7fa", // slightly different light white
    padding: "80px 60px",
  },
};
