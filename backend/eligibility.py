from pydantic import BaseModel
from fastapi import APIRouter, Body


router = APIRouter()


@router.post("/eligible")
async def eligible() -> bool:
    # TODO: Implement eligibility check
    is_eligible = True
    return is_eligible
