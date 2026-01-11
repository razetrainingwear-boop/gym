import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MailX, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  
  const [status, setStatus] = useState('loading'); // loading, success, error, no-email
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email) {
      setStatus('no-email');
      setMessage('No email address provided.');
      return;
    }

    const unsubscribe = async () => {
      try {
        const response = await fetch(`${API_URL}/api/unsubscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || "You've been unsubscribed from our emails.");
        } else {
          setStatus('error');
          setMessage(data.detail || 'Something went wrong. Please try again.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Unable to process your request. Please try again later.');
      }
    };

    unsubscribe();
  }, [email]);

  return (
    <div className="unsubscribe-page">
      <div className="unsubscribe-container">
        {status === 'loading' && (
          <div className="unsubscribe-content">
            <div className="unsubscribe-icon loading">
              <Loader2 size={48} className="spin" />
            </div>
            <h1>Processing...</h1>
            <p>Please wait while we update your preferences.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="unsubscribe-content">
            <div className="unsubscribe-icon success">
              <CheckCircle size={48} />
            </div>
            <h1>You've Been Unsubscribed</h1>
            <p>{message}</p>
            <p className="unsubscribe-email">{email}</p>
            <div className="unsubscribe-note">
              <p>You will no longer receive marketing emails from RAZE.</p>
              <p>Changed your mind? You can always re-subscribe by creating an account.</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="unsubscribe-content">
            <div className="unsubscribe-icon error">
              <AlertCircle size={48} />
            </div>
            <h1>Oops, Something Went Wrong</h1>
            <p>{message}</p>
            <p className="unsubscribe-email">{email}</p>
            <p className="unsubscribe-note">
              Please contact <a href="mailto:support@razetraining.com">support@razetraining.com</a> for assistance.
            </p>
          </div>
        )}

        {status === 'no-email' && (
          <div className="unsubscribe-content">
            <div className="unsubscribe-icon error">
              <MailX size={48} />
            </div>
            <h1>Invalid Request</h1>
            <p>{message}</p>
            <p className="unsubscribe-note">
              If you're trying to unsubscribe, please use the link in your email.
            </p>
          </div>
        )}

        <Link to="/" className="unsubscribe-back">
          <ArrowLeft size={18} />
          Back to RAZE
        </Link>
      </div>
    </div>
  );
};

export default Unsubscribe;
