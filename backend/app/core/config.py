from pydantic_settings import BaseSettings, SettingsConfigDict

# Bu dosyada uygulama yapılandırma ayarları tanımlanır. . env database bağlantı dizesi gibi ayarlar burada tutulur.
#****************************************************************************************

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    DATABASE_URL: str


settings = Settings()
