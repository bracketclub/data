#!/usr/bin/env bash

DB_NAME=$1
OUT=${2:-${DB_NAME}}

dropdb --if-exists $DB_NAME
psql -d postgres -c "DROP ROLE IF EXISTS \"$DB_NAME\""
psql -d postgres -c "CREATE ROLE \"${DB_NAME}\" WITH PASSWORD 'password' NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT LOGIN"
createdb $DB_NAME -O $DB_NAME
psql -d $DB_NAME -f sql/$OUT.sql
