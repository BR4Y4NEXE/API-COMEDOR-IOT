# PetCare Monitor (API_PetCare) 🐾

Un sistema integral de monitoreo IoT construido con Next.js para cuidar a tus mascotas a distancia. Este proyecto sirve como un Dashboard web y una API Backend que interactúa con hardware IoT (por ejemplo, un ESP32) equipado con sensores y actuadores para garantizar el bienestar de la mascota.

![Modern UI Preview](https://img.shields.io/badge/UI-Glassmorphism-cyan?style=for-the-badge) ![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css) ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

## ¿De qué se trata?

**PetCare Monitor** es el servidor central para un dispensador de alimento inteligente y un monitor ambiental. Permite a los dueños de mascotas:
- 🌡️ **Monitorear el ambiente:** Ver la temperatura y humedad en tiempo real usando datos de un sensor DHT11.
- 🥘 **Verificar disponibilidad de comida:** Saber si el tazón de comida está lleno o vacío mediante un sensor Infrarrojo.
- ⚙️ **Alimentación remota:** Accionar un motor Servo a distancia para dispensar comida al instante.
- 📊 **Análisis histórico:** Visualizar gráficas de los cambios ambientales y llevar un registro exacto (log) de a qué hora se ha dispersado el alimento.

## ¿Qué problemas resuelve este sistema?

1. **Incertidumbre al salir de casa:** Elimina la preocupación de saber si dejaste suficiente comida. Con solo abrir el dashboard, puedes ver el estado del tazón.
2. **Control Alimenticio:** Mediante el registro de alimentaciones y el control remoto, puedes alimentar a tu mascota estén donde estén, evitando sobrealimentación o desnutrición por olvidos.
3. **Control Ambiental:** Las mascotas (especialmente reptiles, aves pequeñas o cachorros) son sensibles a temperaturas extremas. El monitoreo en tiempo real previene golpes de calor o frío advirtiendo las condiciones actuales.

## 🚀 Innovaciones y Modernización Reciente

Este repositorio ha sido recientemente actualizado y modernizado bajo los más altos estándares de desarrollo:
- **Migración a App Router:** Actualizado de Pages Router a Next.js 15 App Router (`app/`), mejorando el rendimiento y la organización del código.
- **Componentización:** Desacoplamiento de vistas en componentes reusables (`components/`) como `SensorCard`, `HistoryChart` y `LogTable`.
- **UI/UX Premium:** Rediseño utilizando un estilo **Glassmorphism**, paletas de colores oscuras curadas (Slate/Cyan/Emerald) y micro-animaciones fluidas con **Framer Motion**.
- **Seguridad Mejorada:** Se ha migrado toda configuración sensible (Firebase Credentials y API Keys de Hardware) a variables de entorno estandarizadas (`.env.local`), evitando vulnerabilidades públicas.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19, Next.js 15 (App Router), Tailwind V4, Framer Motion, Recharts, Lucide React.
- **Backend (API Routes):** Node.js (via Next.js Route Handlers).
- **Base de Datos:** Firebase / Firestore (Almacenamiento en la nube en tiempo real).
- **Hardware Integrado (Vía API):** ESP32 / Arduino, Sensor DHT11, Sensor Infrarrojo, Motor Servo.

## 💻 Instalación y Configuración Local

Sigue estos pasos para correr el proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/BR4Y4NEXE/API_PetCare.git
   cd API_PetCare
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar el entorno:**
   Copia el archivo de ejemplo y crea tu archivo `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Abre el archivo `.env.local` e introduce tus credenciales de Firebase (`FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`) y tu `NEXT_PUBLIC_API_KEY` para proteger la comunicación con tu hardware.

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador en** [http://localhost:3000](http://localhost:3000) para ver el dashboard.

## 🌐 Endpoints de la API Hardware

El hardware IoT (ESP32) se comunica con este servidor usando los siguientes endpoints situados en `/api`:

- `POST /api/send-dht`: Recibe Temperatura y Humedad.
- `POST /api/send-infrared`: Recibe el estado del plato de comida (Lleno/Vacío).
- `GET /api/servo-status`: Endpoint súper ligero para que el ESP32 sepa si debe girar el motor (`1` = Activar, `0` = Esperar).
- `POST /api/servo-executed`: Confirma al servidor que el motor giró con éxito.

*Nota: Todos los endpoints `POST` requieren que el Hardware envíe un header `x-api-key` válido por seguridad.*

---
*Hecho para el cuidado y cariño de las mascotas mediante tecnología.*
