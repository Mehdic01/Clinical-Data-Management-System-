from pydantic import BaseModel, Field


class VisitTemplateCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    code: str = Field(min_length=1, max_length=64)

    day: int = Field(ge=0, description="Day number relative to enrollment")
    windowBefore: int = Field(ge=0, description="Days before planned day")
    windowAfter: int = Field(ge=0, description="Days after planned day")


class VisitTemplateOut(BaseModel):
    id: int
    studyId: int
    name: str
    code: str
    day: int
    windowBefore: int
    windowAfter: int

    class Config:
        from_attributes = True


class VisitTemplateUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    code: str | None = Field(default=None, min_length=1, max_length=64)
    day: int | None = Field(default=None, ge=0)
    windowBefore: int | None = Field(default=None, ge=0)
    windowAfter: int | None = Field(default=None, ge=0)
