from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import SQLModel, Session, create_engine, select
from typing import List, Optional
from datetime import timedelta

from models import (
    FarmTable, FarmBase,
    UserTable, UserBase,
    FieldTable, FieldBase, 
    SensorTable, SensorBase, 
    SensorReadingTable, SensorReadingBase,
    VehicleTable, VehicleBase,
    VehicleDiagnosticTable, VehicleDiagnosticBase,
    EmployeeTable, EmployeeBase,
    RecommendationTable
)
from services.ai_engine import analyze_sensor_reading, analyze_vehicle_diagnostic
from auth import (
    get_password_hash, verify_password, create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES, oauth2_scheme, SECRET_KEY, ALGORITHM
)
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

# Carica variabili d'ambiente
load_dotenv()

DB_USER = os.getenv("DB_USER", "AgriSmart")
DB_PASS = os.getenv("DB_PASS", "tomaru")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "AgriSmart")

# Connessione MySQL
mysql_url = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"
engine = create_engine(mysql_url, pool_pre_ping=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

app = FastAPI(title="AgroManager API")

# Configurazione CORS - Permette al frontend di comunicare con il backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    try:
        create_db_and_tables()
    except Exception as e:
        print(f"Errore durante la creazione delle tabelle: {e}")

# --- Auth Dependencies ---
async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = session.exec(select(UserTable).where(UserTable.username == username)).first()
    if user is None:
        raise credentials_exception
    return user

# --- Auth Routes ---
@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(UserTable).where(UserTable.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register/farm", response_model=UserTable)
def register_farm(farm: FarmBase, username: str, password: str, language: str = "it", session: Session = Depends(get_session)):
    db_farm = FarmTable.from_orm(farm)
    session.add(db_farm)
    session.commit()
    session.refresh(db_farm)
    
    db_user = UserTable(
        username=username,
        hashed_password=get_password_hash(password),
        farm_id=db_farm.id,
        role="farmer",
        language=language
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

# --- Protected Endpoints ---

@app.get("/fields/", response_model=List[FieldTable])
def read_fields(current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    fields = session.exec(select(FieldTable).where(FieldTable.farm_id == current_user.farm_id)).all()
    return fields

@app.post("/fields/", response_model=FieldTable)
def create_field(field: FieldBase, current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    db_field = FieldTable.from_orm(field)
    db_field.farm_id = current_user.farm_id
    session.add(db_field)
    session.commit()
    session.refresh(db_field)
    return db_field

@app.get("/sensors/", response_model=List[SensorTable])
def read_sensors(current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    fields = session.exec(select(FieldTable).where(FieldTable.farm_id == current_user.farm_id)).all()
    field_ids = [f.id for f in fields]
    if not field_ids: return []
    sensors = session.exec(select(SensorTable).where(SensorTable.field_id.in_(field_ids))).all()
    return sensors

@app.post("/sensors/", response_model=SensorTable)
def create_sensor(sensor: SensorBase, current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    field = session.get(FieldTable, sensor.field_id)
    if not field or field.farm_id != current_user.farm_id:
        raise HTTPException(status_code=403, detail="Not authorized for this field")
    db_sensor = SensorTable.from_orm(sensor)
    session.add(db_sensor)
    session.commit()
    session.refresh(db_sensor)
    return db_sensor

@app.get("/readings/", response_model=List[SensorReadingTable])
def read_sensor_readings(current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    fields = session.exec(select(FieldTable).where(FieldTable.farm_id == current_user.farm_id)).all()
    field_ids = [f.id for f in fields]
    if not field_ids: return []
    sensors = session.exec(select(SensorTable).where(SensorTable.field_id.in_(field_ids))).all()
    sensor_ids = [s.id for s in sensors]
    if not sensor_ids: return []
    readings = session.exec(select(SensorReadingTable).where(SensorReadingTable.sensor_id.in_(sensor_ids))).all()
    return readings

@app.post("/readings/", response_model=SensorReadingTable)
def create_sensor_reading(reading: SensorReadingBase, current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    sensor = session.get(SensorTable, reading.sensor_id)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
    field = session.get(FieldTable, sensor.field_id)
    if not field or field.farm_id != current_user.farm_id:
        raise HTTPException(status_code=403, detail="Not authorized for this sensor")

    db_reading = SensorReadingTable.from_orm(reading)
    session.add(db_reading)
    session.commit()
    session.refresh(db_reading)

    # AI Analysis
    recommendation = analyze_sensor_reading(db_reading, sensor.type)
    if recommendation:
        recommendation.farm_id = current_user.farm_id
        session.add(recommendation)
        session.commit()

    return db_reading

@app.get("/vehicles/", response_model=List[VehicleTable])
def read_vehicles(current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    vehicles = session.exec(select(VehicleTable).where(VehicleTable.farm_id == current_user.farm_id)).all()
    return vehicles

@app.post("/vehicles/", response_model=VehicleTable)
def create_vehicle(vehicle: VehicleBase, current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    db_vehicle = VehicleTable.from_orm(vehicle)
    db_vehicle.farm_id = current_user.farm_id
    session.add(db_vehicle)
    session.commit()
    session.refresh(db_vehicle)
    return db_vehicle

@app.get("/diagnostics/", response_model=List[VehicleDiagnosticTable])
def read_diagnostics(current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    vehicles = session.exec(select(VehicleTable).where(VehicleTable.farm_id == current_user.farm_id)).all()
    vehicle_ids = [v.id for v in vehicles]
    if not vehicle_ids: return []
    diagnostics = session.exec(select(VehicleDiagnosticTable).where(VehicleDiagnosticTable.vehicle_id.in_(vehicle_ids))).all()
    return diagnostics

@app.get("/employees/", response_model=List[EmployeeTable])
def read_employees(current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    employees = session.exec(select(EmployeeTable).where(EmployeeTable.farm_id == current_user.farm_id)).all()
    return employees

@app.post("/employees/", response_model=EmployeeTable)
def create_employee(employee: EmployeeBase, current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    db_employee = EmployeeTable.from_orm(employee)
    db_employee.farm_id = current_user.farm_id
    session.add(db_employee)
    session.commit()
    session.refresh(db_employee)
    return db_employee

@app.put("/employees/{employee_id}", response_model=EmployeeTable)
def update_employee(employee_id: int, employee_update: EmployeeBase, current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    db_employee = session.get(EmployeeTable, employee_id)
    if not db_employee or db_employee.farm_id != current_user.farm_id:
        raise HTTPException(status_code=404, detail="Employee not found")

    employee_data = employee_update.dict(exclude_unset=True)
    for key, value in employee_data.items():
        setattr(db_employee, key, value)

    db_employee.farm_id = current_user.farm_id
    session.add(db_employee)
    session.commit()
    session.refresh(db_employee)
    return db_employee

@app.get("/recommendations/", response_model=List[RecommendationTable])
def read_recommendations(current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    recs = session.exec(select(RecommendationTable).where(RecommendationTable.farm_id == current_user.farm_id)).all()
    return recs

# --- Public API for Tractor Data (Device Integration) ---
@app.post("/api/tractor-data")
def receive_tractor_data(data: dict, session: Session = Depends(get_session)):
    device_id = data.get("deviceId")
    vehicle = session.exec(select(VehicleTable).where(VehicleTable.device_id == device_id)).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    diagnostic = VehicleDiagnosticTable(
        vehicle_id=vehicle.id,
        rpm=data.get("rpm"),
        coolant_temp=data.get("coolantTemp"),
        speed=data.get("speed"),
        error_code=",".join(data.get("errors", [])) if data.get("errors") else None,
    )
    session.add(diagnostic)
    session.commit()
    session.refresh(diagnostic)
    
    # AI Analysis
    recommendation = analyze_vehicle_diagnostic(diagnostic)
    if recommendation:
        recommendation.farm_id = vehicle.farm_id
        session.add(recommendation)
        session.commit()
        
    return {"status": "success"}

@app.get("/")
def read_root():
    return {"message": "AgroManager API is running"}
