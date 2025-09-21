-- Script para crear tablas de ingredientes y combos
-- Ejecutar este script en la consola SQL de Supabase

-- Crear tabla de ingredientes
create table if not exists ingredients (
  id serial primary key,
  nombre text not null,
  precio decimal(10,2) not null,
  emoji text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear tabla de combos
create table if not exists combos (
  id serial primary key,
  nombre text not null,
  descripcion text not null,
  precio decimal(10,2) not null,
  ingredientes jsonb not null, -- Array de IDs de ingredientes
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear tabla de precios de milanesas
create table if not exists milanesa_prices (
  id serial primary key,
  tipo text not null unique, -- 'pollo' o 'carne'
  precio decimal(10,2) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear tabla de precios de papas fritas
create table if not exists papas_fritas_price (
  id serial primary key,
  precio decimal(10,2) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insertar ingredientes por defecto
insert into ingredients (nombre, precio, emoji) values
('Lechuga', 50, '🥬'),
('Tomate', 50, '🍅'),
('Cebolla', 50, '🧅'),
('Huevo frito', 100, '🍳'),
('Jamón', 150, '🍖'),
('Queso', 100, '🧀'),
('Mayonesa', 30, '🥄'),
('Mostaza', 30, '🟡'),
('Ketchup', 30, '🍅'),
('Pepinillos', 80, '🥒')
on conflict do nothing;

-- Insertar precios de milanesas por defecto
insert into milanesa_prices (tipo, precio) values
('pollo', 600),
('carne', 700)
on conflict (tipo) do update set precio = excluded.precio;

-- Insertar precio de papas fritas por defecto
insert into papas_fritas_price (precio) values (400)
on conflict do nothing;

-- Insertar combos por defecto
insert into combos (nombre, descripcion, precio, ingredientes) values
('Sándwich Completo', 'Milanesa + lechuga + tomate + cebolla + huevo + jamón + queso + mayonesa', 1200, '[1,2,3,4,5,6,7]'),
('Sándwich Clásico', 'Milanesa + lechuga + tomate + cebolla + mayonesa', 800, '[1,2,3,7]'),
('Sándwich Especial', 'Milanesa + lechuga + tomate + huevo + queso + mayonesa + mostaza', 1000, '[1,2,4,6,7,8]')
on conflict do nothing;

-- Habilitar RLS en las nuevas tablas
alter table ingredients enable row level security;
alter table combos enable row level security;
alter table milanesa_prices enable row level security;
alter table papas_fritas_price enable row level security;

-- Políticas para ingredientes (lectura pública, escritura solo service_role)
create policy "Enable read access for all users" on ingredients
for select using (true);

create policy "Enable all operations for service_role" on ingredients
for all using (auth.role() = 'service_role');

-- Políticas para combos (lectura pública, escritura solo service_role)
create policy "Enable read access for all users" on combos
for select using (true);

create policy "Enable all operations for service_role" on combos
for all using (auth.role() = 'service_role');

-- Políticas para precios de milanesas (lectura pública, escritura solo service_role)
create policy "Enable read access for all users" on milanesa_prices
for select using (true);

create policy "Enable all operations for service_role" on milanesa_prices
for all using (auth.role() = 'service_role');

-- Políticas para precio de papas fritas (lectura pública, escritura solo service_role)
create policy "Enable read access for all users" on papas_fritas_price
for select using (true);

create policy "Enable all operations for service_role" on papas_fritas_price
for all using (auth.role() = 'service_role');

-- Verificar que todo se creó correctamente
select 'Tablas de ingredientes y combos creadas correctamente' as status;
select count(*) as total_ingredients from ingredients;
select count(*) as total_combos from combos;
select count(*) as total_milanesa_prices from milanesa_prices;
select count(*) as total_papas_fritas_price from papas_fritas_price;
