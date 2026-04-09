# 1. Promove o standby para primary
docker exec presenca-db-standby pg_ctl promote -D /var/lib/postgresql/data

# 2. Sobe a aplicação (que estava parada)
docker compose -f docker-compose.secondary.yml --profile failover up -d app