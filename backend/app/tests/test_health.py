"""
Phase 1 tests — health check, DB connection, and table existence.

Integration tests without mocks. Sync HTTP calls to live API.
"""

EXPECTED_TABLES = sorted([
    "studies", "subjects", "scheduled_visits", "form_templates",
    "form_fields", "form_entries", "field_values", "visit_templates",
    "visit_template_forms"
])

def test_health_check(client):
    """GET /health returns 200 with service info."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"

def test_db_connection(db_conn):
    """Database is reachable and responds to queries."""
    cur = db_conn.cursor()
    cur.execute("SELECT 1 AS ok")
    assert cur.fetchone()[0] == 1
    cur.close()

def test_all_tables_exist(db_conn):
    """All domain tables exist after migration."""
    cur = db_conn.cursor()
    cur.execute(
        "SELECT table_name FROM information_schema.tables "
        "WHERE table_schema = 'public' ORDER BY table_name"
    )
    actual = sorted([row[0] for row in cur.fetchall()])
    cur.close()
    domain_tables = sorted([t for t in actual if t != "alembic_version"])
    assert domain_tables == EXPECTED_TABLES

def test_table_count(db_conn):
    """Domain tables + alembic_version = total table count."""
    cur = db_conn.cursor()
    cur.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")
    count = cur.fetchone()[0]
    cur.close()
    assert count == len(EXPECTED_TABLES) + 1

def test_foreign_keys_exist(db_conn):
    """Key foreign key relationships are established."""
    cur = db_conn.cursor()
    cur.execute(
        "SELECT tc.table_name, ccu.table_name AS foreign_table "
        "FROM information_schema.table_constraints tc "
        "JOIN information_schema.constraint_column_usage ccu "
        "  ON tc.constraint_name = ccu.constraint_name "
        "WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'"
    )
    fk_pairs = [(row[0], row[1]) for row in cur.fetchall()]
    cur.close()
    assert ("scheduled_visits", "subjects") in fk_pairs
    assert ("form_entries", "scheduled_visits") in fk_pairs
    assert ("field_values", "form_entries") in fk_pairs