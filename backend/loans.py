from fastapi import APIRouter, Body, Depends
from pydantic import BaseModel
from datetime import datetime
import xrp_library
# llm file
import llm_functions
from .eligibility import eligible  # Import the function

router = APIRouter()

# Models for endpoint request data
# SendCryptoRequest and ReceiveCryptoRequest are the similar


class SendCryptoRequest(BaseModel):
    transaction_id: str
    amount: float
    currency: str
    deadline: datetime


class ReceiveCryptoRequest(BaseModel):
    transaction_id: str
    amount: float
    currency: str
    deadline: datetime


async def sendPayment(request: SendCryptoRequest = Body(...), is_eligible: bool = Depends(eligible)):
    # This is the endpoint for sending crypto with a deadline
    if is_eligible:
        try:
            # Interaction with the XRPL to send the money
            await xrp_library.send_crypto_with_deadline(
                request.transaction_id,
                request.amount,
                request.currency,
                request.deadline
            )
            return {"message": "Transaction successful"}
        except Exception as e:
            return {"error": str(e)}
    else:
        return {"error": "You are not eligible for a loan"}


async def repayLoan(request: ReceiveCryptoRequest = Body(...)):
    # Endpoint for receiving crypto by a deadline with expected amount and penalty
    # Feel free to modify the logic below, I've coded it assuming we need a penalty
    current_time = datetime.now()
    if request.deadline < current_time:
        # Deadline has passed, add penalty
        expected_amount = await llm_functions.calculate_expected_amount(request.transaction_id)
        penalty_amount = llm_functions.calculate_penalty(
            expected_amount, request.deadline)
        amount_with_penalty = expected_amount + penalty_amount
        return {"message": f"Deadline missed. Amount with penalty: {amount_with_penalty}"}
    else:
        # Deadline not yet reached
        expected_amount = await llm_functions.calculate_expected_amount(request.transaction_id)
        return {"message": f"Expected amount: {expected_amount}"}


# class TransactionRequest(BaseModel):
#     # Model for transaction data
#     starting_address: str
#     destination_address: str
#     amount: float
#     currency: str
#     repayment_schedule: str
#     chain: str = "mock-xrp-testnet"  # Default to mock XRP testnet


# @router.post("/transactions")
# # Endpoint for initiating transactions
# async def create_transaction(request: TransactionRequest = Body(...)):
#     # Interaction part with the XRPL to initiate the transaction
#     transaction_result = await xrp_library.send_transaction(
#         request.starting_address,
#         request.destination_address,
#         request.amount,
#         request.currency,
#         request.repayment_schedule,
#         request.chain
#     )
#     return {"transaction_id": transaction_result.id}  # Example response

# one function/route to send crypto with a deadline
# transaction_id, amount, currency, deadline

# one function/route to recieve by that date with expected amount
# expected amount is calculated by LLM
# transaction_id, amount, currency, deadline
# if deadline is not met, add a penalty to the amount
