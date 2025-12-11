// Config từ Google Sheets
export interface Config {
  CURRENT_ROUND: 'CK1' | 'CK2' | 'CK3';
  CURRENT_SEGMENT: 'DA_HOI' | 'THE_THAO' | 'AO_DAI' | 'UNG_XU';
  CURRENT_BATCH: string;
  ON_STAGE_SBD: string; // "001,002,003"
  IS_LOCKED: boolean;
}

// Thông tin thí sinh
export interface Contestant {
  SBD: string;
  HO_TEN: string;
  IMAGE_URL: string;
  STATUS: 'ACTIVE' | 'ELIMINATED';
}

// Dữ liệu chấm điểm
export interface RawScore {
  TIMESTAMP: string;
  JUDGE_ID: string;
  SBD: string;
  SEGMENT: string;
  BATCH_ID: string;
  SCORE: number;
}

// Kết quả tổng hợp
export interface Result {
  SBD: string;
  HO_TEN: string;
  DA_HOI: number;
  THE_THAO: number;
  AO_DAI: number;
  UNG_XU: number;
  TONG: number;
  RANK: number;
}

// State cho component
export interface JudgeState {
  config: Config;
  contestants: Contestant[];
  onStageContestants: Contestant[];
  myScores: { [sbd: string]: number | null };
  judgeId: string;
}

// Thêm interface mới
export interface Judge {
  USERNAME: string;        
  PASSWORD_HASH: string;
  FULL_NAME: string;
  IMAGE_URL_BGK: string;
  STATUS: 'ACTIVE' | 'INACTIVE';
}

export interface AuthSession {
  username: string;        
  fullName: string;
  image?: string;
  token: string;
  expiresAt: number;
}

// Mode hiển thị
export type DisplayMode = 'GRID' | 'SPLIT' | 'SPOTLIGHT' | 'LOCKED';
