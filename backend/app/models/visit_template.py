import enum
from sqlalchemy import Enum, ForeignKey, Integer, String, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

# VisitTemplate modeli, bir çalışmaya (Study) ait ziyaret şablonlarını temsil eder.
# Her ziyaretin benzersiz bir kodu (code) ve çalışmaya göre sıralaması (day) vardır.
#****************************************************************************************

class VisitTemplate(Base):
    __tablename__ = "visit_templates"
    __table_args__ = (
        UniqueConstraint("study_id", "code", name="uq_visit_template_study_code"), # code unique within study
        Index("ix_visit_templates_study_day", "study_id", "day"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    study_id: Mapped[int] = mapped_column(
        ForeignKey("studies.id", ondelete="CASCADE"), #study silindiğinde ilişkili visit template'ler de silinir
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    code: Mapped[str] = mapped_column(String(64), nullable=False)  # unique within study
    day: Mapped[int] = mapped_column(Integer, nullable=False)      # days relative to enrollment
    window_before: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    window_after: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
