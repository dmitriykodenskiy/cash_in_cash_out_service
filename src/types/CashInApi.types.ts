import { CurrencyType } from '@/types/InputData.types';

export interface cashInMax {
  amount: number;
  currency: CurrencyType;
}

export interface cashInFeeConfig {
  percents: number;
  max: cashInMax;
}