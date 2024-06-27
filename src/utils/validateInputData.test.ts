import { isValidInput } from '@/utils/validateInputData';
import { InputDataType } from '@/types/InputData.types';

describe('isValidInput', () => {
  it('should return true for valid input', () => {
    const validInput: InputDataType[] = [
      {
        date: '2023-06-25',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 100,
          currency: 'EUR'
        }
      },
      {
        date: '2023-06-26',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_out',
        operation: {
          amount: 200,
          currency: 'EUR'
        }
      }
    ];
    expect(isValidInput(validInput)).toBe(true);
  });

  it('should return false for invalid date', () => {
    const invalidInput: InputDataType[] = [
      {
        date: 'invalid-date',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 100,
          currency: 'EUR'
        }
      }
    ];
    expect(isValidInput(invalidInput)).toBe(false);
  });

  it('should return false for invalid user_id', () => {
    const invalidInput: InputDataType[] = [
      {
        date: '2023-06-25',
        user_id: 'invalid' as any,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 100,
          currency: 'EUR'
        }
      }
    ];
    expect(isValidInput(invalidInput)).toBe(false);
  });

  it('should return false for invalid user_type', () => {
    const invalidInput: InputDataType[] = [
      {
        date: '2023-06-25',
        user_id: 1,
        user_type: 'invalid' as any,
        type: 'cash_in',
        operation: {
          amount: 100,
          currency: 'EUR'
        }
      }
    ];
    expect(isValidInput(invalidInput)).toBe(false);
  });

  it('should return false for invalid type', () => {
    const invalidInput: InputDataType[] = [
      {
        date: '2023-06-25',
        user_id: 1,
        user_type: 'natural',
        type: 'invalid' as any,
        operation: {
          amount: 100,
          currency: 'EUR'
        }
      }
    ];
    expect(isValidInput(invalidInput)).toBe(false);
  });

  it('should return false for invalid operation', () => {
    const invalidInput: InputDataType[] = [
      {
        date: '2023-06-25',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: 'invalid' as any
      }
    ];
    expect(isValidInput(invalidInput)).toBe(false);
  });
});
