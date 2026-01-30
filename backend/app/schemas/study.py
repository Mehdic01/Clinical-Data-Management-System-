from pydantic import BaseModel, Field
from app.models.study import StudyStatus


#schemas sınıfının amacı, veritabanı modelleri ile API arasındaki veri alışverişini düzenlemektir. asıl model dosyasındaki Study sınıfı veritabanı yapısını tanımlarken, 
#bu şema sınıfları API istek ve yanıtlarında kullanılacak veri formatlarını belirler.
class StudyCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    protocolCode: str = Field(min_length=1, max_length=64)
    status: StudyStatus


class StudyOut(BaseModel):
    id: int
    name: str
    protocolCode: str
    status: StudyStatus

    class Config:
        from_attributes = True