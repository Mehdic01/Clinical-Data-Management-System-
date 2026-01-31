from fastapi import APIRouter

router = APIRouter(tags=["health"])

# Sağlık kontrolü (health check) endpoint'i
#****************************************************************************************   
@router.get("/health")
def health():
    return {"status": "ok"}
