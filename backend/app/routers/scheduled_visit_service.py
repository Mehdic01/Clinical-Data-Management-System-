from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.subject import Subject
from app.models.scheduled_visit import ScheduledVisit, ScheduledVisitStatus
from app.models.visit_template import VisitTemplate
from app.schemas.subject import ScheduledVisitOut

router = APIRouter(tags=["scheduled-visits"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# POST: Subject icin visit template'lere gore scheduled visit olusturur.
# "schedule_generated" flag'ini gunceller. ve o ilgili subjectin scheduled visit'lerini dondurur.
#*********************************************************************************************************************
@router.post(
    "/subjects/{subject_id}/scheduled-visits",
    response_model=list[ScheduledVisitOut],
    status_code=status.HTTP_201_CREATED,
)
def generate_scheduled_visits(subject_id: int, db: Session = Depends(get_db)):
    subject = db.get(Subject, subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    if subject.schedule_generated:
        raise HTTPException(status_code=409, detail="Schedule already generated")

    visit_templates = db.execute(
        select(VisitTemplate)
        .where(VisitTemplate.study_id == subject.study_id)
        .order_by(VisitTemplate.day.asc(), VisitTemplate.id.asc())
    ).scalars().all()

    if not visit_templates:
        raise HTTPException(status_code=400, detail="No visit templates found for this study")

    created_visits: list[ScheduledVisit] = []

    try:
        for vt in visit_templates:
            scheduled_date = subject.enrollment_date + timedelta(days=vt.day)
            window_start = scheduled_date - timedelta(days=vt.window_before)
            window_end = scheduled_date + timedelta(days=vt.window_after)

            sv = ScheduledVisit(
                subject_id=subject.id,
                visit_template_id=vt.id,
                scheduled_date=scheduled_date,
                window_start=window_start,
                window_end=window_end,
                status=ScheduledVisitStatus.Pending,
            )
            db.add(sv)
            created_visits.append(sv)

        subject.schedule_generated = True
        db.add(subject)
        db.commit()

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Scheduled visits already exist")

    return [
        ScheduledVisitOut(
            id=sv.id,
            subjectId=sv.subject_id,
            visitTemplateId=sv.visit_template_id,
            scheduledDate=sv.scheduled_date,
            windowStart=sv.window_start,
            windowEnd=sv.window_end,
            status=sv.status.value,
        )
        for sv in created_visits
    ]
