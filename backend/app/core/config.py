from pydantic_settings import BaseSettings, SettingsConfigDict

# Bu dosyada uygulama yapılandırma ayarları tanımlanır. . env database bağlantı dizesi gibi ayarlar burada tutulur.
#****************************************************************************************

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    DATABASE_URL: str
    PGPORT: int  
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    PGHOST: str  
    TEST_API_URL: str  


settings = Settings()
