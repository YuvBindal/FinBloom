import pickle
import pandas as pd

# Load the model
model = pickle.load(open("eligibility_check_model.pkl", "rb"))


async def eligible(data: dict) -> bool:
    cleaned = {key: int(value) if value !=
               '' else 0 for key, value in data.items()}

    # Convert the data to a format that the model can understand
    data_for_prediction = pd.DataFrame([cleaned])

    # Use the model to make a prediction
    prediction = model.predict(data_for_prediction)

    # Assuming that the model returns 1 for eligible and 0 for not eligible
    is_eligible = prediction[0] == 1

    return is_eligible
