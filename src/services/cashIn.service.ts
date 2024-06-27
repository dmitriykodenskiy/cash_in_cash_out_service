import { CASH_IN_API_URL } from '@/const/endpoints';
import { InputDataType } from '@/types/InputData.types';
import { cashInFeeConfig } from '@/types/CashInApi.types';



export default async function cashInService(inputData: InputDataType[]): Promise<{ date: string; fee: string, initialIndex?: number }[]> {
  const cashInConfig = await fetch(`${CASH_IN_API_URL}`);
  const cashInRestrictions = await cashInConfig.json() as cashInFeeConfig;
  if (!cashInRestrictions) {
    throw new Error('Cash in restrictions are not available');
  }
  
  const { percents, max: { amount: maxFee } } = cashInRestrictions;

  const result = inputData.map((data) => {
    const { operation: { amount } } = data;
    let fee = amount * (percents/100);

    fee = Math.ceil(fee * 100) / 100;

    if (fee > maxFee) {
      return { 
        date: data.date, 
        fee: maxFee.toFixed(2),
        initialIndex: data?.initialIndex,
      };
    }
    return {
      date: data.date,
      fee: fee.toFixed(2),
      initialIndex: data?.initialIndex,
    };
  });
  return result;
}