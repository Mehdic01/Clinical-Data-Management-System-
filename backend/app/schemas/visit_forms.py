from pydantic import BaseModel, Field


# Schema for attaching form templates to a visit template.
class AttachFormsRequest(BaseModel):
    formTemplateIds: list[int] = Field(default_factory=list, description="List of formTemplateIds to attach")  # IDs of form templates to attach.


# Schema for returning details of an attached form.
class AttachedFormOut(BaseModel):
    id: int  # Unique ID of the attached form.
    name: str  # Name of the form.
    code: str  # Code of the form.


# Schema for returning details of a visit template along with its attached forms.
class VisitTemplateWithFormsOut(BaseModel):
    id: int  # Unique ID of the visit template.
    studyId: int  # ID of the study the visit template belongs to.
    name: str  # Name of the visit template.
    code: str  # Code of the visit template.
    day: int  # Day number relative to enrollment.
    windowBefore: int  # Days before the planned day.
    windowAfter: int  # Days after the planned day.
    attachedForms: list[AttachedFormOut]  # List of attached forms.
