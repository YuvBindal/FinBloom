from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/loans")
async def create_loan():
    pass


@app.get("/loans")
async def get_loans():
    pass


@app.post("/eligible")
# Route checks if the user is eligible for a loan
async def process_model_output():
    pass
