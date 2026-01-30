from datetime import date

from pydantic import BaseModel, Field
from typing import Literal


class SubjectCreate(BaseModel):
    subjectIdentifier: str = Field(min_length=1, max_length=64)
    enrollmentDate: date


class SubjectOut(BaseModel):
    id: int
    studyId: int
    subjectIdentifier: str
    enrollmentDate: date
    scheduleGenerated: bool


class ScheduledVisitOut(BaseModel):
    id: int
    subjectId: int
    visitTemplateId: int
    scheduledDate: date
    windowStart: date
    windowEnd: date
    status: Literal["Pending", "Done"]


class SubjectDetailOut(BaseModel):
    id: int
    studyId: int
    subjectIdentifier: str
    enrollmentDate: date
    scheduleGenerated: bool
    scheduledVisits: list[ScheduledVisitOut]
