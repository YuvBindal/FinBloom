from fastapi import APIRouter
# import the modules containing the functions you need
from loans import sendPayment, repayLoan
from eligibility import eligible

router = APIRouter()


@router.get("/hello")
async def hello():
    return {"message": "yep, it's working"}


@router.post("/send-payment")
async def send_payment():
    # Call the function from the loans module
    return await loans.send_payment()


@router.post("/repayment")
async def repay_loan():
    # Call the function from the loans module
    return await loans.repay_loan()


@router.post("/eligible")
async def process_model_output():
    # Route checks if the user is eligible for a loan,
    # return the result of the function from the eligibility module
    # also add update the eligibility on server
    # so that we can process loans
    pass
