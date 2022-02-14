import { useSession, signIn } from 'next-auth/react'

import { api } from '../../services/api';
import { getStripeJS } from '../../services/stripe-js';

import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string;
}

export default function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const session = useSession();

  async function handleSubscribe() {
    if (!session.data) {
      signIn('github');
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const {  sessionId  } = response.data;

      const stripe = await getStripeJS();

      await stripe.redirectToCheckout({ sessionId });

    } catch(err) {
      window.alert(err.message);
    }
  }

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  )
}