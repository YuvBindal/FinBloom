from pydantic import BaseModel


async def check_eligibility(request: BaseModel) -> bool:
    # Implement your eligibility logic here, accessing necessary data from the request object
    # ...
    is_eligible = True
    return is_eligible
