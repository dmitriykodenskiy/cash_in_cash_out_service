interface WeekLimit {
  amount: number;
  currency: string;
}

interface Min {
  amount: number;
  currency: string;
}

export interface CashOutNaturalConfigType {
  percents: number;
  week_limit: WeekLimit;
}


export interface CashOutLegalConfigType {
  percents: number;
  min: Min;
}