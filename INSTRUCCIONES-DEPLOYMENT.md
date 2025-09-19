# 🚀 Guía de Deployment - Pollin Pedidos

Esta guía te ayudará a desplegar Pollin Pedidos en Vercel paso a paso.

## 📋 Prerrequisitos

1. **Cuenta de GitHub** (gratuita)
2. **Cuenta de Vercel** (gratuita)
3. **Cuenta de Supabase** (gratuita)
4. **Node.js 18+** instalado localmente

## 🗄️ Paso 1: Configurar Supabase

### 1.1 Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Elige tu organización
5. Nombra tu proyecto: `pollin-pedidos`
6. Crea una contraseña segura para la base de datos
7. Selecciona una región cercana a ti
8. Haz clic en "Create new project"

### 1.2 Configurar la base de datos
1. Una vez que el proyecto esté listo, ve a la pestaña "SQL Editor"
2. Copia y pega el contenido del archivo `database-setup.sql`
3. Ejecuta el script haciendo clic en "Run"
4. Verifica que se hayan creado las tablas correctamente

### 1.3 Obtener las credenciales
1. Ve a la pestaña "Settings" > "API"
2. Copia los siguientes valores:
   - **Project URL** (SUPABASE_URL)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - ⚠️ **IMPORTANTE**: Usa la service_role key, NO la anon key

## 📁 Paso 2: Preparar el código

### 2.1 Subir a GitHub
1. Crea un nuevo repositorio en GitHub llamado `pollin-pedidos`
2. En tu terminal local, navega a la carpeta del proyecto:
   ```bash
   cd pollin-pedidos
   ```
3. Inicializa git y sube el código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Pollin Pedidos"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/pollin-pedidos.git
   git push -u origin main
   ```

## 🚀 Paso 3: Desplegar en Vercel

### 3.1 Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta o inicia sesión con GitHub
3. Haz clic en "New Project"
4. Importa tu repositorio `pollin-pedidos`
5. Vercel detectará automáticamente que es un proyecto Next.js

### 3.2 Configurar variables de entorno
1. En la pantalla de configuración del proyecto, ve a "Environment Variables"
2. Agrega las siguientes variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `SUPABASE_URL` | Tu Project URL de Supabase | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | Tu service_role key de Supabase | Production, Preview, Development |

3. Haz clic en "Save" para cada variable

### 3.3 Deploy
1. Haz clic en "Deploy"
2. Espera a que Vercel construya y despliegue tu aplicación
3. Una vez completado, obtendrás una URL como: `https://pollin-pedidos-xxx.vercel.app`

## ✅ Paso 4: Verificar el deployment

### 4.1 Probar la aplicación
1. Visita la URL de tu aplicación
2. Verifica que la página de inicio se carga correctamente
3. Prueba el endpoint de salud: `https://tu-app.vercel.app/api/health`
4. Debería devolver: `{"status":"ok","message":"Pollin Pedidos API is running"}`

### 4.2 Probar el login
1. Ve a `/login` en tu aplicación
2. Usa las credenciales:
   - **Usuario**: admin
   - **Contraseña**: pollin123
3. Deberías ser redirigido al dashboard admin

## 🔧 Paso 5: Configuración adicional (Opcional)

### 5.1 Dominio personalizado
1. En el dashboard de Vercel, ve a "Settings" > "Domains"
2. Agrega tu dominio personalizado si lo tienes
3. Configura los registros DNS según las instrucciones

### 5.2 Variables de entorno adicionales
Si necesitas agregar más variables de entorno:
1. Ve a "Settings" > "Environment Variables"
2. Agrega las nuevas variables
3. Haz un nuevo deploy para que tomen efecto

## 🐛 Solución de problemas

### Error: "Invalid API key"
- Verifica que estés usando la `service_role` key, no la `anon` key
- Asegúrate de que las variables de entorno estén configuradas correctamente

### Error: "Database connection failed"
- Verifica que la URL de Supabase sea correcta
- Asegúrate de que el proyecto de Supabase esté activo

### Error: "User not found" en login
- Verifica que hayas ejecutado el script `database-setup.sql`
- Confirma que el usuario `admin` existe en la tabla `users`

### La aplicación no se actualiza después de cambios
- Los cambios en el código se despliegan automáticamente
- Si no ves los cambios, espera unos minutos y refresca la página
- Verifica que hayas hecho push de los cambios a GitHub

## 📊 Monitoreo

### Logs de Vercel
1. Ve a la pestaña "Functions" en tu dashboard de Vercel
2. Puedes ver los logs de las API routes
3. Útil para debuggear problemas

### Analytics de Supabase
1. En tu dashboard de Supabase, ve a "Logs"
2. Puedes monitorear las consultas a la base de datos
3. Verifica que las consultas se estén ejecutando correctamente

## 🔄 Actualizaciones futuras

Para actualizar tu aplicación:
1. Haz cambios en tu código local
2. Haz commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push origin main
   ```
3. Vercel detectará automáticamente los cambios y hará un nuevo deploy

## 📞 Soporte

Si tienes problemas con el deployment:
1. Revisa los logs en Vercel
2. Verifica las variables de entorno
3. Confirma que Supabase esté funcionando
4. Consulta la documentación de [Vercel](https://vercel.com/docs) y [Supabase](https://supabase.com/docs)

---

¡Felicitaciones! 🎉 Tu aplicación Pollin Pedidos debería estar funcionando en Vercel.
