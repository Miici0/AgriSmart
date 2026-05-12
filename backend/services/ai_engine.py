from typing import Optional
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import RecommendationTable, SensorReadingTable, VehicleDiagnosticTable

def analyze_sensor_reading(reading: SensorReadingTable, sensor_type: str) -> Optional[RecommendationTable]:
    if sensor_type == "moisture":
        if reading.value < 30:
            return RecommendationTable(
                title="Irrigation Recommended",
                description=f"Moisture level is low ({reading.value}%). Irrigation is recommended for the associated field.",
                type="treatment"
            )
        elif reading.value > 80:
            return RecommendationTable(
                title="Check Drainage",
                description=f"Moisture level is very high ({reading.value}%). Please check field drainage.",
                type="treatment"
            )
    elif sensor_type == "temperature":
        if reading.value > 35:
            return RecommendationTable(
                title="Heat Alert",
                description=f"High temperature detected ({reading.value}°C). Consider protective measures.",
                type="treatment"
            )
    return None

def analyze_vehicle_diagnostic(diagnostic: VehicleDiagnosticTable) -> Optional[RecommendationTable]:
    if diagnostic.error_code:
        return RecommendationTable(
            title="Vehicle Maintenance Required",
            description=f"Diagnostic error detected: {diagnostic.error_code}. Please inspect the vehicle.",
            type="maintenance"
        )
    
    if diagnostic.operating_hours > 500 and diagnostic.operating_hours % 500 < 10:
        return RecommendationTable(
            title="Scheduled Maintenance",
            description=f"Vehicle has reached {diagnostic.operating_hours} operating hours. Scheduled service is recommended.",
            type="maintenance"
        )
    
    return None
