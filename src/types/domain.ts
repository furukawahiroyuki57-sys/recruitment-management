export type StatusTone = "default" | "primary" | "success" | "warning" | "danger";

export type CandidateStatus = "応募受付" | "書類選考中" | "面接調整中" | "面接確定" | "内定" | "不採用";

export type ApplicationSource =
  | "Airワーク"
  | "Indeed"
  | "グルメキャリー"
  | "バイトル"
  | "飲食店ドットコム"
  | "求人ボックス"
  | "エンゲージ"
  | "タウンワーク"
  | "リファラル（紹介）"
  | "店舗看板"
  | "Instagram"
  | "TikTok"
  | "X"
  | "ホームページ"
  | "その他";

export interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  status: "公開中" | "停止中" | "終了";
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  jobId: string;
  status: CandidateStatus;
  applicationSource: ApplicationSource;
  applicationSourceOther: string;
  appliedAt: string;
  interviewAt: string;
  interviewer: string;
  resumeName: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  scheduledAt: string;
  interviewer: string;
  format: "オンライン" | "対面";
}

export interface Store {
  id: string;
  name: string;
  area: string;
  openings: number;
}

export interface Kpi {
  label: string;
  value: string;
  tone: StatusTone;
}

export interface SourceStats {
  source: string;
  applications: number;
  hires: number;
  hireRate: number;
}

export type PageId = "dashboard" | "applicants" | "interviews" | "stores" | "analytics" | "settings";
