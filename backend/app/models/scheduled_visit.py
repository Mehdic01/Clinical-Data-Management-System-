from datetime import date
import enum

from sqlalchemy import Date, Enum as SAEnum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ScheduledVisitStatus(str, enum.Enum):
	Pending = "Pending"
	Done = "Done"


class ScheduledVisit(Base):
	__tablename__ = "scheduled_visits"
	__table_args__ = (
		UniqueConstraint("subject_id", "visit_template_id", name="uq_subject_visit_template"),
	)

	id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

	subject_id: Mapped[int] = mapped_column(
		ForeignKey("subjects.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)

	visit_template_id: Mapped[int] = mapped_column(
		ForeignKey("visit_templates.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)

	scheduled_date: Mapped[date] = mapped_column(Date, nullable=False)
	window_start: Mapped[date] = mapped_column(Date, nullable=False)
	window_end: Mapped[date] = mapped_column(Date, nullable=False)
	status: Mapped[ScheduledVisitStatus] = mapped_column(
		SAEnum(ScheduledVisitStatus, native_enum=False),
		nullable=False,
		default=ScheduledVisitStatus.Pending,
	)
