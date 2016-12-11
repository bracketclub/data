DB_NAME="tweetyourbracket"
SQL_FILE="tweetyourbracket"

dropdb --if-exists $DB_NAME && psql -d postgres -c "DROP ROLE IF EXISTS $DB_NAME"
psql -d postgres -c "CREATE ROLE $DB_NAME WITH PASSWORD 'password' NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT LOGIN"
createdb $DB_NAME -O $DB_NAME
psql -d $DB_NAME -f sql/$SQL_FILE.sql
