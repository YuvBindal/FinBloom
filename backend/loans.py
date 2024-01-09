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
