from pydantic import BaseModel, Field


# Schema for creating a new visit template.
class VisitTemplateCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)  # Name of the visit template.
    code: str = Field(min_length=1, max_length=64)  # Code of the visit template.
    day: int = Field(ge=0, description="Day number relative to enrollment")  # Day number relative to enrollment.
    windowBefore: int = Field(ge=0, description="Days before planned day")  # Days before the planned day.
    windowAfter: int = Field(ge=0, description="Days after planned day")  # Days after the planned day.


# Schema for returning details of a visit template.
class VisitTemplateOut(BaseModel):
    id: int  # Unique ID of the visit template.
    studyId: int  # ID of the study the visit template belongs to.
    name: str  # Name of the visit template.
    code: str  # Code of the visit template.
    day: int  # Day number relative to enrollment.
    windowBefore: int  # Days before the planned day.
    windowAfter: int  # Days after the planned day.

    class Config:
        from_attributes = True


# Schema for updating an existing visit template.
class VisitTemplateUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)  # Updated name of the visit template.
    code: str | None = Field(default=None, min_length=1, max_length=64)  # Updated code of the visit template.
    day: int | None = Field(default=None, ge=0)  # Updated day number relative to enrollment.
    windowBefore: int | None = Field(default=None, ge=0)  # Updated days before the planned day.
    windowAfter: int | None = Field(default=None, ge=0)  # Updated days after the planned day.
