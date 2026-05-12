from typing import List, Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

class FarmBase(SQLModel):
    name: str
    location: str

class FarmTable(FarmBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    users: List["UserTable"] = Relationship(back_populates="farm")
    fields: List["FieldTable"] = Relationship(back_populates="farm")
    vehicles: List["VehicleTable"] = Relationship(back_populates="farm")
    employees: List["EmployeeTable"] = Relationship(back_populates="farm")

class UserBase(SQLModel):
    username: str
    role: str = "farmer" # farmer, employee
    language: str = "it"
    farm_id: int = Field(foreign_key="farmtable.id")

class UserTable(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    farm: FarmTable = Relationship(back_populates="users")

class FieldBase(SQLModel):
    name: str
    location: str
    crop_type: str
    farm_id: int = Field(foreign_key="farmtable.id")

class FieldTable(FieldBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    farm: FarmTable = Relationship(back_populates="fields")
    sensors: List["SensorTable"] = Relationship(back_populates="field")

class SensorBase(SQLModel):
    name: str
    type: str # e.g., moisture, temperature
    field_id: int = Field(foreign_key="fieldtable.id")

class SensorTable(SensorBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    field: FieldTable = Relationship(back_populates="sensors")
    readings: List["SensorReadingTable"] = Relationship(back_populates="sensor")

class SensorReadingBase(SQLModel):
    value: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    sensor_id: int = Field(foreign_key="sensortable.id")

class SensorReadingTable(SensorReadingBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sensor: SensorTable = Relationship(back_populates="readings")

class VehicleBase(SQLModel):
    name: str
    model: str
    license_plate: str
    device_id: str = Field(unique=True, index=True)
    farm_id: int = Field(foreign_key="farmtable.id")

class VehicleTable(VehicleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    farm: FarmTable = Relationship(back_populates="vehicles")
    diagnostics: List["VehicleDiagnosticTable"] = Relationship(back_populates="vehicle")

class VehicleDiagnosticBase(SQLModel):
    rpm: Optional[float] = None
    coolant_temp: Optional[float] = None
    speed: Optional[float] = None
    error_code: Optional[str] = None
    operating_hours: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    vehicle_id: int = Field(foreign_key="vehicletable.id")

class VehicleDiagnosticTable(VehicleDiagnosticBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vehicle: VehicleTable = Relationship(back_populates="diagnostics")

class EmployeeBase(SQLModel):
    name: str
    role: str
    language: str = "it"
    certifications: str # e.g., Patenti, Brevetti, Patentini
    farm_id: int = Field(foreign_key="farmtable.id")

class EmployeeTable(EmployeeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    farm: FarmTable = Relationship(back_populates="employees")

class RecommendationBase(SQLModel):
    title: str
    description: str
    type: str # e.g., treatment, maintenance
    status: str = "pending" # pending, completed
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    farm_id: int = Field(foreign_key="farmtable.id")

class RecommendationTable(RecommendationBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
