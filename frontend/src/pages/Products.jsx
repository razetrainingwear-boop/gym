import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { products } from '../data/products';
import { shirts, shorts } from '../data/mock';
import ProductModal from '../components/ProductModal';
import WaitlistModal from '../components/WaitlistModal';
import SanitizedImage from '../components/SanitizedImage';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/currency';
import { Star, Heart, Lock } from 'lucide-react';

const Products = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedGender, setSelectedGender] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [waitlistModal, setWaitlistModal] = useState({ isOpen: false, product: null });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleGenderSelect = (productId, gender) => {
    setSelectedGender(prev => ({ ...prev, [productId]: gender }));
    // Reset size when gender changes
    const product = [...shirts, ...shorts].find(p => p.id === productId);
    if (product) {
      const defaultSize = gender === 'mens' ? 'M' : 'S';
      setSelectedSizes(prev => ({ ...prev, [productId]: defaultSize }));
    }
  };

  const handleJoinWaitlist = (product) => {
    const gender = selectedGender[product.id] || 'mens';
    const sizes = product.mensSizes ? (gender === 'mens' ? product.mensSizes : product.womensSizes) : product.sizes;
    const selectedSize = selectedSizes[product.id] || (gender === 'mens' ? 'M' : 'S');
    
    setWaitlistModal({ 
      isOpen: true, 
      product: {
        ...product,
        sizes: sizes || ['XS', 'S', 'M', 'L', 'XL']
      },
      selectedSize,
      selectedGender: gender
    });
  };

  const handleAddToCart = (product, isShirt = true) => {
    const selectedSize = selectedSizes[product.id] || (isShirt ? 'M' : 'M');
    
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      colors: [{ name: product.variant, hex: product.hex, image: product.image }]
    }, product.variant, selectedSize, 1);

    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    if (isInWishlist(product.id, product.variant)) {
      removeFromWishlist(product.id, product.variant);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        variant: product.variant,
        price: product.price,
        image: product.image || product.images?.[0],
        category: product.category
      });
    }
  };

  const isShirtBestSeller = (soldCount) => soldCount >= 300;
  const isShortsBestSeller = (soldCount) => soldCount >= 200;

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1 className="products-title">The Collection</h1>
          <p className="products-subtitle">Performance pieces built for discipline</p>
        </div>

        {/* ROW 1: Performance T-Shirts */}
        <div className="product-row">
          <h3 className="row-title">Performance T-Shirts</h3>
          <div className="product-grid shirts-grid">
            {shirts.map((shirt) => {
              const selectedSize = selectedSizes[shirt.id] || 'M';
              const isAdded = addedToCart[shirt.id];
              const isMostPopular = shirt.mostPopular === true;
              const isBlackShirt = shirt.color === 'Black';
              
              return (
                <div key={shirt.id} className={`product-card ${isMostPopular ? 'most-popular' : ''} ${isBlackShirt ? 'black-product' : ''}`}>
                  {/* Most Popular badge */}
                  {isMostPopular && (
                    <div className="popular-badge">
                      <Star size={12} fill="currentColor" /> Most Popular
                    </div>
                  )}
                  
                  {/* Wishlist heart button */}
                  <button 
                    className={`wishlist-heart ${isInWishlist(shirt.id, shirt.variant) ? 'active' : ''}`}
                    onClick={(e) => handleWishlistToggle(e, shirt)}
                    title={isInWishlist(shirt.id, shirt.variant) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={18} fill={isInWishlist(shirt.id, shirt.variant) ? 'currentColor' : 'none'} />
                  </button>
                  
                  <div 
                    className="product-image-wrapper clickable"
                    onClick={() => handleProductClick(shirt)}
                  >
                    <SanitizedImage 
                      src={shirt.image} 
                      alt={`${shirt.name} - ${shirt.variant}`}
                      className="product-image"
                      lazy={true}
                    />
                    <div className="view-details-hint">Click to view</div>
                  </div>
                  
                  <div className="product-info">
                    <div className="product-variant">{shirt.variant}</div>
                    <div className="product-price-row">
                      {shirt.originalPrice && (
                        <span className="product-original-price">{formatPrice(shirt.originalPrice, i18n.language)}</span>
                      )}
                      <span className="product-price">{formatPrice(shirt.price, i18n.language)}</span>
                    </div>
                    
                    {/* Sold Count */}
                    {shirt.soldCount && (
                      <div className={`product-sold-count ${isShirtBestSeller(shirt.soldCount) ? 'best-seller' : ''}`}>
                        {isShirtBestSeller(shirt.soldCount) && <span className="sold-icon">🔥</span>} {t('product.soldCount', { count: shirt.soldCount.toLocaleString() })}
                      </div>
                    )}
                    
                    {/* Size Selector */}
                    <div className="size-selector">
                      {shirt.sizes.map((size) => (
                        <button
                          key={size}
                          className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                          onClick={() => handleSizeSelect(shirt.id, size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    {/* Add to Cart / Waitlist Button */}
                    <button 
                      className={`btn-add-to-cart ${isAdded ? 'added' : ''} waitlist-btn`}
                      onClick={() => handleJoinWaitlist(shirt)}
                    >
                      <Lock size={16} /> {t('product.joinWaitlist')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 2: Performance Shorts */}
        <div className="product-row">
          <h3 className="row-title">Performance Shorts</h3>
          <div className="product-grid shorts-grid">
            {shorts.map((short) => {
              const gender = selectedGender[short.id] || 'mens';
              const sizes = gender === 'mens' ? short.mensSizes : short.womensSizes;
              const selectedSize = selectedSizes[short.id] || (gender === 'mens' ? 'M' : 'S');
              const isAdded = addedToCart[short.id];
              const isComingSoon = short.status === 'coming_soon';
              const isBlackShort = short.color === 'Black';
              const isMostPopular = short.mostPopular === true;
              
              return (
                <div key={short.id} className={`product-card ${isComingSoon ? 'coming-soon' : ''} ${isBlackShort ? 'black-product' : ''} ${isMostPopular ? 'most-popular' : ''}`}>
                  {/* Most Popular badge for top-selling shorts */}
                  {isMostPopular && !isComingSoon && (
                    <div className="popular-badge">
                      <Star size={12} fill="currentColor" /> Most Popular
                    </div>
                  )}
                  
                  {/* Wishlist heart button - only for available products */}
                  {!isComingSoon && (
                    <button 
                      className={`wishlist-heart ${isInWishlist(short.id, short.variant) ? 'active' : ''}`}
                      onClick={(e) => handleWishlistToggle(e, short)}
                      title={isInWishlist(short.id, short.variant) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart size={18} fill={isInWishlist(short.id, short.variant) ? 'currentColor' : 'none'} />
                    </button>
                  )}
                  
                  <div 
                    className={`product-image-wrapper ${!isComingSoon ? 'clickable' : ''}`}
                    onClick={() => !isComingSoon && handleProductClick(short)}
                  >
                    <SanitizedImage 
                      src={short.image} 
                      alt={`${short.name} - ${short.variant}`}
                      className="product-image"
                      lazy={true}
                    />
                    {!isComingSoon && <div className="view-details-hint">Click to view</div>}
                  </div>
                  
                  <div className="product-info">
                    <div className="product-variant">{short.variant}</div>
                    <div className="product-price-row">
                      {short.originalPrice && (
                        <span className="product-original-price">{formatPrice(short.originalPrice, i18n.language)}</span>
                      )}
                      <span className="product-price">{formatPrice(short.price, i18n.language)}</span>
                    </div>
                    
                    {/* Sold Count */}
                    {short.soldCount && !isComingSoon && (
                      <div className={`product-sold-count ${isShortsBestSeller(short.soldCount) ? 'best-seller' : ''}`}>
                        {isShortsBestSeller(short.soldCount) && <span className="sold-icon">🔥</span>} {t('product.soldCount', { count: short.soldCount.toLocaleString() })}
                      </div>
                    )}
                    
                    {/* Gender Toggle for Shorts */}
                    {!isComingSoon && (
                      <div className="gender-toggle">
                        <button 
                          className={`gender-btn ${gender === 'mens' ? 'active' : ''}`}
                          onClick={() => handleGenderSelect(short.id, 'mens')}
                        >
                          Men's
                        </button>
                        <button 
                          className={`gender-btn ${gender === 'womens' ? 'active' : ''}`}
                          onClick={() => handleGenderSelect(short.id, 'womens')}
                        >
                          Women's
                        </button>
                      </div>
                    )}
                    
                    {/* Size Selector */}
                    {!isComingSoon && (
                      <div className="size-selector">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                            onClick={() => handleSizeSelect(short.id, size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Add to Cart / Waitlist Button */}
                    <button 
                      className={`btn-add-to-cart ${isAdded ? 'added' : ''} waitlist-btn`}
                      onClick={() => handleJoinWaitlist(short)}
                      disabled={isComingSoon}
                    >
                      <Lock size={16} /> {t('product.joinWaitlist')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={waitlistModal.isOpen}
        onClose={() => setWaitlistModal({ isOpen: false, product: null })}
        product={waitlistModal.product}
        initialSize={waitlistModal.selectedSize}
        initialGender={waitlistModal.selectedGender}
      />
    </div>
  );
};

export default Products;
