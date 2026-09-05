export const PAPER_STATUS = [
  'RESEARCH_PREP', // 연구 준비
  'EXPERIMENT', // 실험 진행
  'DRAFTING', // 초안 작성
  'PROFESSOR_REVIEW', // 교수 검토
  'COMPLETED', // 완료
] as const;

export type PaperStatus = (typeof PAPER_STATUS)[number];

export const PAPER_STATUS_LABEL: Record<PaperStatus, string> = {
  RESEARCH_PREP: '연구 준비',
  EXPERIMENT: '실험 진행',
  DRAFTING: '초안 작성',
  PROFESSOR_REVIEW: '교수 검토',
  COMPLETED: '완료',
};

export const DEFAULT_PAPER_STATUS: PaperStatus = 'RESEARCH_PREP';
