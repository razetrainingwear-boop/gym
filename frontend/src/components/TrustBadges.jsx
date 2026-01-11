import React from 'react';
import { Shield, Truck, RefreshCw, Lock } from 'lucide-react';

const TrustBadges = () => {
  return (
    <div className="trust-badges">
      <div className="trust-badge">
        <Shield size={24} />
        <div>
          <span className="trust-title">Secure Checkout</span>
          <span className="trust-subtitle">SSL Encrypted</span>
        </div>
      </div>
      <div className="trust-badge">
        <Truck size={24} />
        <div>
          <span className="trust-title">Free Shipping</span>
          <span className="trust-subtitle">Orders $100+</span>
        </div>
      </div>
      <div className="trust-badge">
        <RefreshCw size={24} />
        <div>
          <span className="trust-title">Easy Returns</span>
          <span className="trust-subtitle">30 Days</span>
        </div>
      </div>
      <div className="trust-badge">
        <Lock size={24} />
        <div>
          <span className="trust-title">100% Secure</span>
          <span className="trust-subtitle">Payment Protected</span>
        </div>
      </div>
    </div>
  );
};

// Payment card wrapper
const PaymentCard = ({ children, bgColor, hasBorder, title }) => (
  <div 
    className="payment-icon-card"
    title={title}
    style={{ 
      backgroundColor: bgColor,
      border: hasBorder ? '1px solid rgba(200,200,200,0.3)' : 'none',
    }}
  >
    {children}
  </div>
);

// Simple text-based icons that render perfectly
const TextIcon = ({ text, color = '#fff', size = '14px', weight = 700, italic = false, spacing = '0' }) => (
  <span style={{ 
    color, 
    fontSize: size, 
    fontWeight: weight, 
    fontStyle: italic ? 'italic' : 'normal',
    letterSpacing: spacing,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }}>
    {text}
  </span>
);

// Mastercard circles - simple and clean
const MastercardCircles = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ 
      width: '24px', 
      height: '24px', 
      borderRadius: '50%', 
      backgroundColor: '#EB001B',
      marginRight: '-8px'
    }} />
    <div style={{ 
      width: '24px', 
      height: '24px', 
      borderRadius: '50%', 
      backgroundColor: '#F79E1B' 
    }} />
  </div>
);

// PayPal logo with two P's
const PayPalLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
    <span style={{ color: '#003087', fontWeight: 800, fontSize: '14px', fontStyle: 'italic' }}>Pay</span>
    <span style={{ color: '#009CDE', fontWeight: 800, fontSize: '14px', fontStyle: 'italic' }}>Pal</span>
  </div>
);

// Apple Pay with Apple icon
const ApplePayLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
    <svg width="16" height="20" viewBox="0 0 16 20" fill="#fff">
      <path d="M13.3 10.5c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.2.8-.6 0-1.6-.8-2.7-.7-1.4 0-2.6.8-3.3 2-1.4 2.5-.4 6.1 1 8.1.7 1 1.5 2.1 2.5 2s1.4-.7 2.6-.7c1.2 0 1.5.7 2.6.7 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.1-.8-2.1-3.1l.2.1zm-2-5.7c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.6 1.4-.5.6-1 1.7-.9 2.6 1 .1 2-.5 2.6-1.3z"/>
    </svg>
    <span style={{ color: '#fff', fontWeight: 500, fontSize: '14px' }}>Pay</span>
  </div>
);

// Google Pay with colored G
const GooglePayLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    <span style={{ color: '#5F6368', fontWeight: 500, fontSize: '14px' }}>Pay</span>
  </div>
);

// Amazon with smile
const AmazonLogo = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <span style={{ color: '#fff', fontWeight: 700, fontSize: '11px', letterSpacing: '-0.5px' }}>amazon</span>
    <svg width="36" height="10" viewBox="0 0 36 10" style={{ marginTop: '-2px' }}>
      <path d="M2 6 Q18 12 34 4" stroke="#FF9900" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M32 2 L34 4 L36 1" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

// Bitcoin Logo - Official Bitcoin symbol
const BitcoinLogo = () => (
  <svg width="22" height="22" viewBox="0 0 32 32" fill="#fff">
    <path d="M22.89 12.54c.31-2.09-1.28-3.21-3.46-3.96l.71-2.84-1.73-.43-.69 2.77c-.45-.11-.92-.22-1.38-.32l.69-2.79-1.73-.43-.71 2.84c-.38-.09-.75-.17-1.11-.26l0-.01-2.39-.6-.46 1.85s1.28.29 1.26.31c.7.17.83.64.81 1.01l-.81 3.26c.05.01.11.03.18.06l-.18-.05-1.14 4.57c-.09.21-.3.53-.79.41.02.03-1.26-.31-1.26-.31l-.86 1.98 2.25.56c.42.11.83.21 1.24.31l-.72 2.88 1.73.43.71-2.85c.47.13.93.25 1.38.36l-.71 2.83 1.73.43.72-2.87c2.95.56 5.17.33 6.11-2.34.75-2.15-.04-3.39-1.59-4.19 1.13-.26 1.98-1.01 2.21-2.55zm-3.95 5.54c-.53 2.15-4.16.99-5.34.7l.95-3.82c1.18.29 4.95.88 4.39 3.12zm.54-5.57c-.49 1.95-3.5.96-4.48.72l.86-3.47c.98.24 4.13.7 3.62 2.75z"/>
  </svg>
);

// Ethereum Logo
const EthereumLogo = () => (
  <svg width="14" height="22" viewBox="0 0 256 417" fill="none">
    <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="#fff" fillOpacity="0.6"/>
    <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="#fff"/>
    <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.601 128.038-180.32z" fill="#fff" fillOpacity="0.6"/>
    <path d="M127.962 416.905v-104.72L0 236.585z" fill="#fff"/>
    <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" fill="#fff" fillOpacity="0.2"/>
    <path d="M0 212.32l127.96 75.638v-133.8z" fill="#fff" fillOpacity="0.6"/>
  </svg>
);

export const PaymentMethods = () => {
  return (
    <div className="footer-payment-methods">
      <span className="payment-label">WE ACCEPT</span>
      <div className="payment-icons-grid">
        {/* Visa - dark blue with white italic text */}
        <PaymentCard bgColor="#1A1F71" title="Visa">
          <TextIcon text="VISA" color="#fff" size="16px" weight={700} italic spacing="1px" />
        </PaymentCard>

        {/* Mastercard - circles */}
        <PaymentCard bgColor="#2D2D2D" title="Mastercard" hasBorder>
          <MastercardCircles />
        </PaymentCard>

        {/* American Express */}
        <PaymentCard bgColor="#006FCF" title="American Express">
          <TextIcon text="AMEX" color="#fff" size="13px" weight={800} spacing="1px" />
        </PaymentCard>

        {/* Discover */}
        <PaymentCard bgColor="#fff" title="Discover" hasBorder>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TextIcon text="DISCOVER" color="#000" size="10px" weight={700} />
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#F76F00' }} />
          </div>
        </PaymentCard>

        {/* PayPal */}
        <PaymentCard bgColor="#fff" title="PayPal" hasBorder>
          <PayPalLogo />
        </PaymentCard>

        {/* Apple Pay */}
        <PaymentCard bgColor="#000" title="Apple Pay">
          <ApplePayLogo />
        </PaymentCard>

        {/* Google Pay */}
        <PaymentCard bgColor="#fff" title="Google Pay" hasBorder>
          <GooglePayLogo />
        </PaymentCard>

        {/* Stripe */}
        <PaymentCard bgColor="#635BFF" title="Stripe">
          <TextIcon text="stripe" color="#fff" size="14px" weight={600} />
        </PaymentCard>

        {/* Klarna */}
        <PaymentCard bgColor="#FFB3C7" title="Klarna">
          <TextIcon text="Klarna." color="#0A0B09" size="13px" weight={800} />
        </PaymentCard>

        {/* Bitcoin */}
        <PaymentCard bgColor="#F7931A" title="Bitcoin">
          <BitcoinLogo />
        </PaymentCard>
      </div>
    </div>
  );
};

export default TrustBadges;
