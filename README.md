# 📅 DocGuía Calendar

<div align="center">

![DocGuía Calendar](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF?logo=vite)

Sistema de gestión de citas médicas con reconocimiento de voz en español

[Demo en Vivo](https://docguia-calendar.vercel.app/) 

</div>

---

## 🎯 Características Principales

- 🎤 **Reconocimiento de voz** - Crea citas usando comandos de voz en español
- 📅 **Calendario interactivo** - Vista semanal con navegación intuitiva
- 🧠 **Parsing inteligente** - Extrae automáticamente paciente, doctor, fecha, hora y motivo
- ⚠️ **Detección de conflictos** - Evita citas duplicadas en el mismo horario
- ✏️ **Edición completa** - Modifica cualquier campo de las citas existentes
- 💾 **Persistencia local** - Guarda las citas en LocalStorage
- 📱 **Diseño responsive** - Optimizado para desktop y móvil
- 🎨 **UI profesional** - Interfaz moderna con Tailwind CSS

---

## 🚀 Demo

**🌐 Producción:** [https://docguia-calendar.vercel.app/]

### Comandos de voz de ejemplo:
```
"Cita para María con el doctor García mañana a las 3pm por motivo de dolor de cabeza"
"Agendar a Pedro con la doctora López el viernes a las 10 motivo control de presión"
"Cita para Ana el martes a las 2 porque tiene fiebre"
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3.1** 
- **TypeScript 5.3.3** 
- **Vite 5.1.0** 

### Gestión de Estado
- **Zustand 4.5.0** 
- **TanStack Query 5.20.0** 

### UI/UX
- **Tailwind CSS 3.4.1** - Estilos utility-first
- **Radix UI** - Componentes accesibles
- **Framer Motion 11.0.5** - Animaciones
- **Lucide React** - Iconos

### Formularios y Validación
- **React Hook Form 7.50.0** - Gestión de formularios
- **Zod 3.22.4** - Validación de schemas

### Utilidades
- **date-fns 3.3.1** - Manipulación de fechas
- **chrono-node 2.7.4** - Parsing de fechas en lenguaje natural
- **clsx + tailwind-merge** - Utilidades de clases CSS

### Reconocimiento de Voz
- **Web Speech API** - Reconocimiento de voz nativo del navegador

---

## 📦 Instalación

### Requisitos previos

- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/EdgMon92/docguia-calendar.git
cd docguia-calendar
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

---

## 🎮 Uso

### Crear cita por voz

1. Haz clic en **"Agendar Cita"**
2. Presiona el **botón del micrófono**
3. Permite el acceso al micrófono
4. Di el comando de voz (ver ejemplos arriba)
5. Revisa los datos extraídos
6. Confirma la cita

### Editar cita

1. Haz clic en cualquier cita del calendario
2. Haz clic en **"Editar"**
3. Modifica los campos necesarios
4. Guarda los cambios

### Eliminar cita

1. Haz clic en la cita
2. Haz clic en **"Eliminar"**
3. Confirma la acción

---

## 📁 Estructura del Proyecto
```
docguia-calendar/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes base (button, dialog, etc)
│   │   ├── layout/          # Layout y navegación
│   │   ├── calendar/        # Componentes del calendario
│   │   ├── voice/           # Componentes de reconocimiento de voz
│   │   └── forms/           # Formularios
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Lógica de negocio
│   │   ├── appointments/    # Gestión de citas
│   │   ├── voice/           # Procesamiento de voz
│   │   └── storage/         # LocalStorage adapter
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript types
│   ├── lib/                 # Utilidades
│   ├── config/              # Configuración
│   ├── pages/               # Páginas
│   ├── App.tsx              # Componente raíz
│   └── main.tsx             # Entry point
├── public/                  # Assets estáticos
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🧪 Comandos Disponibles
```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Build
npm run build        # Compila para producción
npm run preview      # Preview del build de producción

# Linting (si configurado)
npm run lint         # Ejecuta ESLint
```

---

## 🎤 Reconocimiento de Voz

### Requisitos

- ✅ Navegador con soporte Web Speech API (Chrome, Edge)
- ✅ Conexión HTTPS (o localhost)
- ✅ Permisos de micrófono habilitados

### Navegadores soportados

| Navegador | Soporte |
|-----------|---------|
| Chrome | ✅ Completo |
| Edge | ✅ Completo |
| Firefox | ⚠️ Limitado |
| Safari | ❌ Sin soporte |

### Campos que se extraen automáticamente

- 👤 **Paciente** - Nombre del paciente
- 👨‍⚕️ **Doctor** - Nombre del doctor (opcional)
- 📅 **Fecha** - Reconoce: "mañana", "el lunes", "el viernes", etc.
- 🕐 **Hora** - Reconoce: "a las 3pm", "10 de la mañana", etc.
- ⏱️ **Duración** - Por defecto 30 minutos
- 📋 **Motivo** - Razón de la consulta

---

## 🚀 Deploy

### Deploy en Vercel (Recomendado)

1. **Push a GitHub**
```bash
git push origin main
```

2. **Importar en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Import repository
   - Deploy automático ✨

### Variables de entorno

No se requieren variables de entorno para el funcionamiento básico.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un [issue](https://github.com/EdgMon92/docguia-calendar/issues) con:

- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Navegador y versión

---
## 👨‍💻 Autor

**Edgar Montoya**

- GitHub: [@EdgMon92](https://github.com/EdgMon92)
- LinkedIn: [Edgar Montoya](https://www.linkedin.com/in/edgar-montoya-697b3316a/)

---

## 🙏 Agradecimientos

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

<div align="center">

⭐ Si te gustó este proyecto, dale una estrella en GitHub ⭐

**[⬆ Volver arriba](#-docguía-calendar)**

</div>