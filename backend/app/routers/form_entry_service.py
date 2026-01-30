from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.scheduled_visit import ScheduledVisit, ScheduledVisitStatus
from app.models.form_template import FormTemplate
from app.models.form_field import FormField
from app.models.form_entry import FormEntry, FormEntryStatus
from app.models.field_value import FieldValue
from app.models.visit_template_form import VisitTemplateForm
from app.schemas.form_entry import (
    FormEntryCreate,
    FormEntryOut,
    FormEntryDetailOut,
    FieldValueOut,
    ScheduledVisitFormOut,
)

router = APIRouter(tags=["form-entries"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GET: Scheduled visit için bağlı formları ve doldurulma durumlarını getirir
#*********************************************************************************************************************
@router.get(
    "/scheduled-visits/{scheduled_visit_id}/forms",
    response_model=list[ScheduledVisitFormOut],
)
def get_scheduled_visit_forms(scheduled_visit_id: int, db: Session = Depends(get_db)):
    # Scheduled visit var mı?
    sv = db.get(ScheduledVisit, scheduled_visit_id)
    if not sv:
        raise HTTPException(status_code=404, detail="Scheduled visit not found")

    # Bu vizite bağlı form template'leri getir (visit_template üzerinden)
    form_templates = db.execute(
        select(FormTemplate)
        .join(VisitTemplateForm, VisitTemplateForm.form_template_id == FormTemplate.id)
        .where(VisitTemplateForm.visit_template_id == sv.visit_template_id)
        .order_by(FormTemplate.id.asc())
    ).scalars().all()

    result = []
    for ft in form_templates:
        # Field sayısını al
        field_count = db.scalar(
            select(func.count(FormField.id))
            .where(FormField.form_template_id == ft.id)
        )

        # Bu form için entry var mı?
        entry = db.execute(
            select(FormEntry)
            .where(
                FormEntry.scheduled_visit_id == scheduled_visit_id,
                FormEntry.form_template_id == ft.id,
            )
        ).scalar_one_or_none()

        entry_out = None
        if entry:
            entry_out = FormEntryOut(
                id=entry.id,
                scheduledVisitId=entry.scheduled_visit_id,
                formTemplateId=entry.form_template_id,
                status=entry.status.value,
                submittedAt=entry.submitted_at,
                createdAt=entry.created_at,
            )

        result.append(
            ScheduledVisitFormOut(
                formTemplateId=ft.id,
                name=ft.name,
                code=ft.code,
                fieldCount=field_count or 0,
                entry=entry_out,
            )
        )

    return result


# GET: Tek bir form entry detayını getirir (read-only görüntüleme için)
#*********************************************************************************************************************
@router.get(
    "/form-entries/{form_entry_id}",
    response_model=FormEntryDetailOut,
)
def get_form_entry_detail(form_entry_id: int, db: Session = Depends(get_db)):
    entry = db.get(FormEntry, form_entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Form entry not found")

    field_values = db.execute(
        select(FieldValue)
        .where(FieldValue.form_entry_id == form_entry_id)
        .order_by(FieldValue.id.asc())
    ).scalars().all()

    return FormEntryDetailOut(
        id=entry.id,
        scheduledVisitId=entry.scheduled_visit_id,
        formTemplateId=entry.form_template_id,
        status=entry.status.value,
        submittedAt=entry.submitted_at,
        createdAt=entry.created_at,
        fieldValues=[
            FieldValueOut(id=fv.id, fieldId=fv.field_id, value=fv.value)
            for fv in field_values
        ],
    )


# POST: Yeni form entry oluşturur (form doldurma)
#*********************************************************************************************************************
@router.post(
    "/scheduled-visits/{scheduled_visit_id}/form-entries",
    response_model=FormEntryDetailOut,
    status_code=status.HTTP_201_CREATED,
)
def create_form_entry(
    scheduled_visit_id: int,
    payload: FormEntryCreate,
    db: Session = Depends(get_db),
):
    # 1. Scheduled visit var mı?
    sv = db.get(ScheduledVisit, scheduled_visit_id)
    if not sv:
        raise HTTPException(status_code=404, detail="Scheduled visit not found")

    # 2. Form template var mı ve bu vizite bağlı mı?
    ft = db.get(FormTemplate, payload.formTemplateId)
    if not ft:
        raise HTTPException(status_code=404, detail="Form template not found")

    # Vizite bağlı mı kontrol et
    is_attached = db.execute(
        select(VisitTemplateForm)
        .where(
            VisitTemplateForm.visit_template_id == sv.visit_template_id,
            VisitTemplateForm.form_template_id == payload.formTemplateId,
        )
    ).scalar_one_or_none()

    if not is_attached:
        raise HTTPException(
            status_code=400,
            detail="This form template is not attached to this visit",
        )

    # 3. Bu form zaten doldurulmuş mu?
    existing_entry = db.execute(
        select(FormEntry)
        .where(
            FormEntry.scheduled_visit_id == scheduled_visit_id,
            FormEntry.form_template_id == payload.formTemplateId,
        )
    ).scalar_one_or_none()

    if existing_entry:
        raise HTTPException(
            status_code=409,
            detail="This form has already been submitted for this visit",
        )

    # 4. Field'ları validate et
    form_fields = db.execute(
        select(FormField)
        .where(FormField.form_template_id == payload.formTemplateId)
    ).scalars().all()

    field_ids = {f.id for f in form_fields}
    required_field_ids = {f.id for f in form_fields if f.required}
    submitted_field_ids = {fv.fieldId for fv in payload.fieldValues}

    # Geçersiz field ID var mı?
    invalid_fields = submitted_field_ids - field_ids
    if invalid_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid field IDs: {invalid_fields}",
        )

    # Zorunlu alanlar doldurulmuş mu?
    missing_required = required_field_ids - submitted_field_ids
    if missing_required:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required fields: {missing_required}",
        )

    # 5. Form entry ve field values oluştur
    try:
        entry = FormEntry(
            scheduled_visit_id=scheduled_visit_id,
            form_template_id=payload.formTemplateId,
            status=FormEntryStatus.Submitted,
            submitted_at=datetime.utcnow(),
        )
        db.add(entry)
        db.flush()

        created_values = []
        for fv in payload.fieldValues:
            field_value = FieldValue(
                form_entry_id=entry.id,
                field_id=fv.fieldId,
                value=fv.value,
            )
            db.add(field_value)
            created_values.append(field_value)

        # 6. Tüm formlar doldurulduysa scheduled visit'i "Done" yap
        _check_and_update_visit_status(db, scheduled_visit_id)

        db.commit()

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Form entry already exists or invalid data",
        )

    db.refresh(entry)
    for fv in created_values:
        db.refresh(fv)

    return FormEntryDetailOut(
        id=entry.id,
        scheduledVisitId=entry.scheduled_visit_id,
        formTemplateId=entry.form_template_id,
        status=entry.status.value,
        submittedAt=entry.submitted_at,
        createdAt=entry.created_at,
        fieldValues=[
            FieldValueOut(id=fv.id, fieldId=fv.field_id, value=fv.value)
            for fv in created_values
        ],
    )


# Helper: Tüm formlar doldurulmuşsa vizit durumunu güncelle
def _check_and_update_visit_status(db: Session, scheduled_visit_id: int):
    sv = db.get(ScheduledVisit, scheduled_visit_id)
    if not sv:
        return

    # Bu vizite bağlı toplam form sayısı
    total_forms = db.scalar(
        select(func.count(VisitTemplateForm.id))
        .where(VisitTemplateForm.visit_template_id == sv.visit_template_id)
    )

    # Doldurulmuş form sayısı
    filled_forms = db.scalar(
        select(func.count(FormEntry.id))
        .where(
            FormEntry.scheduled_visit_id == scheduled_visit_id,
            FormEntry.status == FormEntryStatus.Submitted,
        )
    )

    # Hepsi doluysa Done yap
    if total_forms and filled_forms >= total_forms:
        sv.status = ScheduledVisitStatus.Done
        db.add(sv)