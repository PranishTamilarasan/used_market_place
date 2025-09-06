import React from "react";
import "../styles.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="desktop-container">
      {/* Header/Navbar */}

    <header className="navbar">
    <div className="navbar-logo">EcoFinds</div>
    <nav className="navbar-links">
        <Link to="/cosmetics">Cosmetics</Link>
        <Link to="/fragrance">Fragrance</Link>
        <Link to="/skin">Skin</Link>
        <Link to="/discover">Discover</Link>
    </nav>
    <div className="navbar-icons">
        <Link to="/wishlist" title="Wishlist">♥</Link>
        <Link to="/profile" title="Profile">👤</Link>
        <Link to="/search" title="Search">🔍</Link>
        <Link to="/cart" title="Cart">🛒</Link>
    </div>
    </header>


      {/* Hero/banner section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Discover Luxury Beauty</h1>
          <p>Minimal elegance. Curated cosmetics and fragrances for you.</p>
          <button className="btn-primary">Shop Now</button>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80" alt="Luxury Beauty" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {[
            { title: "Cosmic Perfume", price: "₹151.20", img: "https://images.unsplash.com/photo-1612817159949-195b77fcf5da?auto=format&fit=crop&w=400&q=80" },
            { title: "Summer Kit", price: "₹141.30", img: "https://images.unsplash.com/photo-1585386959984-a4155223f5b4?auto=format&fit=crop&w=400&q=80" },
            { title: "Glow Skincare", price: "₹99.00", img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&q=80" }
          ].map((product, idx) => (
            <div key={idx} className="product-card">
              <img src={product.img} alt={product.title} />
              <div className="product-info">
                <h6>{product.title}</h6>
                <p>{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 EcoFinds. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
