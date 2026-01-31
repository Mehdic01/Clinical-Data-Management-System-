import enum

from sqlalchemy import Boolean, Enum, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

# bu sınıf FormTemplate'a ait form alanlarını (form fields) temsil eder.
# her form alanının benzersiz bir anahtarı (key) ve türü (type) vardır.
# form içinde eklenen her field için sıralama (order) bilgisi tutulur. ve gereklilik (required) durumu belirtilir. ve type olarak Text, Number, Date gibi türler bulunur.
#****************************************************************************************

class FieldType(str, enum.Enum):
    Text = "Text"
    Number = "Number"
    Date = "Date"


class FormField(Base):
    __tablename__ = "form_fields"
    __table_args__ = (
        UniqueConstraint("form_template_id", "key", name="uq_form_field_form_key"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    form_template_id: Mapped[int] = mapped_column(
        ForeignKey("form_templates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    label: Mapped[str] = mapped_column(String(200), nullable=False)
    key: Mapped[str] = mapped_column(String(64), nullable=False)  # unique within the form
    type: Mapped[FieldType] = mapped_column(Enum(FieldType, name="field_type"), nullable=False)
    required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # UI'da sıralama için kullanılır
    order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
