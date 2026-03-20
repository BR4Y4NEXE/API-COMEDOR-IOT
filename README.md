# API COMEDOR IOT

API REST para gestionar dispositivos IoT de alimentadores de mascotas. Monitorea temperatura, humedad y detecta si el plato de comida esta lleno o vacio.

---

## Que hace esta API?

Esta API permite:

- **Registrar dispositivos IoT** (alimentadores de mascotas)
- **Recibir lecturas de sensores** (temperatura, humedad)
- **Detectar si hay comida** en el plato (sensor infrarrojo)
- **Saber si un dispositivo esta en linea** (activo en los ultimos 5 minutos)
- **Consultar historial de lecturas** de un dispositivo

---

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| FastAPI | Framework web asincrono |
| Uvicorn | Servidor web |
| Pydantic | Validacion de datos |

---

## Endpoints disponibles

### Salud del servidor

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/health` | Verifica que el servidor este funcionando |

**Respuesta exitosa:**
```json
{
  "status": "ok"
}
```

---

### Dispositivos

#### GET /api/devices
Lista todos los dispositivos registrados.

**Respuesta:**
```json
[
  {
    "id": "uuid-del-dispositivo",
    "device_id": "ESP32-001",
    "name": "Comedero de Max",
    "location": "Sala",
    "is_online": true,
    "last_reading": {
      "id": "uuid-lectura",
      "device_id": "ESP32-001",
      "temperature": 25.5,
      "humidity": 60.2,
      "timestamp": "2025-01-15T10:30:00Z",
      "ir_detected": true
    },
    "created_at": "2025-01-10T08:00:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

---

#### GET /api/devices/{device_id}
Obtiene un dispositivo especifico por su ID.

**Parametros:**
- `device_id` - Identificador unico del dispositivo (ej: "ESP32-001")

**Respuesta:** Objeto del dispositivo (ver arriba)

**Error 404:**
```json
{
  "detail": "Device not found"
}
```

---

#### POST /api/devices
Registra un nuevo dispositivo.

**Cuerpo de la peticion:**
```json
{
  "name": "Comedero de Max",
  "location": "Sala",
  "device_id": "ESP32-001"
}
```

**Respuesta 201:**
```json
{
  "id": "uuid-generado",
  "device_id": "ESP32-001",
  "name": "Comedero de Max",
  "location": "Sala",
  "is_online": false,
  "last_reading": null,
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

**Error 400 (dispositivo ya existe):**
```json
{
  "detail": "Device ID already exists"
}
```

---

#### DELETE /api/devices/{device_id}
Elimina un dispositivo y todas sus lecturas.

**Respuesta:**
```json
{
  "message": "Device deleted"
}
```

---

### Lecturas de Sensores

#### GET /api/devices/{device_id}/readings
Obtiene el historial de lecturas de un dispositivo.

**Parametros de consulta:**
- `hours` (opcional) - Numero de horas hacia atras a consultar. Por defecto: 24

**Respuesta:**
```json
[
  {
    "id": "uuid-lectura",
    "device_id": "ESP32-001",
    "temperature": 25.5,
    "humidity": 60.2,
    "timestamp": "2025-01-15T10:30:00Z",
    "ir_detected": true
  },
  {
    "id": "uuid-lectura-2",
    "device_id": "ESP32-001",
    "temperature": 26.0,
    "humidity": 58.5,
    "timestamp": "2025-01-15T10:00:00Z",
    "ir_detected": false
  }
]
```

---

#### POST /api/devices/{device_id}/readings
Enviar una nueva lectura desde el dispositivo IoT.

**Cuerpo de la peticion:**
```json
{
  "temperature": 25.5,
  "humidity": 60.2,
  "ir_detected": true
}
```

| Campo | Tipo | Obligatorio | Descripcion |
|-------|------|-------------|-------------|
| temperature | float | Si | Temperatura en grados Celsius |
| humidity | float | Si | Humedad en porcentaje (0-100) |
| timestamp | string | No | Fecha y hora ISO. Si no se envia, se usa la hora actual |
| ir_detected | boolean | No | true = hay comida, false = plato vacio |

**Respuesta:**
```json
{
  "success": true,
  "message": "Reading recorded",
  "servo_trigger": false
}
```

---

## Estados de un dispositivo

Un dispositivo puede estar **online** o **offline**:

- **Online**: Ha enviado al menos una lectura en los ultimos 5 minutos
- **Offline**: No ha enviado lecturas en mas de 5 minutos

---

## Instalacion local

1. Clonar el repositorio:
```bash
git clone https://github.com/BR4Y4NEXE/API-COMEDOR-IOT.git
cd API-COMEDOR-IOT
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Ejecutar el servidor:
```bash
uvicorn main:app --reload
```

4. Abrir en el navegador:
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Despliegue en Render

1. Crear cuenta en [render.com](https://render.com)
2. Crear un nuevo **Web Service**
3. Conectar el repositorio de GitHub
4. Configurar:
   - **Runtime**: Python 3.11
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Hacer deploy

---

## Nota sobre persistencia

Esta API usa almacenamiento en memoria (RAM). Los datos se pierden al reiniciar el servidor. Para produccion, considera usar una base de datos como PostgreSQL o SQLite.
