from fastapi import APIRouter
from requests import request
from pydantic import BaseModel

# import the modules containing the functions you need
from loans import sendPayment, repayLoan
from eligibility import eligible


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

    print("reached here !!!!!!!!!!!!!!!!!!!!!")
    data_dict = data.dict()

    # Call the function from the eligibility module
    is_eligible = await eligible(data_dict)

    # Convert the output to a JSON
    return {"is_eligible": "true" if is_eligible else "false"}
