No Servidor Principal (10.1.1.1):

docker compose -f docker-compose.primary.yml up -d

No Servidor Secundário (10.1.1.2) — só depois do principal estar de pé:

docker compose -f docker-compose.secondary.yml up -d

No Servidor Principal, verifique se o standby está conectado:

docker exec presenca-db psql -U postgresql -c "SELECT * FROM pg_stat_replication;"

No Servidor Secundário, verifique o lag de replicação:

docker exec presenca-db-standby psql -U postgresql -c "SELECT now() - pg_last_xact_replay_timestamp() AS replication_lag;"

💡 Dica de segurança: Troque repl_password por uma senha forte antes de ir para produção, e considere usar um arquivo .env separado para as credenciais de replicação.