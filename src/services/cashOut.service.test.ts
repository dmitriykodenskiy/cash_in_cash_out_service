import cashOutService from '@/services/cashOut.service';
import { InputDataType } from '@/types/InputData.types';
import { CASH_OUT_API_URL_NATURAL, CASH_OUT_API_URL_LEGAL } from '@/const/endpoints';

// Mock the fetch function to return a fixed response
const mockFetchNatural = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        percents: 0.3,
        week_limit: {
          amount: 1000,
        },
      }),
  })
);

const mockFetchLegal = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        percents: 0.3,
        min: {
          amount: 0.5,
        },
      }),
  })
);

global.fetch = jest.fn((url) => {
  if (url === CASH_OUT_API_URL_NATURAL) {
    return mockFetchNatural();
  }
  if (url === CASH_OUT_API_URL_LEGAL) {
    return mockFetchLegal();
  }
  return Promise.reject(new Error('Unknown URL'));
}) as jest.Mock;

describe('cashOutService', () => {
  beforeEach(() => {
    // Reset mock calls and implementations before each test
    jest.clearAllMocks();
  });

  it('should calculate fee correctly for natural users within free limit', async () => {
    const inputData: InputDataType[] = [
      {
        date: '2023-06-25',
        user_id: 1,
        user_type: 'natural',
        operation: { amount: 500, currency: 'EUR' },
        type: 'cash_out'
      },
    ];
    const result = await cashOutService(inputData);
    expect(result).toEqual([
      { ...inputData[0], fee: '0.00' },
    ]);
  });

  it('should calculate fee correctly for natural users exceeding free limit', async () => {
    const inputData: InputDataType[] = [
      {
        date: '2023-06-25',
        user_id: 1,
        user_type: 'natural',
        operation: { amount: 1200, currency: 'EUR' },
        type: 'cash_out'
      },
    ];
    const result = await cashOutService(inputData);
    expect(result).toEqual([
      { ...inputData[0], fee: '0.60' },  // 200 over limit, 0.3% of 200 is 0.60
    ]);
  });

  it('should calculate fee correctly for juridical users with minimum fee', async () => {
    const inputData: InputDataType[] = [
      {
        date: '2023-06-25',
        user_id: 2,
        user_type: 'juridical',
        operation: { amount: 100, currency: 'EUR' },
        type: 'cash_out'
      },
    ];
    const result = await cashOutService(inputData);
    expect(result).toEqual([
      { ...inputData[0], fee: '0.50' },  // 0.3% of 100 is 0.30, but min fee is 0.50
    ]);
  });

  it('should throw an error when cash out restrictions are not available', async () => {
    // Mock fetch to return an invalid response
    (global.fetch as jest.Mock).mockImplementationOnce((url) =>
      Promise.resolve({ json: () => Promise.resolve(null) })
    );
    const inputData: InputDataType[] = [
      {
        date: '2023-06-25',
        user_id: 1,
        user_type: 'natural',
        operation: { amount: 100, currency: 'EUR' },
        type: 'cash_out'
      },
    ];
    await expect(cashOutService(inputData)).rejects.toThrow('Cash out restrictions are not available');
  });

  it('should handle various input scenarios correctly', async () => {
    const inputData: InputDataType[] = [
      { date: "2016-01-06", user_id: 2, user_type: "juridical", type: "cash_out", operation: { amount: 300.00, currency: "EUR" } },
      { date: "2016-01-06", user_id: 1, user_type: "natural", type: "cash_out", operation: { amount: 30000, currency: "EUR" } },
      { date: "2016-01-07", user_id: 1, user_type: "natural", type: "cash_out", operation: { amount: 1000.00, currency: "EUR" } },
      { date: "2016-01-07", user_id: 1, user_type: "natural", type: "cash_out", operation: { amount: 100.00, currency: "EUR" } },
      { date: "2016-01-10", user_id: 1, user_type: "natural", type: "cash_out", operation: { amount: 100.00, currency: "EUR" } },
      { date: "2016-01-10", user_id: 3, user_type: "natural", type: "cash_out", operation: { amount: 1000.00, currency: "EUR" } },
      { date: "2016-02-15", user_id: 1, user_type: "natural", type: "cash_out", operation: { amount: 300.00, currency: "EUR" } }
    ];
    const expectedResult = [
      { ...inputData[0], fee: "0.90" },
      { ...inputData[1], fee: "87.00" },
      { ...inputData[2], fee: "3.00" },
      { ...inputData[3], fee: "0.30" },
      { ...inputData[4], fee: "0.30" },
      { ...inputData[5], fee: "0.00" },
      { ...inputData[6], fee: "0.00" }
    ];

    const result = await cashOutService(inputData);
    expect(result.map((r: { fee: string }) => r.fee)).toEqual(expectedResult.map((e: { fee: string }) => e.fee));
  });
});
