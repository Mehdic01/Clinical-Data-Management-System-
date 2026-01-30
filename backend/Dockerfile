FROM python:3.11-slim

WORKDIR /app

# System deps (psycopg için genelde sorun çıkmaz ama güvenli)
RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 8000

# Alembic migration + app start
CMD ["bash", "-lc", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
