import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine, select
from sqlmodel.pool import StaticPool
from main import app, get_session
from auth import get_password_hash

# Setup in-memory SQLite for testing
sqlite_url = "sqlite://"
engine = create_engine(
    sqlite_url,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

def test_register_and_login(client: TestClient):
    # Register farm and farmer
    reg_resp = client.post("/register/farm", params={"username": "farmer1", "password": "password123"}, json={"name": "My Farm", "location": "Italy"})
    assert reg_resp.status_code == 200
    
    # Login
    login_resp = client.post("/token", data={"username": "farmer1", "password": "password123"})
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    assert token is not None

def test_tractor_data_api(client: TestClient, session: Session):
    # Setup: Create farm and vehicle
    from models import FarmTable, VehicleTable
    farm = FarmTable(name="F1", location="L1")
    session.add(farm)
    session.commit()
    vehicle = VehicleTable(name="T1", model="M1", license_plate="L1", device_id="TRACTOR_001", farm_id=farm.id)
    session.add(vehicle)
    session.commit()
    
    # Post data
    data = {
        "deviceId": "TRACTOR_001",
        "rpm": 2000,
        "coolantTemp": 95,
        "speed": 10.5,
        "errors": ["E1"]
    }
    resp = client.post("/api/tractor-data", json=data)
    assert resp.status_code == 200
    
    # Check recommendation (assuming PGN logic or error code triggers it)
    from models import RecommendationTable
    recs = session.exec(select(RecommendationTable)).all()
    assert len(recs) > 0
    assert "Maintenance" in recs[0].title
