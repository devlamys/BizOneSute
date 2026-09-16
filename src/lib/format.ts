export const fmtINR = (n: number) =>
  'INR ' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtNum = (n: number) => n.toLocaleString('en-IN');

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
