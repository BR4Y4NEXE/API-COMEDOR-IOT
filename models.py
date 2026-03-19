from pydantic import BaseModel
from typing import Optional


class DeviceCreate(BaseModel):
    name: str
    location: str
    device_id: str


class Device(BaseModel):
    id: str
    device_id: str
    name: str
    location: str
    created_at: str
    updated_at: str


class DeviceResponse(Device):
    is_online: bool
    last_reading: Optional["SensorReading"] = None


class SensorReading(BaseModel):
    id: str
    device_id: str
    temperature: float
    humidity: float
    timestamp: str
    ir_detected: Optional[bool] = None


class ReadingCreate(BaseModel):
    temperature: float
    humidity: float
    timestamp: Optional[str] = None
    ir_detected: Optional[bool] = None


class ReadingResponse(BaseModel):
    success: bool
    message: str
    servo_trigger: bool = False


DeviceResponse.model_rebuild()
