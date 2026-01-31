from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

# FieldValue modeli, bir form girişi (FormEntry) için doldurulan alan değerlerini (field values) temsil eder.
# Her alan değeri, belirli bir form alanına (FormField) aittir ve değeri (value) saklar.
#****************************************************************************************

class FieldValue(Base):
    __tablename__ = "field_values"
    __table_args__ = (
        # Bir form_entry için aynı field sadece 1 kez değer alabilir
        UniqueConstraint("form_entry_id", "field_id", name="uq_field_value_entry_field"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    form_entry_id: Mapped[int] = mapped_column(
        ForeignKey("form_entries.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    field_id: Mapped[int] = mapped_column(
        ForeignKey("form_fields.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    value: Mapped[str] = mapped_column(Text, nullable=False)