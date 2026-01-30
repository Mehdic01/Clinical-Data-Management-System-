from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.study import Study
from app.models.form_template import FormTemplate
from app.models.form_field import FormField
from app.schemas.form_templates import (
    FormTemplateCreate,
    FormTemplateUpdate,
    FormTemplateOut,
    FormFieldCreate,
    FormFieldOut,
    FormTemplateDetailOut,
)

router = APIRouter(prefix="/studies/{study_id}/form-templates", tags=["form-templates"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# bu post endpoint, belirli bir çalışmaya (study) yeni bir form şablonu (form template) oluşturmak için kullanılır.
# ve form şablonuna ait alanları (form fields) da aynı anda oluşturabilir.

@router.post("", response_model=FormTemplateDetailOut, status_code=status.HTTP_201_CREATED)
def create_form_template(study_id: int, payload: FormTemplateCreate, db: Session = Depends(get_db)):
    if not db.get(Study, study_id):
        raise HTTPException(status_code=404, detail="Study not found")

    # Form şablonunu ve alanlarını tek bir transaction içinde oluştur
    try:
        # 1. FormTemplate oluştur
        ft = FormTemplate(study_id=study_id, name=payload.name, code=payload.code)
        db.add(ft)
        db.flush()  # ft.id'nin oluşması için

        # 2. FormField'ları oluştur
        created_fields = []
        for field_payload in payload.fields:
            field = FormField(
                form_template_id=ft.id,
                label=field_payload.label,
                key=field_payload.key,
                type=field_payload.type,
                required=field_payload.required,
                order=field_payload.order,
            )
            db.add(field)
            created_fields.append(field)

        db.commit()

    except IntegrityError as e:
        db.rollback()
        if "form_templates_study_id_code_key" in str(e.orig):
             raise HTTPException(status_code=409, detail="Form template code must be unique within the study")
        if "form_fields_form_template_id_key_key" in str(e.orig):
             raise HTTPException(status_code=409, detail="Field key must be unique within the form")
        raise HTTPException(status_code=409, detail="A database integrity error occurred")


    db.refresh(ft)
    for f in created_fields:
        db.refresh(f)

    return FormTemplateDetailOut(
        id=ft.id,
        studyId=ft.study_id,
        name=ft.name,
        code=ft.code,
        fields=[
            FormFieldOut(
                id=f.id,
                formTemplateId=f.form_template_id,
                label=f.label,
                key=f.key,
                type=f.type,
                required=f.required,
                order=f.order,
            )
            for f in created_fields
        ],
    )
#**********************************************************************************************************************

@router.get("", response_model=list[FormTemplateOut])
def list_form_templates(study_id: int, db: Session = Depends(get_db)):
    if not db.get(Study, study_id):
        raise HTTPException(status_code=404, detail="Study not found")

    rows = db.execute(
        select(FormTemplate)
        .where(FormTemplate.study_id == study_id)
        .order_by(FormTemplate.id.desc())
    ).scalars().all()

    return [FormTemplateOut.model_validate(ft) for ft in rows]


@router.get("/{form_template_id}/field-count", response_model=dict)
def get_form_field_count(study_id: int, form_template_id: int, db: Session = Depends(get_db)):
    ft = db.get(FormTemplate, form_template_id)
    if not ft or ft.study_id != study_id:
        raise HTTPException(status_code=404, detail="Form template not found")

    count = db.query(FormField).filter(FormField.form_template_id == form_template_id).count()
    return {"count": count}


@router.get("/{form_template_id}", response_model=FormTemplateDetailOut)
def get_form_template_detail(study_id: int, form_template_id: int, db: Session = Depends(get_db)):
    ft = db.get(FormTemplate, form_template_id)
    if not ft or ft.study_id != study_id:
        raise HTTPException(status_code=404, detail="Form template not found")

    fields = db.execute(
        select(FormField)
        .where(FormField.form_template_id == form_template_id)
        .order_by(FormField.order.asc(), FormField.id.asc())
    ).scalars().all()

    return FormTemplateDetailOut(
        id=ft.id,
        studyId=ft.study_id,
        name=ft.name,
        code=ft.code,
        fields=[
            FormFieldOut(
                id=f.id,
                formTemplateId=f.form_template_id,
                label=f.label,
                key=f.key,
                type=f.type,
                required=f.required,
                order=f.order,
            )
            for f in fields
        ],
    )


@router.delete("/{form_template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_form_template(study_id: int, form_template_id: int, db: Session = Depends(get_db)):
    ft = db.get(FormTemplate, form_template_id)
    if not ft or ft.study_id != study_id:
        raise HTTPException(status_code=404, detail="Form template not found")

    db.delete(ft)
    db.commit()

    return None


# bu put endpoint, belirli bir çalışmaya (study) ait bir form şablonunu (form template) güncellemek için kullanılır.
# mevcut alanları (form fields) siler ve payload'taki yeni alanlarla değiştir

@router.put("/{form_template_id}", response_model=FormTemplateDetailOut)
def update_form_template(
    study_id: int, form_template_id: int, payload: FormTemplateUpdate, db: Session = Depends(get_db)
):
    # Form şablonunu bul
    ft = db.get(FormTemplate, form_template_id)
    if not ft or ft.study_id != study_id:
        raise HTTPException(status_code=404, detail="Form template not found")

    try:
        # 1. FormTemplate'in kendi alanlarını güncelle
        ft.name = payload.name
        ft.code = payload.code
        db.add(ft)

        # 2. Mevcut tüm alanları sil
        db.query(FormField).filter(FormField.form_template_id == form_template_id).delete()

        # 3. Yeni alanları oluştur
        created_fields = []
        for field_payload in payload.fields:
            field = FormField(
                form_template_id=form_template_id,
                label=field_payload.label,
                key=field_payload.key,
                type=field_payload.type,
                required=field_payload.required,
                order=field_payload.order,
            )
            db.add(field)
            created_fields.append(field)

        db.commit()

    except IntegrityError as e:
        db.rollback()
        if "form_templates_study_id_code_key" in str(e.orig):
            raise HTTPException(status_code=409, detail="Form template code must be unique within the study")
        if "form_fields_form_template_id_key_key" in str(e.orig):
            raise HTTPException(status_code=409, detail="Field key must be unique within the form")
        raise HTTPException(status_code=409, detail="A database integrity error occurred")

    # Güncellenmiş verileri döndür
    db.refresh(ft)
    # created_fields zaten güncel, refresh'e gerek yok ama tutarlılık için yapılabilir
    # for f in created_fields:
    #     db.refresh(f)

    return FormTemplateDetailOut(
        id=ft.id,
        studyId=ft.study_id,
        name=ft.name,
        code=ft.code,
        fields=[
            FormFieldOut(
                id=f.id,
                formTemplateId=f.form_template_id,
                label=f.label,
                key=f.key,
                type=f.type,
                required=f.required,
                order=f.order,
            )
            for f in created_fields
        ],
    )


@router.post("/{form_template_id}/fields", response_model=FormFieldOut, status_code=status.HTTP_201_CREATED)
def add_field(study_id: int, form_template_id: int, payload: FormFieldCreate, db: Session = Depends(get_db)):
    ft = db.get(FormTemplate, form_template_id)
    if not ft or ft.study_id != study_id:
        raise HTTPException(status_code=404, detail="Form template not found")

    field = FormField(
        form_template_id=form_template_id,
        label=payload.label,
        key=payload.key,
        type=payload.type,
        required=payload.required,
        order=payload.order,
    )
    db.add(field)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Field key must be unique within the form")

    db.refresh(field)
    return FormFieldOut(
        id=field.id,
        formTemplateId=field.form_template_id,
        label=field.label,
        key=field.key,
        type=field.type,
        required=field.required,
        order=field.order,
    )
