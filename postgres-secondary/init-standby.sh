#!/bin/bash
set -e

PGDATA=/var/lib/postgresql/data

# Se já foi inicializado antes, só sobe normalmente
if [ -f "$PGDATA/standby.signal" ] || [ -f "$PGDATA/PG_VERSION" ]; then
  echo ">>> Standby já inicializado, subindo postgres..."
  exec docker-entrypoint.sh postgres \
    -c hot_standby=on \
    -c listen_addresses='*'
fi

echo ">>> Primeira inicialização: copiando dados do primário..."

rm -rf "$PGDATA"/*

PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup \
  -h "$PRIMARY_HOST" \
  -p "$PRIMARY_PORT" \
  -U "$REPLICATION_USER" \
  -D "$PGDATA" \
  -Fp -Xs -P -R \
  --slot=standby_slot

# Arquivo que indica ao postgres que é standby (replica em tempo real)
touch "$PGDATA/standby.signal"

# Configura a conexão com o primário
cat >> "$PGDATA/postgresql.auto.conf" <<EOF
primary_conninfo = 'host=${PRIMARY_HOST} port=${PRIMARY_PORT} user=${REPLICATION_USER} password=${REPLICATION_PASSWORD}'
primary_slot_name = 'standby_slot'
EOF

echo ">>> Standby configurado! Subindo postgres..."
exec docker-entrypoint.sh postgres \
  -c hot_standby=on \
  -c listen_addresses='*'