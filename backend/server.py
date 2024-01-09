from fastapi import FastAPI
from routers import transactions_router

app = FastAPI()

app.include_router(transactions_router.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/eligible")
# Route checks if the user is eligible for a loan
async def process_model_output():
    pass
