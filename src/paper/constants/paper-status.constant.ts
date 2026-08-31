export const PAPER_STATUS = [
  'IDEA',
  'WRITING',
  'SUBMITTED',
  'UNDER_REVIEW',
  'ACCEPTED',
  'REJECTED',
  'PUBLISHED',
] as const;

export type PaperStatus = (typeof PAPER_STATUS)[number];
