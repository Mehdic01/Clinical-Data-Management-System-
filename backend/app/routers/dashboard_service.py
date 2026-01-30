from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.study import Study, StudyStatus
from app.models.scheduled_visit import ScheduledVisit, ScheduledVisitStatus

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def get_db():
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()


# GET: Dashboard ozet sayimlarini dondurur.
#*********************************************************************************************************************
@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
	active_studies = db.execute(
		select(func.count()).select_from(Study).where(Study.status == StudyStatus.Active)
	).scalar_one()
	draft_studies = db.execute(
		select(func.count()).select_from(Study).where(Study.status == StudyStatus.Draft)
	).scalar_one()
	scheduled_visits = db.execute(
		select(func.count()).select_from(ScheduledVisit)
	).scalar_one()
	done_scheduled_visits = db.execute(
		select(func.count())
		.select_from(ScheduledVisit)
		.where(ScheduledVisit.status == ScheduledVisitStatus.Done)
	).scalar_one()

	return {
		"activeStudies": active_studies,
		"draftStudies": draft_studies,
		"scheduledVisits": scheduled_visits,
		"doneScheduledVisits": done_scheduled_visits,
	}
