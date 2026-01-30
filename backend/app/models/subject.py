from datetime import date

from sqlalchemy import Date, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


# Subject modeli: study altinda subject kayitlarini temsil eder
class Subject(Base):
	__tablename__ = "subjects"
	__table_args__ = (
		UniqueConstraint("study_id", "subject_identifier", name="uq_subject_study_identifier"),
	)

	id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

	study_id: Mapped[int] = mapped_column(
		ForeignKey("studies.id", ondelete="CASCADE"),
		nullable=False,
		index=True,
	)

	subject_identifier: Mapped[str] = mapped_column(String(64), nullable=False)
	enrollment_date: Mapped[date] = mapped_column(Date, nullable=False)
