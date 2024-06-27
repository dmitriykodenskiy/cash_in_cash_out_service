import { InputDataType } from '@/types/InputData.types';

export function isValidInput(json: InputDataType[]): boolean {
  return json.every((item: InputDataType) => {
    const { date, user_id, user_type, type, operation } = item;
    
    return (
      date && !isNaN(Date.parse(date)) && // Check for valid date
      user_id && typeof user_id === 'number' && // Check user_id is a number
      user_type && (user_type === 'natural' || user_type === 'juridical') && // Check user_type
      type && (type === 'cash_in' || type === 'cash_out') && // Check type is 'cash_in' or 'cash_out'
      operation && typeof operation === 'object' && // Check operation is an object
      typeof operation.amount === 'number' && // Check amount is a number
      typeof operation.currency === 'string' // Check currency is a string
    );
  });
}
