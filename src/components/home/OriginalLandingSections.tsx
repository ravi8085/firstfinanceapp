import { ArrowRight } from 'lucide-react';
import homeRetirementImage from '@/assets/marketing/home-retirement.webp';
import lifeGoalsImage from '@/assets/marketing/life-goals.webp';
import retirementSavingsImage from '@/assets/marketing/retirement-savings.webp';

const questions = [
  {
    image: homeRetirementImage,
    alt: 'Can I buy a home and save for retirement? See how both goals fit into one monthly plan.',
    href: '/calculators',
    action: 'Explore goal calculators',
  },
  {
    image: lifeGoalsImage,
    alt: 'A car, a wedding, an education. Where do I start? Put every goal on a timeline you can adjust.',
    href: '#customer-signin',
    action: 'Build my plan',
  },
  {
    image: retirementSavingsImage,
    alt: 'How much should I save each month for retirement? Work backwards from the future you want.',
    href: '/calculators',
    action: 'Explore retirement planning',
  },
];

export default function OriginalLandingSections() {
  return <section className="campaign-questions" aria-labelledby="campaign-questions-title">
    <div className="campaign-questions-heading">
      <span>BUILT AROUND YOUR QUESTIONS</span>
      <h2 id="campaign-questions-title">Many goals. One clearer plan.</h2>
      <p>Explore different scenarios, then adjust the numbers to fit your life.</p>
    </div>
    <div className="campaign-questions-grid">
      {questions.map(({ image, alt, href, action }) => <a className="campaign-question-card" href={href} key={alt} aria-label={action}>
        <img src={image} alt={alt} loading="lazy" />
        <span>{action} <ArrowRight size={17} aria-hidden="true" /></span>
      </a>)}
    </div>
    <p className="campaign-questions-note">Illustrations show possible questions and scenarios. Premiums and investment outcomes depend on your details, product terms, and market conditions.</p>
  </section>;
}
