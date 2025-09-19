# 🗄️ Configuración Completa de Supabase - Pollin Pedidos

Esta guía te ayudará a configurar Supabase paso a paso para que tu aplicación funcione correctamente.

## 📋 Paso 1: Crear Proyecto en Supabase

### 1.1 Registrarse en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una cuenta con GitHub, Google o email
4. Confirma tu email si es necesario

### 1.2 Crear Nuevo Proyecto
1. En el dashboard, haz clic en "New Project"
2. Completa los datos:
   - **Name**: `pollin-pedidos`
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Elige la más cercana a ti
3. Haz clic en "Create new project"
4. Espera 2-3 minutos a que se configure

## 🗃️ Paso 2: Configurar la Base de Datos

### 2.1 Ejecutar el Script SQL
1. En tu proyecto de Supabase, ve a la pestaña **"SQL Editor"**
2. Haz clic en **"New query"**
3. Copia y pega **TODO** el contenido del archivo `database-setup.sql`
4. Haz clic en **"Run"** (botón verde)
5. Deberías ver el mensaje: "Base de datos configurada correctamente"

### 2.2 Verificar las Tablas
1. Ve a la pestaña **"Table Editor"**
2. Deberías ver estas tablas:
   - ✅ `users` (con el usuario admin)
   - ✅ `products` (con productos de ejemplo)
   - ✅ `orders` (vacía, se llenará con pedidos)
   - ✅ `order_items` (para futuras expansiones)

## 🔑 Paso 3: Obtener las Credenciales

### 3.1 Acceder a la Configuración de API
1. Ve a la pestaña **"Settings"** (icono de engranaje)
2. Haz clic en **"API"** en el menú lateral

### 3.2 Copiar las Credenciales
Necesitas estos dos valores:

```
SUPABASE_URL=https://tu-proyecto-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: 
- Usa la **service_role** key, NO la **anon** key
- La service_role key es más larga y comienza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

## 🚀 Paso 4: Configurar en Vercel

### 4.1 Ir a Variables de Entorno
1. En tu proyecto de Vercel, ve a **"Settings"**
2. Haz clic en **"Environment Variables"**

### 4.2 Agregar las Variables
Agrega estas dos variables:

| Name | Value | Environment |
|------|-------|-------------|
| `SUPABASE_URL` | `https://tu-proyecto-id.supabase.co` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |

### 4.3 Hacer Nuevo Deploy
1. Ve a la pestaña **"Deployments"**
2. Haz clic en **"Redeploy"** en el último deployment
3. O haz un pequeño cambio en el código y haz push a GitHub

## ✅ Paso 5: Verificar que Funcione

### 5.1 Probar la API de Salud
Visita: `https://tu-app.vercel.app/api/health`
Debería devolver:
```json
{
  "status": "ok",
  "message": "Pollin Pedidos API is running"
}
```

### 5.2 Probar el Login
1. Ve a `https://tu-app.vercel.app/login`
2. Usa las credenciales:
   - **Usuario**: `admin`
   - **Contraseña**: `pollin123`
3. Deberías ser redirigido al dashboard admin

### 5.3 Probar un Pedido
1. Ve a la página principal
2. Agrega un combo al carrito
3. Completa el formulario
4. Envía el pedido
5. Ve al admin y verifica que aparezca el pedido

## 🔧 Paso 6: Configuración Adicional

### 6.1 Políticas de Seguridad (RLS)
Por defecto, Supabase tiene Row Level Security habilitado. Para que funcione correctamente:

1. Ve a **"Authentication" > "Policies"**
2. Para la tabla `orders`, agrega esta política:

```sql
-- Permitir lectura y escritura para service_role
CREATE POLICY "Enable all operations for service_role" ON orders
FOR ALL USING (auth.role() = 'service_role');
```

### 6.2 Configurar CORS (si es necesario)
Si tienes problemas de CORS, ve a **"Settings" > "API"** y agrega tu dominio de Vercel a los orígenes permitidos.

## 🐛 Solución de Problemas Comunes

### Error: "Invalid API key"
- ✅ Verifica que estés usando la `service_role` key
- ✅ Asegúrate de que no haya espacios extra en las variables
- ✅ Confirma que las variables estén en todos los entornos (Production, Preview, Development)

### Error: "Database connection failed"
- ✅ Verifica que la URL de Supabase sea correcta
- ✅ Confirma que el proyecto de Supabase esté activo
- ✅ Revisa que hayas ejecutado el script SQL

### Error: "User not found" en login
- ✅ Ejecuta nuevamente el script `database-setup.sql`
- ✅ Verifica en "Table Editor" que existe el usuario `admin`
- ✅ Confirma que la contraseña sea `pollin123`

### Los pedidos no se guardan
- ✅ Verifica que la tabla `orders` existe
- ✅ Confirma que el campo `items` es de tipo `jsonb`
- ✅ Revisa los logs de Vercel en "Functions"

### Error 500 en las APIs
- ✅ Revisa los logs de Vercel
- ✅ Verifica que las variables de entorno estén configuradas
- ✅ Confirma que Supabase esté funcionando

## 📊 Monitoreo y Logs

### Logs de Vercel
1. Ve a **"Functions"** en tu dashboard de Vercel
2. Haz clic en cualquier función para ver los logs
3. Útil para debuggear errores de API

### Logs de Supabase
1. En Supabase, ve a **"Logs"**
2. Puedes ver las consultas SQL que se ejecutan
3. Verifica que las consultas sean exitosas

### Analytics
1. En Supabase, ve a **"Reports"**
2. Puedes ver estadísticas de uso
3. Monitorea el rendimiento de la base de datos

## 🔄 Mantenimiento

### Backup de la Base de Datos
1. En Supabase, ve a **"Settings" > "Database"**
2. Haz clic en **"Backups"**
3. Los backups automáticos están habilitados por defecto

### Actualizar Contraseña del Admin
Si necesitas cambiar la contraseña del admin:

```sql
UPDATE users 
SET password_hash = crypt('nueva-contraseña', gen_salt('bf'))
WHERE username = 'admin';
```

### Limpiar Pedidos Antiguos
Para limpiar pedidos entregados de más de 30 días:

```sql
DELETE FROM orders 
WHERE status = 'delivered' 
AND created_at < NOW() - INTERVAL '30 days';
```

## 📞 Soporte

Si tienes problemas:
1. Revisa esta guía paso a paso
2. Consulta los logs de Vercel y Supabase
3. Verifica que todas las variables estén configuradas
4. Confirma que el script SQL se ejecutó correctamente

---

¡Con esta configuración tu aplicación Pollin Pedidos debería funcionar perfectamente! 🎉
