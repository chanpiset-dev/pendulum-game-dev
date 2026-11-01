import { I18N } from './i18n.js';

// Feedback is a snapshot of the actual failure, never a generic retry instruction.
export function getFailureFeedback(cause, remaining, language = 'en') {
  const t = I18N[language] || I18N.en;
  const count = t.remainingTargets(Math.max(0, Math.floor(remaining)));
  if (cause === 'time') return { title: t.timeUp, description: count };
  if (cause === 'laser') return { title: t.laserTrip, description: `${t.laserTripDesc}\n${count}` };
  if (cause === 'blackhole') return { title: t.singularity, description: `${t.singularityDesc}\n${count}` };
  throw new Error(`Unknown failure cause: ${cause}`);
}
