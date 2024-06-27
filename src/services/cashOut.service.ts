import { CASH_OUT_API_URL_NATURAL, CASH_OUT_API_URL_LEGAL } from '@/const/endpoints';
import { InputDataType } from '@/types/InputData.types';
import { CashOutNaturalConfigType, CashOutLegalConfigType } from '@/types/CashOutApi.types';



export default async function cashOutService(inputData: InputDataType[]) {
  const cashOutConfigNatural = await fetch(`${CASH_OUT_API_URL_NATURAL}`);
  const cashOutConfigLegal = await fetch(`${CASH_OUT_API_URL_LEGAL}`);
  const cashOutRestrictionsNatural = await cashOutConfigNatural.json() as CashOutNaturalConfigType;
  const cashOutRestrictionsLegal = await cashOutConfigLegal.json() as CashOutLegalConfigType;

  if (!cashOutRestrictionsNatural || !cashOutRestrictionsLegal) {
    throw new Error('Cash out restrictions are not available');
  }

  const { percents: naturalPercents, week_limit: { amount: freeLimit } } = cashOutRestrictionsNatural;
  const { percents: legalPercents, min: { amount: minFee } } = cashOutRestrictionsLegal;

  const weeklyCashOuts: { [key: string]: number } = {};
  
  const results = inputData.map(item => {
    const { date, user_id, user_type, operation: { amount } } = item;
    let fee = 0;

    if (user_type === 'natural') {
      const week = getWeek(date);
      const userWeekKey = `${user_id}-${week}`;

      if (!weeklyCashOuts[userWeekKey]) {
        weeklyCashOuts[userWeekKey] = 0;
      }

      const totalAmountThisWeek = weeklyCashOuts[userWeekKey] + amount;
      if (weeklyCashOuts[userWeekKey] < freeLimit) {
        const chargeableAmount = totalAmountThisWeek > freeLimit ? totalAmountThisWeek - freeLimit : 0;
        fee = chargeableAmount * (naturalPercents / 100);
      } else {
        fee = amount * (naturalPercents / 100);
      }

      weeklyCashOuts[userWeekKey] += amount;
      
    } else if (user_type === 'juridical') {
      fee = Math.max(amount * (legalPercents / 100), minFee);
    }

    return { ...item, fee: fee.toFixed(2) };
  });  

  return results;
}

function getWeek(dateStr: string): string {
  const date = new Date(dateStr);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  // Adjusting the start of the week to Monday
  const adjustForMondayStart = firstDayOfYear.getDay() === 0 ? 6 : firstDayOfYear.getDay() - 1;
  
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  // Adjust calculation to start week from Monday
  return String(Math.ceil((pastDaysOfYear + adjustForMondayStart) / 7));
}