import enum
from datetime import datetime
from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.base import Base

# FormEntry modeli, bir planlanmış ziyaret (ScheduledVisit) için doldurulan formları (forms) temsil eder.
# Her form girişi, belirli bir form şablonuna (FormTemplate) aittir ve durumu (status) izler.
#****************************************************************************************

class FormEntryStatus(str, enum.Enum):
    Draft = "Draft"
    Submitted = "Submitted"


class FormEntry(Base):
    __tablename__ = "form_entries"
    __table_args__ = (
        # Bir scheduled_visit için aynı form_template sadece 1 kez doldurulabilir
        UniqueConstraint("scheduled_visit_id", "form_template_id", name="uq_form_entry_visit_form"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    scheduled_visit_id: Mapped[int] = mapped_column(
        ForeignKey("scheduled_visits.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    form_template_id: Mapped[int] = mapped_column(
        ForeignKey("form_templates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    status: Mapped[FormEntryStatus] = mapped_column(
        SAEnum(FormEntryStatus, native_enum=False),
        nullable=False,
        default=FormEntryStatus.Submitted,
    )

    submitted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())