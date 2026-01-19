"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState("Set Location");
  const router = useRouter();
  const profileRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch location
  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await fetch("/api/location");
        if (res.ok) {
          const data = await res.json();
          if (data?.city && data?.state) setLocation(`${data.city}, ${data.state}`);
        }
      } catch (err) {
        console.error("Error fetching location:", err);
      }
    }
    fetchLocation();
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo-section">
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <Link href="/" className="logo-text">
            E-SHOP <span>.</span>
          </Link>
          <Link href="/location" className="location-section desktop-only">
            📍 <span>{location}</span>
          </Link>
        </div>

        <div className="search-section desktop-only">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            onKeyDown={(e) =>
              e.key === "Enter" &&
              router.push(`/search?q=${encodeURIComponent(e.currentTarget.value)}`)
            }
          />
        </div>

        <nav className="nav-actions">

          <button className="icon-btn cart-btn" onClick={() => router.push("/cart")}>
            🛒 <span className="badge">2</span>
          </button>

          {session ? (
            <div className="profile-container desktop-only" ref={profileRef}>
              <button
                className="icon-btn profile-toggle"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                👤
              </button>
              {isProfileOpen && (
                <div className="dropdown-menu">
                  <Link href="/profile" onClick={() => setIsProfileOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={() => signOut()}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="nav-link desktop-only">
              Login
            </Link>
          )}

          <button
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-nav">
          <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
            Shop
          </Link>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
            Account
          </Link>
          <div className="mobile-search">
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <Link href="/location" onClick={() => setIsMobileMenuOpen(false)}>
            📍 <span>{location}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
