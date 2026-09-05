// 논문 진행 단계 (기획 UI의 5단계 프로그레스와 동일한 순서)
export const PAPER_STATUS = [
  'RESEARCH_PREP', // 연구 준비
  'EXPERIMENT', // 실험 진행
  'DRAFTING', // 초안 작성
  'PROFESSOR_REVIEW', // 교수 검토
  'COMPLETED', // 완료
] as const;

export type PaperStatus = (typeof PAPER_STATUS)[number];

// 프론트에서 프로그레스 바를 그릴 때 쓰도록 단계별 라벨/순번을 함께 내려줍니다.
export const PAPER_STATUS_LABEL: Record<PaperStatus, string> = {
  RESEARCH_PREP: '연구 준비',
  EXPERIMENT: '실험 진행',
  DRAFTING: '초안 작성',
  PROFESSOR_REVIEW: '교수 검토',
  COMPLETED: '완료',
};

export const DEFAULT_PAPER_STATUS: PaperStatus = 'RESEARCH_PREP';
