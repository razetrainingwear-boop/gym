import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component - Updates meta tags dynamically for each page
 * Improves search engine rankings and social sharing
 */
const SEO = ({ 
  title = 'RAZE Training', 
  description = 'Premium athletic wear designed by gymnasts, for gymnasts.',
  image = '/images/products/front_shirt_black_cyan.png',
  type = 'website',
  product = null
}) => {
  const location = useLocation();
  const baseUrl = 'https://razetraining.com';
  const fullUrl = `${baseUrl}${location.pathname}`;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  useEffect(() => {
    // Update title
    document.title = title.includes('RAZE') ? title : `${title} | RAZE Training`;
    
    // Helper to update or create meta tag
    const updateMeta = (property, content, isName = false) => {
      const attr = isName ? 'name' : 'property';
      let meta = document.querySelector(`meta[${attr}="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    // Update SEO meta tags
    updateMeta('description', description, true);
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:image', fullImage);
    updateMeta('og:url', fullUrl);
    updateMeta('og:type', type);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', fullImage);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);
    
    // Add product structured data if product page
    if (product) {
      let script = document.querySelector('script[data-product-schema]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-product-schema', 'true');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": product.description,
        "brand": {
          "@type": "Brand",
          "name": "RAZE Training"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": product.price,
          "availability": product.inStock 
            ? "https://schema.org/InStock" 
            : "https://schema.org/PreOrder"
        }
      });
    }
    
    // Cleanup
    return () => {
      const productScript = document.querySelector('script[data-product-schema]');
      if (productScript) productScript.remove();
    };
  }, [title, description, fullImage, fullUrl, type, product]);
  
  return null; // This component doesn't render anything
};

// Pre-configured SEO for common pages
export const PageSEO = {
  home: () => (
    <SEO 
      title="RAZE Training - Performance Gear for Gymnasts | Built by Discipline"
      description="Premium athletic wear designed by gymnasts, for gymnasts. Engineered for peak performance in MAG & WAG training. Shop the collection."
    />
  ),
  
  products: () => (
    <SEO 
      title="Shop Collection - Performance T-Shirts | RAZE Training"
      description="Browse our collection of premium performance t-shirts. Engineered for gymnastics training with moisture-wicking, breathable fabric."
      image="/images/products/front_shirt_black_cyan.png"
    />
  ),
  
  about: () => (
    <SEO 
      title="About RAZE - Built by Gymnasts, for Gymnasts"
      description="RAZE Training was founded by competitive gymnasts who understand what athletes need. Our mission is to create the perfect training gear."
    />
  ),
  
  cart: () => (
    <SEO 
      title="Your Cart | RAZE Training"
      description="Review your RAZE Training cart and checkout. Free shipping on orders over $100."
    />
  ),
  
  checkout: () => (
    <SEO 
      title="Checkout | RAZE Training"
      description="Complete your RAZE Training order. Secure checkout with multiple payment options."
    />
  ),
  
  product: (product) => (
    <SEO 
      title={`${product.name} - ${product.color} | RAZE Training`}
      description={`${product.name} in ${product.color}. ${product.description || 'Premium performance wear for gymnasts.'}`}
      image={product.image}
      type="product"
      product={{
        name: product.name,
        image: product.image,
        description: product.description,
        price: product.price,
        inStock: product.inStock
      }}
    />
  )
};

export default SEO;
