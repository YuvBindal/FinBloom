from fastapi import APIRouter
from fastapi import FastAPI
# import the modules containing the functions you need
from loans import sendPayment, repayLoan
from eligibility import eligible
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


router = APIRouter()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  
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
async def eligible_options(data):
    print(data)
    return {"message": "Allow"}

@router.post("/eligible")
async def process_model_output(data):
    print(data.dict())  # Access the received data as a Python dictionary
    # Process the loan eligibility data
    return await eligible(data)

