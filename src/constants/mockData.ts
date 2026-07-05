import type { Candidate, Interview, Job, Kpi, Store } from "../types/domain";

export const jobs: Job[] = [
  { id: "j1", title: "フロントエンドエンジニア", location: "東京 / リモート", type: "正社員", status: "公開中" },
  { id: "j2", title: "カスタマーサクセス", location: "大阪", type: "正社員", status: "公開中" },
  { id: "j3", title: "採用アシスタント", location: "東京", type: "契約社員", status: "停止中" }
];

export const candidates: Candidate[] = [
  { id: "c1", name: "佐藤 花子", email: "hanako.sato@example.com", jobId: "j1", status: "面接確定", applicationSource: "Indeed", applicationSourceOther: "", appliedAt: "2026-07-05", interviewAt: "2026-07-05T14:00", interviewer: "山田", resumeName: "sato_hanako_resume.pdf" },
  { id: "c2", name: "田中 誠", email: "makoto.tanaka@example.com", jobId: "j2", status: "面接調整中", applicationSource: "Airワーク", applicationSourceOther: "", appliedAt: "2026-07-05", interviewAt: "", interviewer: "鈴木", resumeName: "tanaka_cv.docx" },
  { id: "c3", name: "鈴木 彩", email: "aya.suzuki@example.com", jobId: "j3", status: "内定", applicationSource: "リファラル（紹介）", applicationSourceOther: "", appliedAt: "2026-06-20", interviewAt: "2026-07-05T10:00", interviewer: "中村", resumeName: "suzuki_aya.pdf" },
  { id: "c4", name: "高橋 蓮", email: "ren.takahashi@example.com", jobId: "j1", status: "書類選考中", applicationSource: "その他", applicationSourceOther: "合同説明会", appliedAt: "2026-07-02", interviewAt: "", interviewer: "", resumeName: "takahashi_ren.pdf" }
];

export const interviews: Interview[] = [
  { id: "i1", candidateId: "c1", scheduledAt: "2026-07-05T14:00", interviewer: "山田", format: "オンライン" },
  { id: "i2", candidateId: "c3", scheduledAt: "2026-07-05T10:00", interviewer: "中村", format: "対面" }
];

export const stores: Store[] = [
  { id: "s1", name: "渋谷店", area: "東京", openings: 3 },
  { id: "s2", name: "梅田店", area: "大阪", openings: 2 },
  { id: "s3", name: "横浜店", area: "神奈川", openings: 1 }
];

export const kpis: Kpi[] = [
  { label: "Today's Applicants", value: "2", tone: "primary" },
  { label: "Pending", value: "3", tone: "warning" },
  { label: "Today's Interviews", value: "2", tone: "success" },
  { label: "Monthly Hires", value: "4", tone: "danger" }
];
