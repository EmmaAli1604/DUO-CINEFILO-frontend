# DUO-CINEFILO-frontend

Aplicación frontend desarrollada con **React**, **TypeScript** y **Vite**, diseñada para consumir el API del backend y ofrecer una experiencia moderna de navegación, búsqueda y visualización de películas.

Este proyecto forma parte del sistema multimodal **Dúo Cinéfilo**, que integra chatbot y navegación intuitiva.

> El backend del proyecto se encuentra en un repositorio independiente.


---

## Equipo de Desarrollo (HIKARU)

- **Emma Alicia Jiménez Sánchez**  
- **Alejandro Jacome Delgado**  
- **Juan Carlos López Ramírez**  
- **Karla Alejandra Camacho Gutiérrez**

---

## Tecnologías Utilizadas

* **React 18**
* **TypeScript**
* **Vite**
* **TailwindCSS**
* **Lucide React Icons**
* **REST API (Fetch)**
* **Context API / useState**

---

## Estructura del Proyecto

```
src/
├── assets/             # Imágenes, logos
├── components/         # Componentes principales del frontend
│   ├── Home.tsx
│   ├── MovieCard.tsx
│   ├── MovieCarousel.tsx
│   ├── MovieDetail.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── UserProfile.tsx
├── App.tsx             # Manejo de rutas internas
├── main.tsx            # Renderizado raíz
└── styles/             # Estilos globales / Tailwind
```



---

## Instrucciones de Instalación y Ejecución

### 1️. **Clonar el repositorio**

```bash
git clone https://github.com/EmmaAli1604/DUO-CINEFILO-frontend.git
cd frontend
```

### 2️. **Instalar dependencias**

```bash
npm install
```

### 3️. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz:

```
VITE_API_URL=http://127.0.0.1:8000
```

> Esto permite que el frontend redirija sus peticiones correctamente al backend.

### 4️. **Ejecutar el proyecto**

```bash
npm run dev
```

La aplicación se abrirá normalmente en:

 `http://localhost:5173/`

---

#  **Principales pantallas**

##  **Home**

* Carga de películas desde el backend
* Carrusel dinámico
* Búsqueda por nombre
* Filtros por género

##  **Login / Register**

* Formularios validados
* Conexión al backend vía POST

##  **Movie Detail**

* Muestra información extendida de la película
* Permite comprar la película o ver horarios

##  **Perfil del Usuario**

* Datos generales
* Opciones de cierre de sesión

---

#  **Conexión con el Backend**

El frontend consulta al backend mediante `fetch()`:

```ts
fetch(`${import.meta.env.VITE_API_URL}/peliculas/`)
```

Este endpoint debe responder desde el servidor Django:

```
http://127.0.0.1:8000/peliculas/
```

---

#  **Características principales**

 Diseño moderno con Tailwind
 Compatibilidad móvil
 Consumo dinámico de API
 Componentes reutilizables
 Navegación interna controlada por estado
 Chatbot integrado (pronto documentado)

---

#  **Comandos disponibles**

| Comando           | Descripción                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Inicia el proyecto en modo desarrollo   |
| `npm run build`   | Crea versión optimizada para producción |
| `npm run preview` | Previsualiza el build                   |

---

#  **Licencia**

Este proyecto está desarrollado únicamente con fines educativos.

---
