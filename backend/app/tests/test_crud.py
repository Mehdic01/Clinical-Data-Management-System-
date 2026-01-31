"""tests — CRUD endpoints, collaboration, audit trail.

Real integration tests. No mocks. Sync HTTP calls to live API.
Prerequisite: Phase 2 (seed users) + Phase 3 (ingest data) already executed.
"""

import pytest



@pytest.fixture(scope="module")
def auth_header():
    """Provide authentication headers for API requests."""
    return {}  # No authentication required


@pytest.fixture(scope="module")
def study_id(api, auth_header):
    """Get the study_id for a specific study."""
    r = api.get("/studies", headers=auth_header)
    assert r.status_code == 200
    studies = r.json()
    study = next((s for s in studies if "Test Study" in s["name"]), None)
    assert study is not None, "Test Study not found"
    return study["id"]


# --- Studies ---
#************************************************************************************************************

def test_create_study(api, auth_header):
    """POST /studies creates a new study."""
    payload = {
        "name": "Test Study",
        "protocolCode": "TS-001",
        "status": "Draft",
    }
    r = api.post("/studies", json=payload, headers=auth_header)
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["protocolCode"] == payload["protocolCode"]
    assert data["status"] == payload["status"]


def test_list_studies(api, auth_header):
    """GET /studies returns all studies."""
    r = api.get("/studies", headers=auth_header)
    assert r.status_code == 200
    studies = r.json()
    assert len(studies) > 0, "No studies found"
    names = [s["name"] for s in studies]
    assert any("Test Study" in n for n in names)


def test_get_study_by_id(api, auth_header, study_id):
    """GET /studies/:id returns study detail."""
    r = api.get(f"/studies/{study_id}", headers=auth_header)
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == study_id
    assert "Test Study" in data["name"]


def test_activate_study(api, auth_header):
    """PUT /studies/:id/activate activates a study."""
    # Create a study first
    payload = {
        "name": "Test Study",
        "protocolCode": "TS-001",
        "status": "Draft",
    }
    create_response = api.post("/studies", json=payload, headers=auth_header)
    study_id = create_response.json()["id"]

    # Activate the study
    r = api.put(f"/studies/{study_id}/activate", headers=auth_header)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "Active"


# --- Visit Templates ---
#************************************************************************************************************

def test_create_visit_template(api, auth_header, study_id):
    """POST /studies/{study_id}/visit-templates creates a new visit template."""
    payload = {
        "name": "Test Visit Template",
        "code": "TVT-001",
        "day": 1,
        "windowBefore": 2,
        "windowAfter": 3,
    }
    r = api.post(f"/studies/{study_id}/visit-templates", json=payload, headers=auth_header)
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["code"] == payload["code"]
    assert data["day"] == payload["day"]
    assert data["windowBefore"] == payload["windowBefore"]
    assert data["windowAfter"] == payload["windowAfter"]

def test_list_visit_templates(api, auth_header, study_id):
    """GET /studies/{study_id}/visit-templates returns all visit templates."""
    r = api.get(f"/studies/{study_id}/visit-templates", headers=auth_header)
    assert r.status_code == 200
    visit_templates = r.json()
    assert len(visit_templates) > 0, "No visit templates found"

def test_update_visit_template(api, auth_header, study_id):
    """PUT /studies/{study_id}/visit-templates/{visit_template_id} updates a visit template."""
    # Önce bir visit template oluştur
    payload = {
        "name": "Visit Template to Update",
        "code": "VTU-001",
        "day": 5,
        "windowBefore": 1,
        "windowAfter": 1,
    }
    create_response = api.post(f"/studies/{study_id}/visit-templates", json=payload, headers=auth_header)
    visit_template_id = create_response.json()["id"]

    # Güncelleme işlemi
    update_payload = {
        "name": "Updated Visit Template",
        "day": 10,
    }
    r = api.put(f"/studies/{study_id}/visit-templates/{visit_template_id}", json=update_payload, headers=auth_header)
    assert r.status_code == 200
    data = r.json()
    assert data["name"] == update_payload["name"]
    assert data["day"] == update_payload["day"]

def test_delete_visit_template(api, auth_header, study_id):
    """DELETE /studies/{study_id}/visit-templates/{visit_template_id} deletes a visit template."""
    # Önce bir visit template oluştur
    payload = {
        "name": "Visit Template to Delete",
        "code": "VTD-001",
        "day": 3,
        "windowBefore": 1,
        "windowAfter": 1,
    }
    create_response = api.post(f"/studies/{study_id}/visit-templates", json=payload, headers=auth_header)
    visit_template_id = create_response.json()["id"]

    # Silme işlemi
    r = api.delete(f"/studies/{study_id}/visit-templates/{visit_template_id}", headers=auth_header)
    assert r.status_code == 204


# --- Form Templates ---
#************************************************************************************************************

def test_create_form_template(api, auth_header, study_id):
    """POST /studies/{study_id}/form-templates creates a new form template."""
    payload = {
        "name": "Test Form Template",
        "code": "TFT-001",
        "fields": [
            {
                "label": "Field 1",
                "key": "field_1",
                "type": "text",
                "required": True,
                "order": 1,
            },
            {
                "label": "Field 2",
                "key": "field_2",
                "type": "number",
                "required": False,
                "order": 2,
            },
        ],
    }
    r = api.post(f"/studies/{study_id}/form-templates", json=payload, headers=auth_header)
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["code"] == payload["code"]
    assert len(data["fields"]) == len(payload["fields"])

def test_list_form_templates(api, auth_header, study_id):
    """GET /studies/{study_id}/form-templates returns all form templates."""
    r = api.get(f"/studies/{study_id}/form-templates", headers=auth_header)
    assert r.status_code == 200
    form_templates = r.json()
    assert len(form_templates) > 0, "No form templates found"

def test_get_form_template_detail(api, auth_header, study_id):
    """GET /studies/{study_id}/form-templates/{form_template_id} returns form template details."""
    # Önce bir form template oluştur
    payload = {
        "name": "Form Template Detail",
        "code": "FTD-001",
        "fields": [
            {
                "label": "Field 1",
                "key": "field_1",
                "type": "text",
                "required": True,
                "order": 1,
            }
        ],
    }
    create_response = api.post(f"/studies/{study_id}/form-templates", json=payload, headers=auth_header)
    form_template_id = create_response.json()["id"]

    # Detayları al
    r = api.get(f"/studies/{study_id}/form-templates/{form_template_id}", headers=auth_header)
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == form_template_id
    assert data["name"] == payload["name"]

def test_update_form_template(api, auth_header, study_id):
    """PUT /studies/{study_id}/form-templates/{form_template_id} updates a form template."""
    # Önce bir form template oluştur
    payload = {
        "name": "Form Template to Update",
        "code": "FTU-001",
        "fields": [
            {
                "label": "Field 1",
                "key": "field_1",
                "type": "text",
                "required": True,
                "order": 1,
            }
        ],
    }
    create_response = api.post(f"/studies/{study_id}/form-templates", json=payload, headers=auth_header)
    form_template_id = create_response.json()["id"]

    # Güncelleme işlemi
    update_payload = {
        "name": "Updated Form Template",
        "code": "FTU-002",
        "fields": [
            {
                "label": "Updated Field",
                "key": "updated_field",
                "type": "text",
                "required": False,
                "order": 1,
            }
        ],
    }
    r = api.put(f"/studies/{study_id}/form-templates/{form_template_id}", json=update_payload, headers=auth_header)
    assert r.status_code == 200
    data = r.json()
    assert data["name"] == update_payload["name"]
    assert data["code"] == update_payload["code"]
    assert len(data["fields"]) == len(update_payload["fields"])

def test_delete_form_template(api, auth_header, study_id):
    """DELETE /studies/{study_id}/form-templates/{form_template_id} deletes a form template."""
    # Önce bir form template oluştur
    payload = {
        "name": "Form Template to Delete",
        "code": "FTD-002",
        "fields": [
            {
                "label": "Field 1",
                "key": "field_1",
                "type": "text",
                "required": True,
                "order": 1,
            }
        ],
    }
    create_response = api.post(f"/studies/{study_id}/form-templates", json=payload, headers=auth_header)
    form_template_id = create_response.json()["id"]

    # Silme işlemi
    r = api.delete(f"/studies/{study_id}/form-templates/{form_template_id}", headers=auth_header)
    assert r.status_code == 204

def test_get_form_field_count(api, auth_header, study_id):
    """GET /studies/{study_id}/form-templates/{form_template_id}/field-count returns the field count."""
    # Önce bir form template oluştur
    payload = {
        "name": "Form Template Field Count",
        "code": "FTFC-001",
        "fields": [
            {
                "label": "Field 1",
                "key": "field_1",
                "type": "text",
                "required": True,
                "order": 1,
            },
            {
                "label": "Field 2",
                "key": "field_2",
                "type": "number",
                "required": False,
                "order": 2,
            },
        ],
    }
    create_response = api.post(f"/studies/{study_id}/form-templates", json=payload, headers=auth_header)
    form_template_id = create_response.json()["id"]

    # Alan sayısını al
    r = api.get(f"/studies/{study_id}/form-templates/{form_template_id}/field-count", headers=auth_header)
    assert r.status_code == 200
    data = r.json()
    assert data["count"] == len(payload["fields"])

def test_add_field_to_form_template(api, auth_header, study_id):
    """POST /studies/{study_id}/form-templates/{form_template_id}/fields adds a field to a form template."""
    # Önce bir form template oluştur
    payload = {
        "name": "Form Template Add Field",
        "code": "FTAF-001",
        "fields": [
            {
                "label": "Field 1",
                "key": "field_1",
                "type": "text",
                "required": True,
                "order": 1,
            }
        ],
    }
    create_response = api.post(f"/studies/{study_id}/form-templates", json=payload, headers=auth_header)
    form_template_id = create_response.json()["id"]

    # Yeni bir alan ekle
    new_field_payload = {
        "label": "New Field",
        "key": "new_field",
        "type": "text",
        "required": False,
        "order": 2,
    }
    r = api.post(f"/studies/{study_id}/form-templates/{form_template_id}/fields", json=new_field_payload, headers=auth_header)
    assert r.status_code == 201
    data = r.json()
    assert data["label"] == new_field_payload["label"]
    assert data["key"] == new_field_payload["key"]


# --- Visit Forms ---
#************************************************************************************************************

def test_get_visit_template_detail(api, auth_header, study_id):
    """GET /studies/{study_id}/visit-templates/{visit_template_id} returns visit template details."""
    # Önce bir visit template oluştur
    visit_template_payload = {
        "name": "Visit Template Detail",
        "code": "VTD-001",
        "day": 1,
        "windowBefore": 2,
        "windowAfter": 3,
    }
    visit_template_response = api.post(f"/studies/{study_id}/visit-templates", json=visit_template_payload, headers=auth_header)
    visit_template_id = visit_template_response.json()["id"]

    # Detayları al
    r = api.get(f"/studies/{study_id}/visit-templates/{visit_template_id}", headers=auth_header)
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == visit_template_id
    assert data["name"] == visit_template_payload["name"]

def test_list_study_form_templates(api, auth_header, study_id):
    """GET /studies/{study_id}/form-templates returns all form templates for a study."""
    # Önce bir form template oluştur
    form_template_payload = {
        "name": "Form Template for Listing",
        "code": "FTL-001",
        "fields": [
            {
                "label": "Field 1",
                "key": "field_1",
                "type": "text",
                "required": True,
                "order": 1,
            }
        ],
    }
    api.post(f"/studies/{study_id}/form-templates", json=form_template_payload, headers=auth_header)

    # Form template'leri listele
    r = api.get(f"/studies/{study_id}/form-templates", headers=auth_header)
    assert r.status_code == 200
    form_templates = r.json()
    assert len(form_templates) > 0

def test_replace_attached_forms(api, auth_header, study_id):
    """PUT /studies/{study_id}/visit-templates/{visit_template_id}/attached-forms replaces attached forms."""
    # Önce bir visit template oluştur
    visit_template_payload = {
        "name": "Visit Template for Attach",
        "code": "VTA-001",
        "day": 1,
        "windowBefore": 2,
        "windowAfter": 3,
    }
    visit_template_response = api.post(f"/studies/{study_id}/visit-templates", json=visit_template_payload, headers=auth_header)
    visit_template_id = visit_template_response.json()["id"]

    # Bir form template oluştur
    form_template_payload = {
        "name": "Form Template to Attach",
        "code": "FTA-001",
        "fields": [
            {
                "label": "Field 1",
                "key": "field_1",
                "type": "text",
                "required": True,
                "order": 1,
            }
        ],
    }
    form_template_response = api.post(f"/studies/{study_id}/form-templates", json=form_template_payload, headers=auth_header)
    form_template_id = form_template_response.json()["id"]

    # Form'u visit template'e bağla
    attach_payload = {"formTemplateIds": [form_template_id]}
    r = api.put(f"/studies/{study_id}/visit-templates/{visit_template_id}/attached-forms", json=attach_payload, headers=auth_header)
    assert r.status_code == 204


# --- Subjects ---
#************************************************************************************************************

def test_list_subjects(api, auth_header, study_id):
    """GET /studies/{study_id}/subjects returns all subjects for a study."""
    # Create a subject first
    payload = {
        "subjectIdentifier": "SUBJ-001",
        "enrollmentDate": "2026-01-01",
    }
    api.post(f"/studies/{study_id}/subjects", json=payload, headers=auth_header)

    # List subjects
    r = api.get(f"/studies/{study_id}/subjects", headers=auth_header)
    assert r.status_code == 200
    subjects = r.json()
    assert len(subjects) > 0
    assert subjects[0]["studyId"] == study_id

def test_get_subject_detail(api, auth_header, study_id):
    """GET /subjects/{subject_id} returns subject details."""
    # Create a subject first
    payload = {
        "subjectIdentifier": "SUBJ-002",
        "enrollmentDate": "2026-01-02",
    }
    subject_response = api.post(f"/studies/{study_id}/subjects", json=payload, headers=auth_header)
    subject_id = subject_response.json()["id"]

    # Get subject details
    r = api.get(f"/subjects/{subject_id}", headers=auth_header)
    assert r.status_code == 200
    subject = r.json()
    assert subject["id"] == subject_id
    assert subject["studyId"] == study_id

def test_create_subject(api, auth_header, study_id):
    """POST /studies/{study_id}/subjects creates a new subject."""
    payload = {
        "subjectIdentifier": "SUBJ-003",
        "enrollmentDate": "2026-01-03",
    }
    r = api.post(f"/studies/{study_id}/subjects", json=payload, headers=auth_header)
    assert r.status_code == 201
    subject = r.json()
    assert subject["studyId"] == study_id
    assert subject["subjectIdentifier"] == payload["subjectIdentifier"]

def test_delete_subject(api, auth_header, study_id):
    """DELETE /subjects/{subject_id} deletes a subject."""
    # Create a subject first
    payload = {
        "subjectIdentifier": "SUBJ-004",
        "enrollmentDate": "2026-01-04",
    }
    subject_response = api.post(f"/studies/{study_id}/subjects", json=payload, headers=auth_header)
    subject_id = subject_response.json()["id"]

    # Delete the subject
    r = api.delete(f"/subjects/{subject_id}", headers=auth_header)
    assert r.status_code == 204

# --- Scheduled Visits ---
#************************************************************************************************************

def test_generate_scheduled_visits(api, auth_header, study_id):
    """POST /subjects/{subject_id}/scheduled-visits generates scheduled visits for a subject."""
    # Önce bir visit template oluştur
    visit_template_payload = {
        "name": "Visit Template 1",
        "code": "VT1",
        "day": 10,
        "windowBefore": 2,
        "windowAfter": 3,
    }
    api.post(f"/studies/{study_id}/visit-templates", json=visit_template_payload, headers=auth_header)

    # Bir subject oluştur
    subject_payload = {
        "subjectIdentifier": "SUBJ-005",
        "enrollmentDate": "2026-01-01",
    }
    subject_response = api.post(f"/studies/{study_id}/subjects", json=subject_payload, headers=auth_header)
    subject_id = subject_response.json()["id"]

    # Scheduled visits oluştur
    r = api.post(f"/subjects/{subject_id}/scheduled-visits", headers=auth_header)
    assert r.status_code == 201
    scheduled_visits = r.json()
    assert len(scheduled_visits) > 0
    assert scheduled_visits[0]["subjectId"] == subject_id
    assert scheduled_visits[0]["status"] == "Pending"


# --- Form Entries ---
#************************************************************************************************************

def test_get_scheduled_visit_forms(api, auth_header, study_id):
    """GET /scheduled-visits/{scheduled_visit_id}/forms returns forms and their completion status for a scheduled visit."""
    # Create a visit template
    visit_template_payload = {
        "name": "Visit Template 1",
        "code": "VT1",
        "day": 10,
        "windowBefore": 2,
        "windowAfter": 3,
    }
    visit_template_response = api.post(f"/studies/{study_id}/visit-templates", json=visit_template_payload, headers=auth_header)
    visit_template_id = visit_template_response.json()["id"]

    # Attach a form template to the visit template
    form_template_payload = {
        "name": "Form Template 1",
        "code": "FT1",
        "fields": [
            {
                "label": "Field 1",
                "key": "field_1",
                "type": "text",
                "required": True,
                "order": 1,
            }
        ],
    }
    form_template_response = api.post(f"/studies/{study_id}/form-templates", json=form_template_payload, headers=auth_header)
    form_template_id = form_template_response.json()["id"]

    attach_payload = {"formTemplateIds": [form_template_id]}
    api.put(f"/studies/{study_id}/visit-templates/{visit_template_id}/attached-forms", json=attach_payload, headers=auth_header)

    # Create a subject and scheduled visit
    subject_payload = {
        "subjectIdentifier": "SUBJ-001",
        "enrollmentDate": "2026-01-01",
    }
    subject_response = api.post(f"/studies/{study_id}/subjects", json=subject_payload, headers=auth_header)
    subject_id = subject_response.json()["id"]

    scheduled_visit_response = api.get(f"/subjects/{subject_id}/scheduled-visits", headers=auth_header)
    scheduled_visit_id = scheduled_visit_response.json()[0]["id"]

    # Get forms for the scheduled visit
    r = api.get(f"/scheduled-visits/{scheduled_visit_id}/forms", headers=auth_header)
    assert r.status_code == 200
    forms = r.json()
    assert len(forms) > 0
    assert forms[0]["formTemplateId"] == form_template_id

def test_get_form_entry_detail(api, auth_header, study_id):
    """GET /form-entries/{form_entry_id} returns details of a form entry."""
    # Create a visit template and attach a form template
    visit_template_payload = {
        "name": "Visit Template 2",
        "code": "VT2",
        "day": 15,
        "windowBefore": 3,
        "windowAfter": 5,
    }
    visit_template_response = api.post(f"/studies/{study_id}/visit-templates", json=visit_template_payload, headers=auth_header)
    visit_template_id = visit_template_response.json()["id"]

    form_template_payload = {
        "name": "Form Template 2",
        "code": "FT2",
        "fields": [
            {
                "label": "Field 1",
                "key": "field_1",
                "type": "text",
                "required": True,
                "order": 1,
            }
        ],
    }
    form_template_response = api.post(f"/studies/{study_id}/form-templates", json=form_template_payload, headers=auth_header)
    form_template_id = form_template_response.json()["id"]

    attach_payload = {"formTemplateIds": [form_template_id]}
    api.put(f"/studies/{study_id}/visit-templates/{visit_template_id}/attached-forms", json=attach_payload, headers=auth_header)

    # Create a subject and scheduled visit
    subject_payload = {
        "subjectIdentifier": "SUBJ-002",
        "enrollmentDate": "2026-01-02",
    }
    subject_response = api.post(f"/studies/{study_id}/subjects", json=subject_payload, headers=auth_header)
    subject_id = subject_response.json()["id"]

    scheduled_visit_response = api.get(f"/subjects/{subject_id}/scheduled-visits", headers=auth_header)
    scheduled_visit_id = scheduled_visit_response.json()[0]["id"]

    # Submit a form entry
    form_entry_payload = {
        "formTemplateId": form_template_id,
        "fieldValues": [
            {"fieldId": 1, "value": "Test Value"},
        ],
    }
    form_entry_response = api.post(f"/scheduled-visits/{scheduled_visit_id}/form-entries", json=form_entry_payload, headers=auth_header)
    form_entry_id = form_entry_response.json()["id"]

    # Get form entry details
    r = api.get(f"/form-entries/{form_entry_id}", headers=auth_header)
    assert r.status_code == 200
    form_entry = r.json()
    assert form_entry["id"] == form_entry_id
    assert form_entry["formTemplateId"] == form_template_id

def test_create_form_entry(api, auth_header, study_id):
    """POST /scheduled-visits/{scheduled_visit_id}/form-entries creates a new form entry."""
    # Create a visit template and attach a form template
    visit_template_payload = {
        "name": "Visit Template 3",
        "code": "VT3",
        "day": 20,
        "windowBefore": 4,
        "windowAfter": 6,
    }
    visit_template_response = api.post(f"/studies/{study_id}/visit-templates", json=visit_template_payload, headers=auth_header)
    visit_template_id = visit_template_response.json()["id"]

    form_template_payload = {
        "name": "Form Template 3",
        "code": "FT3",
        "fields": [
            {
                "label": "Field 1",
                "key": "field_1",
                "type": "text",
                "required": True,
                "order": 1,
            }
        ],
    }
    form_template_response = api.post(f"/studies/{study_id}/form-templates", json=form_template_payload, headers=auth_header)
    form_template_id = form_template_response.json()["id"]

    attach_payload = {"formTemplateIds": [form_template_id]}
    api.put(f"/studies/{study_id}/visit-templates/{visit_template_id}/attached-forms", json=attach_payload, headers=auth_header)

    # Create a subject and scheduled visit
    subject_payload = {
        "subjectIdentifier": "SUBJ-003",
        "enrollmentDate": "2026-01-03",
    }
    subject_response = api.post(f"/studies/{study_id}/subjects", json=subject_payload, headers=auth_header)
    subject_id = subject_response.json()["id"]

    scheduled_visit_response = api.get(f"/subjects/{subject_id}/scheduled-visits", headers=auth_header)
    scheduled_visit_id = scheduled_visit_response.json()[0]["id"]

    # Submit a form entry
    form_entry_payload = {
        "formTemplateId": form_template_id,
        "fieldValues": [
            {"fieldId": 1, "value": "Test Value"},
        ],
    }
    r = api.post(f"/scheduled-visits/{scheduled_visit_id}/form-entries", json=form_entry_payload, headers=auth_header)
    assert r.status_code == 201
    form_entry = r.json()
    assert form_entry["formTemplateId"] == form_template_id
    assert form_entry["fieldValues"][0]["value"] == "Test Value"





