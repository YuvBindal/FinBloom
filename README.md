# BloomFin

A DeFi web application for microloans built using XPRL

## Run server

```
cd backend;

python -m uvicorn server:app --reload
```

## Run the frontend

```
cd frontend;

npm run dev
```

## Test if its working

Make a GET request to http://127.0.0.1:8000/hello or simply open that url in browser.
Server should give back this response:

```
{"message":"yep, it's working"}
```

## Snapshots from the project

#### Home page

![home](/images/homePage.png)

#### Loans Request

![home](/images/loanRequest.png)

#### Eligibilty Check

![home](/images/loanRequest.png)

#### Details of the loan

![home](/images/loanDeets.png)

#### Loan Repayment

![home](/images/repayment.png)

#### Credit Score

![home](/images/creditScorePage.png)
