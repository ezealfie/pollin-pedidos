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

-- Crear función para actualizar updated_at automáticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Crear triggers para actualizar updated_at
create trigger update_users_updated_at before update on users
    for each row execute function update_updated_at_column();

create trigger update_products_updated_at before update on products
    for each row execute function update_updated_at_column();

create trigger update_orders_updated_at before update on orders
    for each row execute function update_updated_at_column();

-- Insertar algunos productos de ejemplo
insert into products (name, description, price, category, image_url) values
('Pizza Margherita', 'Clásica pizza italiana con tomate, mozzarella fresca y albahaca', 2500.00, 'Pizzas', '🍕'),
('Hamburguesa Clásica', 'Jugosa hamburguesa de carne 100% vacuna con lechuga, tomate, cebolla y nuestra salsa especial', 1800.00, 'Hamburguesas', '🍔'),
('Ensalada César', 'Fresca ensalada con lechuga romana, crutones, parmesano y aderezo césar casero', 1200.00, 'Ensaladas', '🥗'),
('Pasta Carbonara', 'Deliciosa pasta con salsa carbonara, panceta, huevo y queso parmesano', 2200.00, 'Pastas', '🍝'),
('Sushi Roll', 'Roll de sushi fresco con salmón, aguacate y arroz', 3000.00, 'Sushi', '🍣'),
('Tacos Mexicanos', 'Auténticos tacos mexicanos con carne marinada, cebolla, cilantro y salsa picante', 1500.00, 'Mexicana', '🌮');

-- Verificar que todo se creó correctamente
select 'Base de datos configurada correctamente' as status;
select count(*) as total_users from users;
select count(*) as total_products from products;
