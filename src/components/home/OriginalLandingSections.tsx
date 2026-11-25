import { ArrowRight } from 'lucide-react';
import homeRetirementImage from '@/assets/marketing/first-home.webp';
import lifeGoalsImage from '@/assets/marketing/family-milestones.webp';
import retirementSavingsImage from '@/assets/marketing/retirement-together.webp';

const questions = [
  {
    image: homeRetirementImage,
    kicker: 'A PLACE TO CALL YOURS',
    title: "A home is where your next chapter begins.",
    detail: 'See how a home goal could fit into your monthly plan.',
    href: '/calculators',
    action: 'Explore goal calculators',
  },
  {
    image: lifeGoalsImage,
    kicker: 'LIFE HAS MANY MILESTONES',
    title: 'The moments you celebrate are worth planning for.',
    detail: 'A car, a wedding, an education. Give each goal a place.',
    href: '#customer-signin',
    action: 'Build my plan',
  },
  {
    image: retirementSavingsImage,
    kicker: 'TIME TOGETHER MATTERS',
    title: 'Make room for the days you want to share.',
    detail: 'Explore what regular retirement saving could look like.',
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
      {questions.map(({ image, kicker, title, detail, href, action }) => <a className="campaign-question-card" href={href} key={title}>
        <img src={image} alt="" loading="lazy" />
        <div className="campaign-question-copy">
          <span className="campaign-copy-kicker">{kicker}</span>
          <h3>{title}</h3>
          <p>{detail}</p>
        </div>
        <span>{action} <ArrowRight size={17} aria-hidden="true" /></span>
      </a>)}
    </div>
    <p className="campaign-questions-note">Illustrations show possible questions and scenarios. Premiums and investment outcomes depend on your details, product terms, and market conditions.</p>
  </section>;
}
