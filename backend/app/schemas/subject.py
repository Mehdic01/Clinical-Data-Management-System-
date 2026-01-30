from datetime import date

from pydantic import BaseModel, Field


class SubjectCreate(BaseModel):
    subjectIdentifier: str = Field(min_length=1, max_length=64)
    enrollmentDate: date


class SubjectOut(BaseModel):
    id: int
    studyId: int
    subjectIdentifier: str
    enrollmentDate: date


class ScheduledVisitOut(BaseModel):
    id: int
    subjectId: int
    visitTemplateId: int
    scheduledDate: date
    actualDate: date | None = None
    status: str
    notes: str | None = None


class SubjectDetailOut(BaseModel):
    id: int
    studyId: int
    subjectIdentifier: str
    enrollmentDate: date
    scheduledVisits: list[ScheduledVisitOut]
