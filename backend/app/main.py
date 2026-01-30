from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.health import router as health_router
from app.routers.studies_service import router as studies_router
from app.routers.visit_templates_service import router as visit_templates_router
from app.routers.form_templates_service import router as form_templates_router
from app.routers.visit_forms_service import router as visit_forms_router
from app.routers.scheduled_visit_service import router as scheduled_visits_router
from app.routers.form_entry_service import router as form_entries_router
from app.routers.subject_service import router as subject_router


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
app.include_router(scheduled_visits_router)
app.include_router(form_entries_router)
app.include_router(subject_router)
