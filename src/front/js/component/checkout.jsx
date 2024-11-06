import React, {useState, useEffect} from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
        const paymentIntent = () => {
          fetch('https://redesigned-space-carnival-rj4qx755rgjcw7v-3001.app.github.dev/api/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 1000, currency: 'usd' }) 
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.client_secret));
      }
      paymentIntent()
      }, []);


    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!stripe || !elements) {
        return;
      }
  
      setLoading(true);
  
      const { error, paymentIntent } = await stripe.confirmCardPayment(
       clientSecret,{
          payment_method: {
            card: elements.getElement(CardElement),
          },
        },
      );
  
      setLoading(false);
  
      if (error) {
        console.log('[error]', error);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded!');
      }
      else{
        console.log('some error')
      }
    };
  
    return (
     
      <form className="w-50 bg-light mx-auto" onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe || loading}>
          Pay
        </button>
      </form>
    );
  };
