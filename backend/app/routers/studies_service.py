from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.study import Study, StudyStatus
from app.schemas.study import StudyCreate, StudyOut

router = APIRouter(prefix="/studies", tags=["studies"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# POST: Create a new study with input validation using Pydantic schemas.
#**********************************************************
@router.post("", response_model=StudyOut, status_code=status.HTTP_201_CREATED)
def create_study(payload: StudyCreate, db: Session = Depends(get_db)):
    study = Study(
        name=payload.name,
        protocol_code=payload.protocolCode,
        status=payload.status,
    )
    db.add(study)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="protocolCode must be unique",
        )
    db.refresh(study)

    return StudyOut(
        id=study.id,
        name=study.name,
        protocolCode=study.protocol_code,
        status=study.status,
    )

# GET: List all studies in the database.
#**********************************************************
@router.get("", response_model=list[StudyOut])
def list_studies(db: Session = Depends(get_db)):
    rows = db.execute(select(Study).order_by(Study.id.desc())).scalars().all()
    return [
        StudyOut(
            id=s.id,
            name=s.name,
            protocolCode=s.protocol_code,
            status=s.status,
        )
        for s in rows
    ]

# GET: Get a specific study by ID.
#**********************************************************
@router.get("/{study_id}", response_model=StudyOut)
def get_study(study_id: int, db: Session = Depends(get_db)):
    study = db.get(Study, study_id)
    if not study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study not found",
        )
    return StudyOut(
        id=study.id,
        name=study.name,
        protocolCode=study.protocol_code,
        status=study.status,
    )

# PUT: Activate a specific study.
#**********************************************************
@router.put("/{study_id}/activate", response_model=StudyOut)
def activate_study(study_id: int, db: Session = Depends(get_db)):
    study = db.get(Study, study_id)
    if not study:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study not found",
        )

    study.status = StudyStatus.Active
    db.add(study)
    db.commit()
    db.refresh(study)

    return StudyOut(
        id=study.id,
        name=study.name,
        protocolCode=study.protocol_code,
        status=study.status,
    )