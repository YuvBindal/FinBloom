from fastapi import APIRouter, Body
from pydantic import BaseModel

router = APIRouter()


class TransactionRequest(BaseModel):
    # Model for transaction data
    starting_address: str
    destination_address: str
    amount: float
    currency: str
    repayment_schedule: str
    chain: str = "mock-xrp-testnet"  # Default to mock XRP testnet

# one function/route to send crypto with a deadline
# transaction_id, amount, currency, deadline

# one function/route to recieve by that date with expected amount
# expected amount is calculated by LLM
# transaction_id, amount, currency, deadline

# Write everything to JSON file


@router.post("/transactions")
# Endpoint for initiating transactions
async def create_transaction(request: TransactionRequest = Body(...)):
    # Interaction part with the XRPL to initiate the transaction
    transaction_result = await xrp_library.send_transaction(
        request.starting_address,
        request.destination_address,
        request.amount,
        request.currency,
        request.repayment_schedule,
        request.chain
    )
    return {"transaction_id": transaction_result.id}  # Example response
