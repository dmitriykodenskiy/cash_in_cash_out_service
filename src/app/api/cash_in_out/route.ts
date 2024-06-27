import { NextRequest, NextResponse } from 'next/server';
import cashInService from '@/services/cashIn.service';
import cashOutService from '@/services/cashOut.service';
import { isValidInput } from '@/utils/validateInputData';
import { InputDataType } from '@/types/InputData.types';

export async function POST(req: NextRequest) {
  try {
    const requestJson = await req.json() as InputDataType[];

    // Add an index property to each item to preserve the original order
    const indexedRequestJson = requestJson.map((item, index) => ({ ...item, initialIndex: index }));
    

    if (isValidInput(indexedRequestJson)) {
      const cashInInputs = indexedRequestJson.filter(input => input.type === 'cash_in');
      const cashOutInputs = indexedRequestJson.filter(input => input.type === 'cash_out');
      
      const cashOutOutputArray = await cashOutService(cashOutInputs);
      const cashInOutputArray = await cashInService(cashInInputs);

      const cashOutputTotal = [...cashOutOutputArray, ...cashInOutputArray]
        .sort((a, b) => (a.initialIndex ?? 0) - (b?.initialIndex ?? 0)); // Sort based on the original index

      const cashFeesArray = cashOutputTotal.map(item => item.fee); 
      console.log(...cashFeesArray);
      

      return NextResponse.json(cashFeesArray, { status: 200 });
    } else {
      console.log("Invalid input");
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
