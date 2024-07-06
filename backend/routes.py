# routes.py
from fastapi import APIRouter
from requests import request
from pydantic import BaseModel
import asyncio

# import the modules containing the functions you need
# from backend.loans import sendPayment, repayLoan
from backend.eligibility import eligible
from backend.llm_functions import loan_prediction_and_repayment_generation
from backend.loan_issuance import convert_to_xrp

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
