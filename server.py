from fastapi import FastAPI, HTTPException
from typing import Optional
# from loan_issuance import generate_loan_transaction, convert_to_xrp


app = FastAPI()

@app.post("/generate_loan")
async def generate_loan(
    client,
    starting_wallet,
    destination_wallet,
    repayment_schedule,
    loan_amount: float,
    currency: str,
):
    try:
        # generate_loan_transaction(client, starting_wallet, destination_wallet, repayment_schedule, loan_amount, currency)
        return {"message": "Test Execution!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
