from pydantic import BaseModel, Field


class AttachFormsRequest(BaseModel):
    formTemplateIds: list[int] = Field(default_factory=list, description="List of formTemplateIds to attach")


class AttachedFormOut(BaseModel):
    id: int
    name: str
    code: str


class VisitTemplateWithFormsOut(BaseModel):
    id: int
    studyId: int
    name: str
    code: str
    day: int
    windowBefore: int
    windowAfter: int
    attachedForms: list[AttachedFormOut]
