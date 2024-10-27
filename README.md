# Booking Service Frontend

## Descripción

Esta es una aplicación frontend construida con SvelteKit que proporciona interfaces para gestionar reservas. Las funcionalidades incluyen:

- Hacer una nueva reserva.
- Modificar una reserva existente.
- Cancelar una reserva.
- Ver todas las reservas, con opciones de filtro por fecha, servicio y cliente.

La aplicación implementa un manejo adecuado de errores en el frontend, asegurando que los usuarios reciban mensajes claros y útiles en caso de errores o fallos en la comunicación con el backend.

## Requisitos

- Node.js (versión 16 o superior)
- npm (versión 7 o superior)

## Instalación

Clona el repositorio y navega al directorio del proyecto:

```bash
git clone https://github.com/tu-usuario/BookingServiceFrontend.git
cd BookingServiceFrontend
```

Instala las dependencias:

```bash
npm install
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev

# o para iniciar el servidor y abrir la aplicación en una nueva pestaña del navegador
npm run dev -- --open
```

## Construcción

Para crear una versión de producción de tu aplicación:

```bash
npm run build
```

Puedes previsualizar la construcción de producción con:

```bash
npm run preview
```

> Para desplegar tu aplicación, puede que necesites instalar un adaptador para tu entorno de destino.