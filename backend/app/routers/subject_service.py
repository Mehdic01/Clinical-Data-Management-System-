from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.study import Study
from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectOut, SubjectDetailOut

router = APIRouter(tags=["subjects"])


def get_db():
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()


# GET: Belirli bir study'e ait tüm subject'leri listeler.
#*********************************************************************************************************************
@router.get("/studies/{study_id}/subjects", response_model=list[SubjectOut])
def list_subjects(study_id: int, db: Session = Depends(get_db)):
	if not db.get(Study, study_id):
		raise HTTPException(status_code=404, detail="Study not found")

	rows = db.execute(
		select(Subject)
		.where(Subject.study_id == study_id)
		.order_by(Subject.id.desc())
	).scalars().all()

	return [
		SubjectOut(
			id=s.id,
			studyId=s.study_id,
			subjectIdentifier=s.subject_identifier,
			enrollmentDate=s.enrollment_date,
		)
		for s in rows
	]


# GET: Tek bir subject detayını (scheduledVisits dahil) getirir.
#*********************************************************************************************************************
@router.get("/subjects/{subject_id}", response_model=SubjectDetailOut)
def get_subject_detail(subject_id: int, db: Session = Depends(get_db)):
	subject = db.get(Subject, subject_id)
	if not subject:
		raise HTTPException(status_code=404, detail="Subject not found")

	return SubjectDetailOut(
		id=subject.id,
		studyId=subject.study_id,
		subjectIdentifier=subject.subject_identifier,
		enrollmentDate=subject.enrollment_date,
		scheduledVisits=[],
	)


# POST: Belirli bir study'e yeni subject ekler.
#*********************************************************************************************************************
@router.post("/studies/{study_id}/subjects", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
def create_subject(study_id: int, payload: SubjectCreate, db: Session = Depends(get_db)):
	if not db.get(Study, study_id):
		raise HTTPException(status_code=404, detail="Study not found")

	subject = Subject(
		study_id=study_id,
		subject_identifier=payload.subjectIdentifier,
		enrollment_date=payload.enrollmentDate,
	)
	db.add(subject)
	try:
		db.commit()
	except IntegrityError:
		db.rollback()
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="subjectIdentifier must be unique within the study",
		)

	db.refresh(subject)
	return SubjectOut(
		id=subject.id,
		studyId=subject.study_id,
		subjectIdentifier=subject.subject_identifier,
		enrollmentDate=subject.enrollment_date,
	)


# DELETE: Tek bir subject kaydını siler.
#*********************************************************************************************************************
@router.delete("/subjects/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
	subject = db.get(Subject, subject_id)
	if not subject:
		raise HTTPException(status_code=404, detail="Subject not found")

	db.delete(subject)
	db.commit()
	return None
