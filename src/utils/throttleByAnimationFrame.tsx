import raf from 'raf';

export default function throttleByAnimationFrame(fn: (...args: any[]) => void) {
  let requestId: number | null;

  const later = (args: any[]) => () => {
    requestId = null;
    fn(...args);
  };

  const throttled = (...args: any[]) => {
    if (requestId == null) {
      requestId = raf(later(args));
    }
  };

  (throttled as any).cancel = () => raf.cancel(requestId!);

  return throttled;
}