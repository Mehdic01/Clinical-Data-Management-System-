from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class FormTemplate(Base):
    __tablename__ = "form_templates"
    __table_args__ = (
        UniqueConstraint("study_id", "code", name="uq_form_template_study_code"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    study_id: Mapped[int] = mapped_column(
        ForeignKey("studies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    code: Mapped[str] = mapped_column(String(64), nullable=False)  # unique within study

