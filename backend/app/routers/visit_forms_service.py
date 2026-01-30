from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.study import Study
from app.models.visit_template import VisitTemplate
from app.models.form_template import FormTemplate
from app.models.visit_template_form import VisitTemplateForm
from app.schemas.form_templates import FormTemplateOut
from app.schemas.visit_forms import (
    AttachFormsRequest,
    VisitTemplateWithFormsOut,
    AttachedFormOut,
)

router = APIRouter(tags=["visit-template-forms"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _get_visit_template_or_404(db: Session, study_id: int, visit_template_id: int) -> VisitTemplate:
    vt = db.get(VisitTemplate, visit_template_id)
    if not vt or vt.study_id != study_id:
        raise HTTPException(status_code=404, detail="Visit template not found")
    # study varlığını da garanti edelim (opsiyonel)
    if not db.get(Study, study_id):
        raise HTTPException(status_code=404, detail="Study not found")
    return vt


# GET: Belirli bir visit template'in detayını ve bağlı form template listesini döndürür.
@router.get(
    "/studies/{study_id}/visit-templates/{visit_template_id}",
    response_model=VisitTemplateWithFormsOut,
)
def get_visit_template_detail(study_id: int, visit_template_id: int, db: Session = Depends(get_db)):
    vt = _get_visit_template_or_404(db, study_id, visit_template_id)

    rows = db.execute(
        select(FormTemplate)
        .join(VisitTemplateForm, VisitTemplateForm.form_template_id == FormTemplate.id)
        .where(VisitTemplateForm.visit_template_id == visit_template_id)
        .order_by(FormTemplate.id.asc())
    ).scalars().all()

    return VisitTemplateWithFormsOut(
        id=vt.id,
        studyId=vt.study_id,
        name=vt.name,
        code=vt.code,
        day=vt.day,
        windowBefore=vt.window_before,
        windowAfter=vt.window_after,
        attachedForms=[AttachedFormOut(id=f.id, name=f.name, code=f.code) for f in rows],
    )

# GET: Belirli bir study'e ait tüm form template'leri listeler.
@router.get(
    "/studies/{study_id}/form-templates",
    response_model=list[FormTemplateOut],
)
def list_study_form_templates(study_id: int, db: Session = Depends(get_db)):
    if not db.get(Study, study_id):
        raise HTTPException(status_code=404, detail="Study not found")

    rows = db.execute(
        select(FormTemplate)
        .where(FormTemplate.study_id == study_id)
        .order_by(FormTemplate.id.desc())
    ).scalars().all()

    return [
        FormTemplateOut(id=ft.id, studyId=ft.study_id, name=ft.name, code=ft.code)
        for ft in rows
    ]


# PUT: Bir visit template'e bağlı form template'leri topluca değiştirir (attach/detach).
@router.put(
    "/studies/{study_id}/visit-templates/{visit_template_id}/attached-forms",
    status_code=status.HTTP_204_NO_CONTENT,
)
def replace_attached_forms(
    study_id: int,
    visit_template_id: int,
    payload: AttachFormsRequest,
    db: Session = Depends(get_db),
):
    vt = _get_visit_template_or_404(db, study_id, visit_template_id)

    # 1) gönderilen form id'lerinin hepsi bu study'e mi ait? (data integrity)
    if payload.formTemplateIds:
        forms = db.execute(
            select(FormTemplate)
            .where(FormTemplate.id.in_(payload.formTemplateIds))
        ).scalars().all()

        if len(forms) != len(set(payload.formTemplateIds)):
            raise HTTPException(status_code=400, detail="One or more formTemplateIds are invalid")

        # study check
        for f in forms:
            if f.study_id != study_id:
                raise HTTPException(status_code=400, detail="All forms must belong to the same study")

    # 2) mevcut bağları sil (replace semantics)
    db.execute(
        delete(VisitTemplateForm).where(VisitTemplateForm.visit_template_id == vt.id)
    )

    # 3) yeni bağları ekle
    for form_id in dict.fromkeys(payload.formTemplateIds):  # duplicate'i kırp
        db.add(VisitTemplateForm(visit_template_id=vt.id, form_template_id=form_id))

    db.commit()
    return None
