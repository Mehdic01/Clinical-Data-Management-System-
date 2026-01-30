from datetime import datetime
from pydantic import BaseModel, Field
from typing import Literal


# Field value için input
class FieldValueInput(BaseModel):
    fieldId: int
    value: str


# Form entry oluşturma isteği
class FormEntryCreate(BaseModel):
    formTemplateId: int
    fieldValues: list[FieldValueInput]


# Field value output
class FieldValueOut(BaseModel):
    id: int
    fieldId: int
    value: str


# Form entry output (basit)
class FormEntryOut(BaseModel):
    id: int
    scheduledVisitId: int
    formTemplateId: int
    status: Literal["Draft", "Submitted"]
    submittedAt: datetime | None
    createdAt: datetime


# Form entry output (field values dahil)
class FormEntryDetailOut(BaseModel):
    id: int
    scheduledVisitId: int
    formTemplateId: int
    status: Literal["Draft", "Submitted"]
    submittedAt: datetime | None
    createdAt: datetime
    fieldValues: list[FieldValueOut]


# Scheduled visit için form listesi
class ScheduledVisitFormOut(BaseModel):
    formTemplateId: int
    name: str
    code: str
    fieldCount: int
    entry: FormEntryOut | None  # Doldurulmuşsa entry bilgisi, yoksa None