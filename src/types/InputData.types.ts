export type UserType = 'natural' | 'juridical';
export type OperationType = 'cash_in' | 'cash_out';
export type CurrencyType = 'EUR';

export interface Operation {
  amount: number;
  currency: CurrencyType;
}

export interface InputDataType {
  date: string;
  user_id: number;
  user_type: UserType;
  type: OperationType;
  operation: Operation;
  initialIndex?: number;
}