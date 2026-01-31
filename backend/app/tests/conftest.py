"""Pytest fixtures for integration tests.

Real tests — no mocks. All tests hit actual PostgreSQL.
Tests run inside the Docker container and make HTTP calls to the live API.
Uses psycopg2 (sync) for direct DB assertions.
"""

import os
import pytest
import psycopg2
import httpx
from dotenv import load_dotenv

load_dotenv()

API_BASE = os.environ.get("TEST_API_URL", "http://localhost:8000")

@pytest.fixture(scope="session")
def api():
    """Sync HTTP client that calls the live running API server.
    Avoids all asyncpg/event-loop issues by using sync httpx.
    """
    with httpx.Client(base_url=API_BASE, timeout=10.0) as client:
        yield client

@pytest.fixture(scope="session")
def client(api):
    """Alias for the `api` fixture to maintain compatibility with tests expecting `client`."""
    yield api

@pytest.fixture(scope="session")
def db_conn():
    """Sync psycopg2 connection for direct DB assertions."""
    conn = psycopg2.connect(
        host=os.environ["PGHOST"],  # Zorunlu, eksikse KeyError fırlatır
        port=os.environ["PGPORT"],  # Zorunlu, eksikse KeyError fırlatır
        dbname=os.environ["POSTGRES_DB"],  # Zorunlu, eksikse KeyError fırlatır
        user=os.environ["POSTGRES_USER"],  # Zorunlu, eksikse KeyError fırlatır
        password=os.environ["POSTGRES_PASSWORD"],
    )
    conn.autocommit = True
    yield conn
    conn.close()