from pydantic import BaseModel, Field
from enum import Enum


class FieldType(str, Enum):
    TEXT = "Text"
    NUMBER = "Number"
    DATE = "Date"



class FormFieldCreate(BaseModel):
    label: str = Field(min_length=1, max_length=200)
    key: str = Field(min_length=1, max_length=64)
    type: FieldType
    required: bool = False
    order: int = Field(default=0, ge=0)


class FormFieldUpdate(BaseModel):
    id: int | None = None  # Var olan bir alanı güncellemek için
    label: str = Field(min_length=1, max_length=200)
    key: str = Field(min_length=1, max_length=64)
    type: FieldType
    required: bool = False
    order: int = Field(ge=0)


class FormTemplateUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    code: str = Field(min_length=1, max_length=64)
    fields: list[FormFieldUpdate] = []


class FormTemplateCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    code: str = Field(min_length=1, max_length=64)
    fields: list[FormFieldCreate] = []


class FormTemplateOut(BaseModel):
    id: int
    studyId: int = Field(alias="study_id")
    name: str
    code: str

    class Config:
        from_attributes = True
        populate_by_name = True


class FormFieldOut(BaseModel):
    id: int
    formTemplateId: int = Field(alias="form_template_id")
    label: str
    key: str
    type: FieldType
    required: bool
    order: int

    class Config:
        from_attributes = True
        populate_by_name = True


class FormTemplateDetailOut(BaseModel):
    id: int
    studyId: int = Field(alias="study_id")
    name: str
    code: str
    fields: list[FormFieldOut]

    class Config:
        from_attributes = True
        populate_by_name = True
