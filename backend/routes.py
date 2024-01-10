from fastapi import APIRouter
from fastapi import FastAPI
# import the modules containing the functions you need
from loans import sendPayment, repayLoan
from eligibility import eligible
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import requests
from fastapi.responses import JSONResponse

app = FastAPI()


router = APIRouter()


class LoanRequest(BaseModel):
    loan_id: str
    no_of_dependents: int
    education: int
    self_employed: int
    income_annum: float
    loan_amount: float
    loan_term: int
    cibil_score: int
    residential_assets_value: float
    commercial_assets_value: float
    luxury_assets_value: float
    bank_asset_value: float
    email: str


origins = [
   "http://localhost:3001", # Replace with the origin of your Next.js application
]

app.add_middleware(
   CORSMiddleware,
   allow_origins=origins,
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)


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
    print('a')
    return await repayLoan()



@router.options("/eligible")
async def process_model_output(data):
    print(data)
    
    return await eligible(data)


@router.post("/eligible")
async def process_model_output(data):
    
    
    return await eligible(data)

