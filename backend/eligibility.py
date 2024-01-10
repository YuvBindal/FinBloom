import pickle
import pandas as pd

# Load the model
with open("loan_approval_rf_model.pkl", "rb") as f:
    model = pickle.load(f)


async def eligible(data: dict) -> bool:
    # Convert the data to a format that the model can understand
    data_for_prediction = pd.DataFrame().from_dict(data)

    # Use the model to make a prediction
    prediction = model.predict(data_for_prediction)

    # Assuming that the model returns 1 for eligible and 0 for not eligible
    is_eligible = prediction[0] == 1

    return { "isEligible": is_eligible }
