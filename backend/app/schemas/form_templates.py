from pydantic import BaseModel, Field
from enum import Enum


class FieldType(str, Enum):
    TEXT = "Text"  # Text field.
    NUMBER = "Number"  # Number field.
    DATE = "Date"  # Date field.



class FormFieldCreate(BaseModel):
    label: str = Field(min_length=1, max_length=200)  # Label of the form field.
    key: str = Field(min_length=1, max_length=64)  # Unique key for the form field.
    type: FieldType  # Type of the form field.
    required: bool = False  # Indicates if the field is required.
    order: int = Field(default=0, ge=0)  # Order of the field in the form.


class FormFieldUpdate(BaseModel):
    id: int | None = None  # ID of the form field to update.
    label: str = Field(min_length=1, max_length=200)  # Updated label of the form field.
    key: str = Field(min_length=1, max_length=64)  # Updated unique key for the form field.
    type: FieldType  # Updated type of the form field.
    required: bool = False  # Indicates if the field is required.
    order: int = Field(ge=0)  # Updated order of the field in the form.


class FormTemplateUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=200)  # Updated name of the form template.
    code: str = Field(min_length=1, max_length=64)  # Updated code of the form template.
    fields: list[FormFieldUpdate] = []  # List of updated fields in the form template.


class FormTemplateCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)  # Name of the form template.
    code: str = Field(min_length=1, max_length=64)  # Code of the form template.
    fields: list[FormFieldCreate] = []  # List of fields in the form template.


class FormTemplateOut(BaseModel):
    id: int  # Unique ID of the form template.
    studyId: int = Field(alias="study_id")  # ID of the study the form template belongs to.
    name: str  # Name of the form template.
    code: str  # Code of the form template.

    class Config:
        from_attributes = True
        populate_by_name = True


class FormFieldOut(BaseModel):
    id: int  # Unique ID of the form field.
    formTemplateId: int = Field(alias="form_template_id")  # ID of the form template the field belongs to.
    label: str  # Label of the form field.
    key: str  # Unique key for the form field.
    type: FieldType  # Type of the form field.
    required: bool  # Indicates if the field is required.
    order: int  # Order of the field in the form.

    class Config:
        from_attributes = True
        populate_by_name = True


class FormTemplateDetailOut(BaseModel):
    id: int  # Unique ID of the form template.
    studyId: int = Field(alias="study_id")  # ID of the study the form template belongs to.
    name: str  # Name of the form template.
    code: str  # Code of the form template.
    fields: list[FormFieldOut]  # List of fields in the form template.

    class Config:
        from_attributes = True
        populate_by_name = True
