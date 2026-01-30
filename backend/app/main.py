from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.health import router as health_router
from app.routers.studies import router as studies_router
from app.routers.visit_templates import router as visit_templates_router
from app.routers.form_templates import router as form_templates_router
from app.routers.visit_forms import router as visit_forms_router


app = FastAPI(title="GQA Assignment API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(studies_router)
app.include_router(visit_templates_router)  
app.include_router(form_templates_router)
app.include_router(visit_forms_router)
