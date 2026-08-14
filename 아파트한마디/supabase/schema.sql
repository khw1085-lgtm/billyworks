create extension if not exists postgis;

create table if not exists public.apartments (
  id text primary key,
  name text not null,
  address text not null default '',
  region text not null default '',
  latitude double precision not null,
  longitude double precision not null,
  location geography(point, 4326) generated always as (st_setsrid(st_makepoint(longitude, latitude), 4326)::geography) stored,
  household_count integer not null default 0,
  source text not null default 'k-apt',
  source_updated_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists apartments_location_gix on public.apartments using gist (location);
create index if not exists apartments_name_idx on public.apartments using gin (to_tsvector('simple', name || ' ' || address));

create or replace function public.apartments_in_bounds(
  south double precision,
  west double precision,
  north double precision,
  east double precision,
  result_limit integer default 2000
)
returns setof public.apartments
language sql stable
as $$
  select * from public.apartments
  where latitude between south and north
    and longitude between west and east
  limit least(result_limit, 2000);
$$;
