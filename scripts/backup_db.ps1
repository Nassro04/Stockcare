cmd /c "docker exec -e PGPASSWORD=admin123 stockcare-db pg_dump -U admin -d stockcare --clean --if-exists > db_init.sql"
echo "Backup created in db_init.sql"
