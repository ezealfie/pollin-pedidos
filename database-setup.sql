-- Script de configuración de la base de datos para Pollin Pedidos
-- Ejecutar este script en la consola SQL de Supabase

-- Habilitar extensión para encriptación de contraseñas
create extension if not exists pgcrypto;

-- Crear tabla de usuarios
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insertar usuario administrador por defecto
-- Usuario: admin, Contraseña: pollin123
insert into users (username, password_hash)
values ('admin', crypt('pollin123', gen_salt('bf')))
on conflict (username) do update
set password_hash = excluded.password_hash;

-- Crear tabla de productos (opcional para futuras expansiones)
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price decimal(10,2) not null,
  category text,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear tabla de pedidos
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  delivery_time text not null,
  payment_method text not null,
  total_amount decimal(10,2) not null,
  status text default 'pending',
  notes text,
  items jsonb not null, -- Almacenar los items del pedido como JSON
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear tabla de items de pedido (opcional para futuras expansiones)
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity integer not null,
  unit_price decimal(10,2) not null,
  total_price decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear índices para mejorar el rendimiento
create index if not exists idx_users_username on users(username);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_is_active on products(is_active);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at);
create index if not exists idx_order_items_order_id on order_items(order_id);

-- Nota: Los triggers de updated_at se pueden agregar después si es necesario
-- Por ahora los omitimos para evitar errores de compatibilidad

-- Insertar algunos productos de ejemplo para rotisería
insert into products (name, description, price, category, image_url) values
('Sándwich Completo', 'Milanesa + lechuga + tomate + cebolla + huevo + jamón + queso + mayonesa', 1200.00, 'Sándwiches', '🥪'),
('Sándwich Clásico', 'Milanesa + lechuga + tomate + cebolla + mayonesa', 800.00, 'Sándwiches', '🥪'),
('Sándwich Especial', 'Milanesa + lechuga + tomate + huevo + queso + mayonesa + mostaza', 1000.00, 'Sándwiches', '🥪'),
('Milanesa de Pollo', 'Milanesa de pollo empanada, base para sándwich personalizado', 600.00, 'Milanesas', '🐔'),
('Milanesa de Carne', 'Milanesa de carne empanada, base para sándwich personalizado', 700.00, 'Milanesas', '🥩'),
('Papas Fritas', 'Papas fritas caseras, crujientes y doradas', 400.00, 'Acompañamientos', '🍟'),
('Ensalada Mixta', 'Lechuga, tomate, cebolla y aderezo a elección', 300.00, 'Ensaladas', '🥗'),
('Bebida Gaseosa', 'Coca Cola, Sprite, Fanta o similar', 200.00, 'Bebidas', '🥤');

-- Configurar políticas de seguridad (RLS)
-- Habilitar RLS en las tablas
alter table users enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Políticas para la tabla users (solo service_role puede acceder)
create policy "Enable all operations for service_role" on users
for all using (auth.role() = 'service_role');

-- Políticas para la tabla products (lectura pública, escritura solo service_role)
create policy "Enable read access for all users" on products
for select using (true);

create policy "Enable all operations for service_role" on products
for all using (auth.role() = 'service_role');

-- Políticas para la tabla orders (lectura y escritura solo service_role)
create policy "Enable all operations for service_role" on orders
for all using (auth.role() = 'service_role');

-- Políticas para la tabla order_items (lectura y escritura solo service_role)
create policy "Enable all operations for service_role" on order_items
for all using (auth.role() = 'service_role');

-- Verificar que todo se creó correctamente
select 'Base de datos configurada correctamente' as status;
select count(*) as total_users from users;
select count(*) as total_products from products;
