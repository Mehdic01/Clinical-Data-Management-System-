from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

# bu model, ziyaret şablonları (visit templates) ile form şablonları (form templates) arasındaki ilişkiyi temsil eder
# join table olarak işlev görür.
#****************************************************************************************

class VisitTemplateForm(Base):
    __tablename__ = "visit_template_forms"
    __table_args__ = (
        UniqueConstraint("visit_template_id", "form_template_id", name="uq_vt_form_unique"), # unique constraint sayesinde aynı form_template bir visit_template'e sadece bir kez eklenebilir
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    visit_template_id: Mapped[int] = mapped_column(
        ForeignKey("visit_templates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    form_template_id: Mapped[int] = mapped_column(
        ForeignKey("form_templates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
