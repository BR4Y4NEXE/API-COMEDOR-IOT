# API COMEDOR IOT

API REST para la gestion de dispositivos IoT de alimentadores de mascotas.

## Tecnologias

- **FastAPI** - Framework web asincrono
- **Uvicorn** - Servidor ASGI
- **Pydantic** - Validacion de datos

## Instalacion

```bash
pip install -r requirements.txt
```

## Ejecucion

```bash
uvicorn main:app --reload
```

El servidor se ejecutara en `http://localhost:8000`

## Documentacion Interactiva

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Dispositivos

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/devices` | Listar todos los dispositivos |
| GET | `/api/devices/{device_id}` | Obtener un dispositivo por ID |
| POST | `/api/devices` | Crear un nuevo dispositivo |
| DELETE | `/api/devices/{device_id}` | Eliminar un dispositivo |

### Lecturas de Sensores

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/devices/{device_id}/readings` | Obtener lecturas de un dispositivo |
| POST | `/api/devices/{device_id}/readings` | Registrar una nueva lectura |

### Sistema

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/health` | Verificar estado del servidor |

## Modelos de Datos

### DeviceCreate
```json
{
  "name": "string",
  "location": "string",
  "device_id": "string"
}
```

### DeviceResponse
```json
{
  "id": "string",
  "device_id": "string",
  "name": "string",
  "location": "string",
  "is_online": "boolean",
  "last_reading": "SensorReading | null",
  "created_at": "string",
  "updated_at": "string"
}
```

### ReadingCreate
```json
{
  "temperature": "number",
  "humidity": "number",
  "timestamp": "string (opcional)",
  "ir_detected": "boolean (opcional)"
}
```

### SensorReading
```json
{
  "id": "string",
  "device_id": "string",
  "temperature": "number",
  "humidity": "number",
  "timestamp": "string",
  "ir_detected": "boolean | null"
}
```

## Estados del Dispositivo

Un dispositivo se considera **online** si ha enviado al menos una lectura en los ultimos **5 minutos**.

## CORS

La API permite peticiones desde cualquier origen (`*`). Configurar segun necesidades en produccion.
