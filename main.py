from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import uuid

from models import (
    Device, DeviceCreate, DeviceResponse, SensorReading,
    ReadingCreate, ReadingResponse, OnlineStatus
)

app = FastAPI(title="PetCare IoT API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

devices_db: dict[str, Device] = {}
readings_db: dict[str, list[SensorReading]] = {}

ONLINE_THRESHOLD_MINUTES = 5


def is_device_online(device_id: str) -> bool:
    if device_id not in readings_db or not readings_db[device_id]:
        return False
    last_reading = max(readings_db[device_id], key=lambda r: r.timestamp)
    last_time = datetime.fromisoformat(last_reading.timestamp.replace("Z", "+00:00"))
    now = datetime.now(last_time.tzinfo)
    return (now - last_time) <= timedelta(minutes=ONLINE_THRESHOLD_MINUTES)


def get_last_reading(device_id: str) -> SensorReading | None:
    if device_id not in readings_db or not readings_db[device_id]:
        return None
    return max(readings_db[device_id], key=lambda r: r.timestamp)


def to_device_response(device: Device) -> DeviceResponse:
    return DeviceResponse(
        id=device.id,
        device_id=device.device_id,
        name=device.name,
        location=device.location,
        is_online=is_device_online(device.device_id),
        last_reading=get_last_reading(device.device_id),
        created_at=device.created_at,
        updated_at=device.updated_at
    )


@app.get("/api/devices", response_model=list[DeviceResponse])
async def get_devices():
    return [to_device_response(d) for d in devices_db.values()]


@app.get("/api/devices/{device_id}", response_model=DeviceResponse)
async def get_device(device_id: str):
    if device_id not in devices_db:
        for d in devices_db.values():
            if d.device_id == device_id:
                return to_device_response(d)
        raise HTTPException(status_code=404, detail="Device not found")
    return to_device_response(devices_db[device_id])


@app.post("/api/devices", response_model=DeviceResponse, status_code=201)
async def create_device(data: DeviceCreate):
    for d in devices_db.values():
        if d.device_id == data.device_id:
            raise HTTPException(status_code=400, detail="Device ID already exists")

    now = datetime.now().isoformat() + "Z"
    device = Device(
        id=str(uuid.uuid4()),
        device_id=data.device_id,
        name=data.name,
        location=data.location,
        created_at=now,
        updated_at=now
    )
    devices_db[device.id] = device
    readings_db[data.device_id] = []
    return to_device_response(device)


@app.delete("/api/devices/{device_id}")
async def delete_device(device_id: str):
    for d in devices_db.values():
        if d.device_id == device_id:
            del devices_db[d.id]
            if device_id in readings_db:
                del readings_db[device_id]
            return {"message": "Device deleted"}
    raise HTTPException(status_code=404, detail="Device not found")


@app.get("/api/devices/{device_id}/readings", response_model=list[SensorReading])
async def get_readings(device_id: str, hours: int = 24):
    if device_id not in readings_db:
        for d in devices_db.values():
            if d.device_id == device_id:
                return []
        raise HTTPException(status_code=404, detail="Device not found")

    cutoff = datetime.now() - timedelta(hours=hours)
    filtered = []
    for r in readings_db[device_id]:
        r_time = datetime.fromisoformat(r.timestamp.replace("Z", "+00:00"))
        if r_time >= cutoff:
            filtered.append(r)
    return sorted(filtered, key=lambda r: r.timestamp)


@app.post("/api/devices/{device_id}/readings", response_model=ReadingResponse)
async def create_reading(device_id: str, data: ReadingCreate):
    for d in devices_db.values():
        if d.device_id == device_id:
            reading = SensorReading(
                id=str(uuid.uuid4()),
                device_id=device_id,
                temperature=data.temperature,
                humidity=data.humidity,
                timestamp=data.timestamp or datetime.now().isoformat() + "Z"
            )
            if "ir_detected" in data.model_fields_set():
                reading.ir_detected = data.ir_detected
            readings_db[device_id].append(reading)
            return ReadingResponse(
                success=True,
                message="Reading recorded",
                servo_trigger=False
            )

    raise HTTPException(status_code=404, detail="Device not found")


@app.get("/health")
async def health_check():
    return {"status": "ok"}


from fastapi import HTTPException
