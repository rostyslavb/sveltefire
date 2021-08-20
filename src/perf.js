import { assertApp } from './helpers';

export function startTrace(trace) {
  if (trace) trace.start();
  return trace;
}

export async function stopTrace(trace) {
  if (trace && trace.state == 2) trace.stop();
  return null;
}
