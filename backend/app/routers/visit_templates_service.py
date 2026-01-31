from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.study import Study
from app.models.visit_template import VisitTemplate
from app.schemas.visit_template import VisitTemplateCreate, VisitTemplateOut, VisitTemplateUpdate

router = APIRouter(prefix="/studies/{study_id}/visit-templates", tags=["visit-templates"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# bu endpointler, belirli bir çalışmaya (study) ait ziyaret şablonlarını (visit templates) oluşturmak ve listelemek için kullanılır.

# POST: Create a new visit template for a specific study.
#**********************************************************
@router.post("", response_model=VisitTemplateOut, status_code=status.HTTP_201_CREATED)
def create_visit_template(study_id: int, payload: VisitTemplateCreate, db: Session = Depends(get_db)):
    # Study var mı?
    study = db.get(Study, study_id)
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    vt = VisitTemplate(
        study_id=study_id,
        name=payload.name,
        code=payload.code,
        day=payload.day,
        window_before=payload.windowBefore,
        window_after=payload.windowAfter,
    )
    db.add(vt)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # (study_id, code) unique çakışması dahil
        raise HTTPException(status_code=409, detail="Visit template code must be unique within the study")

    db.refresh(vt)
    return VisitTemplateOut(
        id=vt.id,
        studyId=vt.study_id,
        name=vt.name,
        code=vt.code,
        day=vt.day,
        windowBefore=vt.window_before,
        windowAfter=vt.window_after,
    )


# GET: List all visit templates for a specific study.
#**********************************************************
@router.get("", response_model=list[VisitTemplateOut])
def list_visit_templates(study_id: int, db: Session = Depends(get_db)):
    # Study var mı?
    study = db.get(Study, study_id)
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    rows = db.execute(
        select(VisitTemplate)
        .where(VisitTemplate.study_id == study_id)
        .order_by(VisitTemplate.day.asc(), VisitTemplate.id.asc())
    ).scalars().all()

    return [
        VisitTemplateOut(
            id=vt.id,
            studyId=vt.study_id,
            name=vt.name,
            code=vt.code,
            day=vt.day,
            windowBefore=vt.window_before,
            windowAfter=vt.window_after,
        )
        for vt in rows
    ]


# PUT: Update an existing visit template for a specific study.
#**********************************************************
@router.put("/{visit_template_id}", response_model=VisitTemplateOut)
def update_visit_template(
    study_id: int,
    visit_template_id: int,
    payload: VisitTemplateUpdate,
    db: Session = Depends(get_db),
):
    # Study var mı?
    study = db.get(Study, study_id)
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    vt = db.get(VisitTemplate, visit_template_id)
    if not vt or vt.study_id != study_id:
        raise HTTPException(status_code=404, detail="Visit template not found")

    # Alanları güncelle
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vt, key, value)

    db.add(vt)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Visit template code must be unique within the study")

    db.refresh(vt)
    return VisitTemplateOut(
        id=vt.id,
        studyId=vt.study_id,
        name=vt.name,
        code=vt.code,
        day=vt.day,
        windowBefore=vt.window_before,
        windowAfter=vt.window_after,
    )


# DELETE: Delete an existing visit template for a specific study.
#**********************************************************
@router.delete("/{visit_template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_visit_template(study_id: int, visit_template_id: int, db: Session = Depends(get_db)):
    # Study var mı?
    study = db.get(Study, study_id)
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    vt = db.get(VisitTemplate, visit_template_id)
    if not vt or vt.study_id != study_id:
        raise HTTPException(status_code=404, detail="Visit template not found")

    db.delete(vt)
    db.commit()

    return None
