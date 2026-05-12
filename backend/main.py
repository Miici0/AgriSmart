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

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

app = FastAPI(title="AgroManager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

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
def register_farm(farm: FarmBase, username: str, password: str, session: Session = Depends(get_session)):
    db_farm = FarmTable.from_orm(farm)
    session.add(db_farm)
    session.commit()
    session.refresh(db_farm)
    
    db_user = UserTable(
        username=username,
        hashed_password=get_password_hash(password),
        farm_id=db_farm.id,
        role="farmer"
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
    if field.farm_id != current_user.farm_id:
        raise HTTPException(status_code=403, detail="Not authorized for this farm")
    db_field = FieldTable.from_orm(field)
    session.add(db_field)
    session.commit()
    session.refresh(db_field)
    return db_field

@app.get("/vehicles/", response_model=List[VehicleTable])
def read_vehicles(current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    vehicles = session.exec(select(VehicleTable).where(VehicleTable.farm_id == current_user.farm_id)).all()
    return vehicles

@app.post("/vehicles/", response_model=VehicleTable)
def create_vehicle(vehicle: VehicleBase, current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    if vehicle.farm_id != current_user.farm_id:
        raise HTTPException(status_code=403, detail="Not authorized for this farm")
    db_vehicle = VehicleTable.from_orm(vehicle)
    session.add(db_vehicle)
    session.commit()
    session.refresh(db_vehicle)
    return db_vehicle

@app.get("/employees/", response_model=List[EmployeeTable])
def read_employees(current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    employees = session.exec(select(EmployeeTable).where(EmployeeTable.farm_id == current_user.farm_id)).all()
    return employees

@app.post("/employees/", response_model=EmployeeTable)
def create_employee(employee: EmployeeBase, current_user: UserTable = Depends(get_current_user), session: Session = Depends(get_session)):
    if employee.farm_id != current_user.farm_id:
        raise HTTPException(status_code=403, detail="Not authorized for this farm")
    db_employee = EmployeeTable.from_orm(employee)
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
    
    # AI Analysis for Maintenance
    recommendation = analyze_vehicle_diagnostic(diagnostic)
    if recommendation:
        recommendation.farm_id = vehicle.farm_id
        session.add(recommendation)
        session.commit()
        
    return {"status": "success"}

# --- Basic CRUD for other models omitted for brevity but should follow the same pattern ---
@app.get("/")
def read_root():
    return {"message": "Welcome to AgroManager API"}
