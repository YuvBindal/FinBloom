# Generative AI approach
import pandas as pd

import google.generativeai as genai

import os

# get the API key
API_KEY = os.getenv('APIKEY')

# this should be how the parameter into the function looks like
new_data = pd.DataFrame(
    {
        " no_of_dependents": [2],
        " education": [1],
        " self_employed": [1],
        " income_annum": [25000],
        " loan_term": [5],
        " cibil_score": [700],
        " residential_assets_value": [0],
        " commercial_assets_value": [25000],
        " luxury_assets_value": [0],
        " bank_asset_value": [0],
    }
)

# let this sample response stay for prompt guidance
sample_response = {
    "predicted_amount": "amount_here",
    "predicted_repayment_schedule": {
        "Effective_Interest_Rate": 0.1,
        "Principal_Amount_SGD": 10000,
        "Loan_Maturity_Years": 5,
        "Total_Loan_Amount_SGD": 16105.1,
        "Installments_Per_Year": 12,
        "Installment_Amount": 268.42,
    },
}


def loan_prediction_and_repayment_generation(loan_data):
    prompt = f"""Given the following data about a business seeking microfinancing 
    (in SGD), where 0/1 in education means not graduate/graduate level education
    respectively, and similarily 1 for self employed , 0 for not: {loan_data}. 
    Predict an estimated amount of microloan this individual would be eligible 
    for as the first number in your response. Secondly given the loan_terms column 
    (in years). Generate a concise repayment schedule table, particularly the interest
    and payment intervals. Deduce the individua's credit history from their cibil score, 
    and make ideal assumptions if you need more data. Lastly, your response should be 
    in a JSON format such as this: {sample_response}. Note that the numbers are just 
    samples for your understanding."""
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text


# Need these functions:
# calculate_expected_amount
# calculate_penalty
