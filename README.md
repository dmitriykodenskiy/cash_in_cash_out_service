# Cash In/Out Service API

This project implements a Cash In/Out Service API using Next.js. It includes services to calculate fees for cash in and cash out transactions and exposes an API endpoint to handle these calculations.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)

## Features

- Calculate fees for cash in and cash out transactions.
- API endpoint to handle cash in/out requests.
- Unit tests for services and validation.
- Input validation for transaction data.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/dmitriykodenskiy/cash_in_cash_out_service
    ```

2. Navigate to the project directory:

    ```bash
    cd cash_in_cash_out_service
    ```

3. Install dependencies:

    ```bash
    npm install
    ```
4. Add .env file with the required endpoints in the root of the project (see .env.example)

## Usage

### Starting the Development Server

To start the development server, run:

```bash
npm run dev
```

This will start the Next.js development server on http://localhost:3000.

### Building for Production

To build the project for production, run:

```bash
npm run build
```

### Starting the Production Server

After building the project, you can start the production server with:

```bash
npm start
```

## API Documentation

### POST /api/cash_in_out

Endpoint to calculate cash in/out fees.

#### Request

- Method: POST
- URL: /api/cash_in_out
- Headers: Content-Type: application/json
- Body: An array of transaction objects.

```bash
[
  {
    "date": "2023-06-25",
    "user_id": 1,
    "user_type": "natural",
    "type": "cash_in",
    "operation": { "amount": 200.00, "currency": "EUR" }
  },
  {
    "date": "2023-06-26",
    "user_id": 2,
    "user_type": "juridical",
    "type": "cash_out",
    "operation": { "amount": 300.00, "currency": "EUR" }
  }
]
```

#### Response

- Status: 200 OK
- Body: An array of calculated fees.

```bash
["0.06", "0.90"]
```

#### Error Responses

- Status: 400 Bad Request

  - Body: { "error": "Invalid input" }

- Status: 500 Internal Server Error

  - Body: { "error": "Internal server error" }

## Running Tests

### Unit Tests

Unit tests are provided for the services and API endpoint.

#### Running All Tests

```bash
npm run test
```

### Test Structure

- Service Tests: Tests for cashInService and cashOutService are located in the src/services directory.
- Validation Tests: Tests for validation of Input Data are located in the src/utils directory.

## Project Structure

```
cash_in_cash_out_service/
├── src/
│   ├── app/
│   │   ├── cash_in/
│   │   │   ├── page.tsx
│   │   │   └── ...
│   │   ├── cash_out/
│   │   │   ├── page.tsx
│   │   │   └── ...
│   │   ├── api/
│   │   │   ├── cash_in_out/
│   │   │   │   ├── route.ts
│   │   │   │   └── ...
│   │   │   └── ...
│   │   └── ...
│   ├── services/
│   │   ├── cashIn.service.ts
│   │   ├── cashOut.service.ts
│   │   └── ...
│   ├── types/
│   │   ├── CashInApi.types.ts
│   │   ├── CashOutApi.types.ts
│   │   ├── InputData.types.ts
│   │   └── ...
│   └── utils/
│       ├── validateInputData.ts
│       └── validateInputData.test.ts
├── README.md
└── ...
```