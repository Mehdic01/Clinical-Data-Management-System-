from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.study import Study
from app.models.visit_template import VisitTemplate
from app.models.form_template import FormTemplate
from app.models.form_field import FormField, FieldType
from app.models.visit_template_form import VisitTemplateForm

# bu sınıf seed işlemi için kullanılacak ve eğer veritabanında zaten varsa tekrar eklemeyecek.
# docker ile proje ayağa kalktığında otomatik olarak çalıştırılabilir.
#****************************************************************************************

def seed(db: Session) -> None:
    # 1) Idempotency check: bu protocol_code varsa seed yapma
    existing = db.execute(select(Study).where(Study.protocol_code == "HTN-001")).scalar_one_or_none()
    if existing:
        print("Seed already applied. Skipping.")
        return

    # 2) Study
    study = Study(name="Hypertension Study", protocol_code="HTN-001", status="Draft")
    db.add(study)
    db.flush()  # study.id gelsin

    # 3) Visit Templates
    baseline = VisitTemplate(
        study_id=study.id,
        name="Baseline",
        code="V1",
        day=0,
        window_before=0,
        window_after=0,
    )
    followup = VisitTemplate(
        study_id=study.id,
        name="Follow-up",
        code="V2",
        day=14,
        window_before=3,
        window_after=3,
    )
    db.add_all([baseline, followup])
    db.flush()

    # 4) Form Templates
    vital = FormTemplate(study_id=study.id, name="Vital Signs", code="VS")
    demo = FormTemplate(study_id=study.id, name="Demographics", code="DEMO")
    db.add_all([vital, demo])
    db.flush()

    # 5) Fields (FormField)
    # Vital Signs fields
    db.add_all([
        FormField(
            form_template_id=vital.id,
            label="Blood Pressure",
            key="bloodPressure",
            type=FieldType.Number,
            required=True,
            order=1,
        ),
        FormField(
            form_template_id=vital.id,
            label="Heart Rate",
            key="heartRate",
            type=FieldType.Number,
            required=True,
            order=2,
        ),
        FormField(
            form_template_id=vital.id,
            label="Visit Date",
            key="visitDate",
            type=FieldType.Date,
            required=False,
            order=3,
        ),
    ])

    # Demographics fields
    db.add_all([
        FormField(
            form_template_id=demo.id,
            label="Age",
            key="age",
            type=FieldType.Number,
            required=True,
            order=1,
        ),
        FormField(
            form_template_id=demo.id,
            label="Sex",
            key="sex",
            type=FieldType.Text,
            required=True,
            order=2,
        ),
    ])
    db.flush()

    # 6) Attach forms to visits (VisitTemplateForm)
    # Baseline: Vital + Demo
    db.add_all([
        VisitTemplateForm(visit_template_id=baseline.id, form_template_id=vital.id),
        VisitTemplateForm(visit_template_id=baseline.id, form_template_id=demo.id),
    ])
    # Follow-up: Vital only
    db.add(VisitTemplateForm(visit_template_id=followup.id, form_template_id=vital.id))

    db.commit()
    print("Seed applied successfully.")


def main():
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
