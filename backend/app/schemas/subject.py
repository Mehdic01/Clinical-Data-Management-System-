from datetime import date

from pydantic import BaseModel, Field
from typing import Literal


# Schema for creating a new subject.
class SubjectCreate(BaseModel):
    subjectIdentifier: str = Field(min_length=1, max_length=64)  # Unique identifier for the subject.
    enrollmentDate: date  # Date when the subject was enrolled.


# Schema for returning subject details.
class SubjectOut(BaseModel):
    id: int  # Unique ID of the subject.
    studyId: int  # ID of the study the subject belongs to.
    subjectIdentifier: str  # Unique identifier for the subject.
    enrollmentDate: date  # Date when the subject was enrolled.
    scheduleGenerated: bool  # Indicates if the schedule has been generated for the subject.


# Schema for returning scheduled visit details.
class ScheduledVisitOut(BaseModel):
    id: int  # Unique ID of the scheduled visit.
    subjectId: int  # ID of the subject the visit is scheduled for.
    visitTemplateId: int  # ID of the visit template.
    scheduledDate: date  # Date when the visit is scheduled.
    windowStart: date  # Start of the visit window.
    windowEnd: date  # End of the visit window.
    status: Literal["Pending", "Done"]  # Status of the visit.


# Schema for returning detailed subject information, including scheduled visits.
class SubjectDetailOut(BaseModel):
    id: int  # Unique ID of the subject.
    studyId: int  # ID of the study the subject belongs to.
    subjectIdentifier: str  # Unique identifier for the subject.
    enrollmentDate: date  # Date when the subject was enrolled.
    scheduleGenerated: bool  # Indicates if the schedule has been generated for the subject.
    scheduledVisits: list[ScheduledVisitOut]  # List of scheduled visits for the subject.
