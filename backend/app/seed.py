from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.study import Study
from app.models.visit_template import VisitTemplate
from app.models.form_template import FormTemplate
from app.models.form_field import FormField, FieldType
from app.models.visit_template_form import VisitTemplateForm
from app.models.subject import Subject

# bu sınıf seed işlemi için kullanılacak ve eğer veritabanında zaten varsa tekrar eklemeyecek.
# docker ile proje ayağa kalktığında otomatik olarak çalıştırılabilir.
#****************************************************************************************

def seed(db: Session) -> None:
    # 1) Idempotency check: bu protocol_code'lardan biri varsa seed yapma
    existing = db.execute(
        select(Study).where(Study.protocol_code.in_(["ADNI-001", "CBAS-001", "HUNT-001"]))
    ).scalar_one_or_none()
    if existing:
        print("Seed already applied. Skipping.")
        return

    # 2) Studies
    studies = [
        Study(
            name="Alzheimer’s Disease Neuroimaging Initiative (ADNI)",
            protocol_code="ADNI-001",
            status="Active",
        ),
        Study(
            name="Czech Brain Ageing Study (CBAS)",
            protocol_code="CBAS-001",
            status="Active",
        ),
        Study(
            name="The Trøndelag Health Study (HUNT)",
            protocol_code="HUNT-001",
            status="Draft",
        ),
    ]
    db.add_all(studies)
    db.flush()

    # 3) Visit Templates for ADNI
    adni_study = studies[0]
    adni_visits = [
        VisitTemplate(
            study_id=adni_study.id,
            name="Baseline",
            code="V1",
            day=0,
            window_before=0,
            window_after=0,
        ),
        VisitTemplate(
            study_id=adni_study.id,
            name="Week 4",
            code="V2",
            day=28,
            window_before=3,
            window_after=3,
        ),
        VisitTemplate(
            study_id=adni_study.id,
            name="Week 12",
            code="V3",
            day=84,
            window_before=7,
            window_after=7,
        ),
        VisitTemplate(
            study_id=adni_study.id,
            name="EOS",
            code="V4",
            day=90,
            window_before=5,
            window_after=5,
        ),
    ]
    db.add_all(adni_visits)

    # 3b) Form Templates for ADNI
    adni_cog = FormTemplate(
        study_id=adni_study.id,
        name="Cognitive Assessment",
        code="ADNI_COG",
    )
    adni_img = FormTemplate(
        study_id=adni_study.id,
        name="Neuroimaging Summary",
        code="ADNI_IMG",
    )
    adni_bio = FormTemplate(
        study_id=adni_study.id,
        name="Biomarker Panel",
        code="ADNI_BIO",
    )
    db.add_all([adni_cog, adni_img, adni_bio])
    db.flush()

    # 3c) Form Fields for ADNI
    db.add_all([
        # Cognitive Assessment
        FormField(
            form_template_id=adni_cog.id,
            label="MMSE Total Score",
            key="mmse_score",
            type=FieldType.Number,
            required=True,
            order=1,
        ),
        FormField(
            form_template_id=adni_cog.id,
            label="ADAS-Cog Total Score",
            key="adas_cog_score",
            type=FieldType.Number,
            required=True,
            order=2,
        ),
        FormField(
            form_template_id=adni_cog.id,
            label="CDR Global Score",
            key="cdr_global_score",
            type=FieldType.Number,
            required=True,
            order=3,
        ),
        FormField(
            form_template_id=adni_cog.id,
            label="Memory Recall Score",
            key="memory_recall_score",
            type=FieldType.Number,
            required=False,
            order=4,
        ),
        FormField(
            form_template_id=adni_cog.id,
            label="Assessment Date",
            key="assessment_date",
            type=FieldType.Date,
            required=True,
            order=5,
        ),
        # Neuroimaging Summary
        FormField(
            form_template_id=adni_img.id,
            label="MRI Scan Date",
            key="mri_scan_date",
            type=FieldType.Date,
            required=True,
            order=1,
        ),
        FormField(
            form_template_id=adni_img.id,
            label="Hippocampal Volume (mm³)",
            key="hippocampal_volume",
            type=FieldType.Number,
            required=False,
            order=2,
        ),
        FormField(
            form_template_id=adni_img.id,
            label="Whole Brain Volume (mm³)",
            key="brain_volume",
            type=FieldType.Number,
            required=False,
            order=3,
        ),
        FormField(
            form_template_id=adni_img.id,
            label="PET Amyloid SUVR",
            key="amyloid_suvr",
            type=FieldType.Number,
            required=False,
            order=4,
        ),
        FormField(
            form_template_id=adni_img.id,
            label="Imaging Notes",
            key="imaging_notes",
            type=FieldType.Text,
            required=False,
            order=5,
        ),
        # Biomarker Panel
        FormField(
            form_template_id=adni_bio.id,
            label="Blood Collection Date",
            key="blood_date",
            type=FieldType.Date,
            required=True,
            order=1,
        ),
        FormField(
            form_template_id=adni_bio.id,
            label="Plasma Amyloid Beta 42",
            key="amyloid_beta_42",
            type=FieldType.Number,
            required=False,
            order=2,
        ),
        FormField(
            form_template_id=adni_bio.id,
            label="Plasma Amyloid Beta 40",
            key="amyloid_beta_40",
            type=FieldType.Number,
            required=False,
            order=3,
        ),
        FormField(
            form_template_id=adni_bio.id,
            label="Phosphorylated Tau Level",
            key="ptau_level",
            type=FieldType.Number,
            required=False,
            order=4,
        ),
        FormField(
            form_template_id=adni_bio.id,
            label="Neurofilament Light (NfL)",
            key="nfl_level",
            type=FieldType.Number,
            required=False,
            order=5,
        ),
    ])

    # 4) Visit Templates for CBAS
    cbas_study = studies[1]
    cbas_visits = [
        VisitTemplate(
            study_id=cbas_study.id,
            name="Enrollment Visit",
            code="V1",
            day=0,
            window_before=0,
            window_after=0,
        ),
        VisitTemplate(
            study_id=cbas_study.id,
            name="Week 2 Safety Check",
            code="V2",
            day=14,
            window_before=2,
            window_after=2,
        ),
        VisitTemplate(
            study_id=cbas_study.id,
            name="Week 6 Evaluation",
            code="V3",
            day=42,
            window_before=3,
            window_after=3,
        ),
        VisitTemplate(
            study_id=cbas_study.id,
            name="Week 14 Midpoint Visit",
            code="V4",
            day=98,
            window_before=5,
            window_after=5,
        ),
        VisitTemplate(
            study_id=cbas_study.id,
            name="End of Study Visit",
            code="V5",
            day=182,
            window_before=7,
            window_after=7,
        ),
    ]
    db.add_all(cbas_visits)

    # 4b) Form Templates for CBAS
    cbas_demo = FormTemplate(
        study_id=cbas_study.id,
        name="Demographics & Lifestyle",
        code="CBAS_DEMO",
    )
    cbas_neuro = FormTemplate(
        study_id=cbas_study.id,
        name="Neuropsychological Battery",
        code="CBAS_NEURO",
    )
    cbas_labs = FormTemplate(
        study_id=cbas_study.id,
        name="Physical & Laboratory Assessment",
        code="CBAS_LABS",
    )
    db.add_all([cbas_demo, cbas_neuro, cbas_labs])
    db.flush()

    # 4c) Form Fields for CBAS
    db.add_all([
        # Demographics & Lifestyle
        FormField(
            form_template_id=cbas_demo.id,
            label="Date of Birth",
            key="date_of_birth",
            type=FieldType.Date,
            required=True,
            order=1,
        ),
        FormField(
            form_template_id=cbas_demo.id,
            label="Sex",
            key="sex",
            type=FieldType.Text,
            required=True,
            order=2,
        ),
        FormField(
            form_template_id=cbas_demo.id,
            label="Years of Education",
            key="education_years",
            type=FieldType.Number,
            required=False,
            order=3,
        ),
        FormField(
            form_template_id=cbas_demo.id,
            label="Smoking History",
            key="smoking_history",
            type=FieldType.Text,
            required=False,
            order=4,
        ),
        FormField(
            form_template_id=cbas_demo.id,
            label="Physical Activity Description",
            key="physical_activity",
            type=FieldType.Text,
            required=False,
            order=5,
        ),
        # Neuropsychological Battery
        FormField(
            form_template_id=cbas_neuro.id,
            label="Test Date",
            key="test_date",
            type=FieldType.Date,
            required=True,
            order=1,
        ),
        FormField(
            form_template_id=cbas_neuro.id,
            label="Verbal Memory Score",
            key="verbal_memory_score",
            type=FieldType.Number,
            required=True,
            order=2,
        ),
        FormField(
            form_template_id=cbas_neuro.id,
            label="Executive Function Score",
            key="executive_function_score",
            type=FieldType.Number,
            required=True,
            order=3,
        ),
        FormField(
            form_template_id=cbas_neuro.id,
            label="Attention Score",
            key="attention_score",
            type=FieldType.Number,
            required=False,
            order=4,
        ),
        FormField(
            form_template_id=cbas_neuro.id,
            label="Spatial Navigation Score",
            key="spatial_navigation_score",
            type=FieldType.Number,
            required=False,
            order=5,
        ),
        # Physical & Laboratory Assessment
        FormField(
            form_template_id=cbas_labs.id,
            label="Visit Date",
            key="visit_date",
            type=FieldType.Date,
            required=True,
            order=1,
        ),
        FormField(
            form_template_id=cbas_labs.id,
            label="Systolic Blood Pressure",
            key="systolic_bp",
            type=FieldType.Number,
            required=True,
            order=2,
        ),
        FormField(
            form_template_id=cbas_labs.id,
            label="Diastolic Blood Pressure",
            key="diastolic_bp",
            type=FieldType.Number,
            required=True,
            order=3,
        ),
        FormField(
            form_template_id=cbas_labs.id,
            label="Body Mass Index",
            key="bmi",
            type=FieldType.Number,
            required=False,
            order=4,
        ),
        FormField(
            form_template_id=cbas_labs.id,
            label="Total Cholesterol",
            key="total_cholesterol",
            type=FieldType.Number,
            required=False,
            order=5,
        ),
    ])

    # 5) Subjects for ADNI and CBAS
    adni_subjects = [
        Subject(
            study_id=adni_study.id,
            subject_identifier="ADNI-0001",
            enrollment_date=date(2024, 1, 15),
        ),
        Subject(
            study_id=adni_study.id,
            subject_identifier="ADNI-0002",
            enrollment_date=date(2024, 2, 5),
        ),
    ]
    cbas_subjects = [
        Subject(
            study_id=cbas_study.id,
            subject_identifier="CBAS-0001",
            enrollment_date=date(2024, 3, 12),
        ),
        Subject(
            study_id=cbas_study.id,
            subject_identifier="CBAS-0002",
            enrollment_date=date(2024, 4, 2),
        ),
    ]
    db.add_all(adni_subjects + cbas_subjects)

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
