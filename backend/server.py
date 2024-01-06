from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/loan")
async def create_loan():
    pass


@app.get("/loan")
async def get_loans():
    pass


@app.post("/modelOutput")
async def process_model_output():
    pass
