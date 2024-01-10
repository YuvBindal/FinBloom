from fastapi import APIRouter
from requests import request
from pydantic import BaseModel

# import the modules containing the functions you need
from loans import sendPayment, repayLoan
from eligibility import eligible


class LoanData(BaseModel):
    # Define the structure of your data here
    # For example:
    loan_id: int
    no_of_dependents: int
    education: int
    self_employed: int
    income_annum: int
    loan_amount: int
    loan_term: int
    cibil_score: int
    residential_assets_value: int
    commercial_assets_value: int
    luxury_assets_value: int
    bank_asset_value: int


router = APIRouter()


@router.get("/hello")
async def hello():
    return {"message": "yep, it's working"}


@router.post("/send-payment")
async def send_payment():
    # Call the function from the loans module
    return await sendPayment()


@router.post("/repayment")
async def repay_loan():
    # Call the function from the loans module
    return await repayLoan()


@router.post("/eligible")
async def process_model_output(data: LoanData):
    # Convert the data to a dictionary
    data_dict = data.dict()

    # Call the function from the eligibility module
    is_eligible = await eligible(data_dict)

    return {"is_eligible": is_eligible}
