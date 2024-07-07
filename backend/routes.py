# routes.py
from fastapi import APIRouter
from requests import request
from pydantic import BaseModel
import asyncio
from fastapi import FastAPI, Query
from web3 import Web3
from eth_utils import to_hex

# import the modules containing the functions you need
# from backend.loans import sendPayment, repayLoan
from eligibility import eligible
from llm_functions import loan_prediction_and_repayment_generation
from loan_issuance import convert_to_xrp
from CryptoWallets import create_public_private, check_valid_wallet_address, check_account_balance, receive_funds_transaction

class LoanData(BaseModel):
    # Define the structure of your data here
    # For example:
    loan_id: str
    no_of_dependents: str
    education: str
    self_employed: str
    income_annum: str
    loan_amount: str
    loan_term: str
    cibil_score: str
    residential_assets_value: str
    commercial_assets_value: str
    luxury_assets_value: str
    bank_asset_value: str

class UserProfile(BaseModel):
    # Define the structure of your data here
    # For example:
    no_of_dependents: str
    education: str
    self_employed: str
    income_annum: str
    loan_term: str
    cibil_score: str
    residential_assets_value: str
    commercial_assets_value: str
    luxury_assets_value: str
    bank_asset_value: str

class TransactionData(BaseModel):
    from_account: str
    to_account: str
    amount: float
    gas_limit: int
    from_account_private_key: str

def serialize_receipt(receipt, amount):
    """Convert the receipt object to a JSON serializable format."""
    return {
        "blockHash": to_hex(receipt.blockHash),
        "blockNumber": receipt.blockNumber,
        "contractAddress": receipt.contractAddress,
        "cumulativeGasUsed": receipt.cumulativeGasUsed,
        "effectiveGasPrice": receipt.effectiveGasPrice,
        "from": receipt["from"],
        "gasUsed": receipt.gasUsed,
        "logs": receipt.logs,
        "logsBloom": to_hex(receipt.logsBloom),
        "status": receipt.status,
        "to": receipt["to"],
        "transactionHash": to_hex(receipt.transactionHash),
        "transactionIndex": receipt.transactionIndex,
        "type": receipt["type"],
        'amount': amount,
    }


router = APIRouter()

@router.get("/hello")
async def hello():
    return {"message": "yep, it's working"}

# @router.post("/send-payment")
# async def send_payment():
#     # Call the function from the loans module
#     return await sendPayment()

# @router.post("/repayment")
# async def repay_loan():
#     # Call the function from the loans module
#     return await repayLoan()

@router.post("/llm_prediction")
async def repay_loan(data: UserProfile):
    # LLM model prediciting user loan amount and repayment schedule based on their profile
    data_dict = data.dict()
    llm_response = loan_prediction_and_repayment_generation(data_dict)

    return llm_response

@router.post("/xrp_rate")
async def xrp_rate():
    # LLM model prediciting user loan amount and repayment schedule based on their profile
    exchange_rate = convert_to_xrp(1, "SGD")

    return exchange_rate

# @router.post("/wallets")
# async def wallets():
#     wallet = await generate_transaction_wallets()
#     print(wallet)

#     return wallet

@router.post("/eligible")
async def process_model_output(data: LoanData):
    # Convert the data to a dictionary
    data_dict = data.dict()

    # Call the function from the eligibility module
    is_eligible = await eligible(data_dict)

    # Convert the output to a JSON
    return {"is_eligible": "true" if is_eligible else "false"}


@router.get("/setup-wallet")
async def setup_wallet(check_wallet_address_exists = None):
    if not check_wallet_address_exists:
        address, private_key = create_public_private()
        #return in json format
        return {"address": address, "private_key": private_key}
    else:
        return check_valid_wallet_address(check_wallet_address_exists)


@router.get('/get-balance')
async def get_account_balance(address: str = Query(...)):
    balance = check_account_balance(address)
    if balance != -1:
        return {"address_balance": balance}
    else:
        return {"address_balance": "Invalid wallet address"}

@router.post('/send-transaction')
async def send_transaction(transactionData: TransactionData):
    txn_reciept = receive_funds_transaction(transactionData)
    if txn_reciept != -1:
        txn_reciept = serialize_receipt(txn_reciept, transactionData.amount)
        return {"transaction_receipt": txn_reciept}
    return {"transaction_receipt": "Transaction failed. Please check the transaction details and try again."}

