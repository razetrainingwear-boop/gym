import React from 'react';
import { Truck, Shield, Award, CheckCircle } from 'lucide-react';

const TrustBar = () => {
  return (
    <div className="trust-bar">
      <div className="trust-bar-content">
        <div className="trust-item">
          <Truck size={26} />
          <span>Free Shipping $100+ USD</span>
        </div>
        <div className="trust-item">
          <CheckCircle size={26} />
          <span>100% Satisfaction Guarantee</span>
        </div>
        <div className="trust-item">
          <Shield size={26} />
          <span>Secure Checkout</span>
        </div>
        <div className="trust-item">
          <Award size={26} />
          <span>Premium Quality</span>
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
