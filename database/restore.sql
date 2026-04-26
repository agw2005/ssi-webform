RESTORE DATABASE [webformdb-testing] 
FROM DISK = '/var/opt/mssql/backup/backup.bak' 
WITH MOVE 'webformDB' TO '/var/opt/mssql/data/webformDB.mdf', 
MOVE 'webformDB_log' TO '/var/opt/mssql/data/webformDB_log.ldf';
GO