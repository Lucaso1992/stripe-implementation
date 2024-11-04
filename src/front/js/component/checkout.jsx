
import React, {useState, useEffect} from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';



export const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch('https://potential-fiesta-q57vjgxrwqwh4j66-3001.app.github.dev/api/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          //la cantidad ha pagar esta puesta fija, pero puede recibir un objeto desde el contexto
          body: JSON.stringify({ amount: 1000, currency: 'usd' }) // Amount in cents
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret));
      }, []);


    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!stripe || !elements) {
        return;
      }
  
      setLoading(true);
  
      const { error, paymentIntent } = await stripe.confirmCardPayment(
       clientSecret,
        {
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
