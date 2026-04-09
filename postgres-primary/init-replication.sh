#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'repl_password';
  SELECT pg_create_physical_replication_slot('standby_slot');
EOSQL

# Libera conexão do IP do servidor secundário no pg_hba.conf
echo "host replication replicator 10.1.1.2/32 md5" >> /var/lib/postgresql/data/pg_hba.conf