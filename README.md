# 🍕 Pollin Pedidos

Sistema moderno y eficiente para la gestión de pedidos con una interfaz intuitiva y profesional. Desarrollado con Next.js 14, TailwindCSS y Supabase.

## ✨ Características

- **🎨 Diseño Moderno**: Interfaz atractiva con paleta de colores anaranjada
- **🔐 Autenticación Segura**: Sistema de login con cookies HTTPOnly y hash de contraseñas
- **📱 Responsive**: Diseño adaptativo para todos los dispositivos
- **⚡ Performance**: Construido con Next.js 14 y App Router
- **🗄️ Base de Datos**: Integración con Supabase para persistencia de datos
- **🎯 Dashboard Admin**: Panel de administración completo con sidebar y estadísticas

## 🚀 Tecnologías Utilizadas

- **Framework**: Next.js 14 (App Router)
- **Estilos**: TailwindCSS
- **Base de Datos**: Supabase
- **Autenticación**: bcrypt + cookies HTTPOnly
- **Lenguaje**: TypeScript
- **Deployment**: Vercel

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd pollin-pedidos
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**
   
   Copia el archivo `env.example` y renómbralo a `.env.local`:
   ```bash
   cp env.example .env.local
   ```
   
   Llena las variables con tus datos de Supabase:
   ```env
   SUPABASE_URL=tu-url-de-supabase
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   ```

4. **Configurar la base de datos**
   
   Ejecuta el siguiente SQL en tu consola de Supabase:
   ```sql
   create extension if not exists pgcrypto;

   create table if not exists users (
     id uuid primary key default uuid_generate_v4(),
     username text unique not null,
     password_hash text not null
   );

   insert into users (username, password_hash)
   values ('admin', crypt('pollin123', gen_salt('bf')))
   on conflict (username) do update
   set password_hash = excluded.password_hash;
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

6. **Abrir en el navegador**
   
   Visita [http://localhost:3000](http://localhost:3000)

## 🔑 Credenciales de Prueba

- **Usuario**: admin
- **Contraseña**: pollin123

## 📁 Estructura del Proyecto

```
pollin-pedidos/
├── app/                          # App Router de Next.js 14
│   ├── api/                      # API Routes
│   │   ├── health/              # Endpoint de salud
│   │   ├── login/               # Autenticación
│   │   └── logout/              # Cerrar sesión
│   ├── admin/                   # Panel de administración
│   │   ├── layout.tsx           # Layout del admin
│   │   └── page.tsx             # Dashboard principal
│   ├── login/                   # Página de login
│   │   └── page.tsx
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página de inicio
├── components/                   # Componentes reutilizables
│   ├── AdminHeader.tsx          # Header del admin
│   ├── AdminSidebar.tsx         # Sidebar del admin
│   ├── Footer.tsx               # Footer
│   ├── Header.tsx               # Header principal
│   └── ProductCard.tsx          # Tarjeta de producto
├── lib/                         # Utilidades y configuración
│   ├── auth.ts                  # Funciones de autenticación
│   └── supabase.ts              # Configuración de Supabase
├── public/                      # Archivos estáticos
├── .env.example                 # Variables de entorno de ejemplo
├── next.config.js               # Configuración de Next.js
├── tailwind.config.js           # Configuración de TailwindCSS
├── tsconfig.json                # Configuración de TypeScript
└── vercel.json                  # Configuración de Vercel
```

## 🎨 Paleta de Colores

- **Fondo principal**: `#FDF6F3` (beige muy claro)
- **Primario**: `#EA580C` (naranja fuerte)
- **Primario hover**: `#C2410C` (naranja oscuro)
- **Acento secundario**: `#FBBF24` (amarillo dorado)
- **Texto principal**: `#1F2937` (gris casi negro)
- **Texto secundario**: `#6B7280` (gris medio)
- **Cards/fondos**: `#FFFFFF` (blanco con sombras suaves)

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en modo producción
- `npm run lint` - Ejecutar linter

## 🚀 Deployment en Vercel

1. **Conectar con GitHub**
   - Sube tu código a un repositorio de GitHub
   - Conecta tu repositorio con Vercel

2. **Configurar variables de entorno**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega las variables:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`

3. **Deploy automático**
   - Vercel detectará automáticamente que es un proyecto Next.js
   - El deploy se realizará automáticamente en cada push a la rama principal

## 📱 Funcionalidades

### Página Pública
- ✅ Landing page atractiva con productos de ejemplo
- ✅ Diseño responsive y moderno
- ✅ Sección de contacto
- ✅ Navegación intuitiva

### Panel de Administración
- ✅ Sistema de autenticación seguro
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Sidebar de navegación
- ✅ Gestión de pedidos
- ✅ Gestión de productos
- ✅ Gestión de clientes
- ✅ Sistema de reportes
- ✅ Configuración del sistema

## 🔒 Seguridad

- **Hash de contraseñas**: Utiliza bcrypt para encriptar contraseñas
- **Cookies HTTPOnly**: Las sesiones se manejan con cookies seguras
- **Validación de entrada**: Todas las entradas son validadas
- **Protección de rutas**: Las rutas admin requieren autenticación

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos:

- **Email**: info@pollinpedidos.com
- **Teléfono**: +54 11 1234-5678
- **Dirección**: Buenos Aires, Argentina

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [TailwindCSS](https://tailwindcss.com/) por los estilos
- [Supabase](https://supabase.com/) por la base de datos
- [Vercel](https://vercel.com/) por el hosting

---

**Desarrollado con ❤️ para simplificar la gestión de pedidos**
