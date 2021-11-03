import { getPerformance, trace } from 'firebase/performance';
import { getApp } from './context';

export function startTrace(name) {
  const t = trace(getPerformance(getApp()), name);
  t.start();
  return t;
}

export function stopTrace(trace) {
  if (trace.state === 2) trace.stop();
  return null;
}
