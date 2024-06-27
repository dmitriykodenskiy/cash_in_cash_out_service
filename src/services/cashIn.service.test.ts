import cashInService from '@/services/cashIn.service';
import { InputDataType } from '@/types/InputData.types';

// Mock the fetch function to return a fixed response
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        percents: 0.03,
        max: {
          amount: 5.00,
        },
      }),
  })
) as jest.Mock;

describe('cashInService', () => {
  it('should calculate fee correctly based on percentage', async () => {
    const inputData: InputDataType[] = [
      {
        date: '2023-06-25',
        operation: {
          amount: 1000,
          currency: 'EUR'
        },
        user_id: 0,
        user_type: 'natural',
        type: 'cash_in'
      },
    ];
    const result = await cashInService(inputData);
    expect(result).toEqual([
      { date: '2023-06-25', fee: '0.30' },
    ]);
  });

  it('should apply the maximum fee limit', async () => {
    const inputData: InputDataType[] = [
      {
        date: '2023-06-25',
        operation: {
          amount: 20000,
          currency: 'EUR'
        },
        user_id: 0,
        user_type: 'natural',
        type: 'cash_in'
      },
    ];
    const result = await cashInService(inputData);
    expect(result).toEqual([
      { date: '2023-06-25', fee: '5.00' },
    ]);
  });

  it('should throw an error when cash in restrictions are not available', async () => {
    // Mock fetch to return an invalid response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(null),
      })
    );
    const inputData: InputDataType[] = [
      {
        date: '2023-06-25',
        operation: {
          amount: 1000,
          currency: 'EUR'
        },
        user_id: 0,
        user_type: 'natural',
        type: 'cash_in'
      },
    ];
    await expect(cashInService(inputData)).rejects.toThrow('Cash in restrictions are not available');
  });

  it('should handle various input scenarios correctly', async () => {
    const inputData: InputDataType[] = [
      {
        date: '2023-06-25',
        operation: {
          amount: 1000,
          currency: 'EUR'
        },
        user_id: 0,
        user_type: 'natural',
        type: 'cash_in'
      },
      {
        date: '2023-06-25',
        operation: {
          amount: 20000,
          currency: 'EUR'
        },
        user_id: 0,
        user_type: 'natural',
        type: 'cash_in'
      },
      {
        date: '2023-06-25',
        operation: {
          amount: 100,
          currency: 'EUR'
        },
        user_id: 0,
        user_type: 'natural',
        type: 'cash_in'
      },
    ];
    const result = await cashInService(inputData);
    expect(result).toEqual([
      { date: '2023-06-25', fee: '0.30' },
      { date: '2023-06-25', fee: '5.00' },
      { date: '2023-06-25', fee: '0.03' },
    ]);
  });
});
