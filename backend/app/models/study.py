from sqlalchemy import String, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
import enum


class StudyStatus(str, enum.Enum):
    Draft = "Draft"
    Active = "Active"


class Study(Base):
    __tablename__ = "studies"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    protocol_code: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    status: Mapped[StudyStatus] = mapped_column(SAEnum(StudyStatus, native_enum=False), nullable=False, default=StudyStatus.Draft)