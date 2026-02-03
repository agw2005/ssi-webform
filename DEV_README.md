# Development Database

The API (`/src/api/index.ts`) entrypoint assumes the following steps have been executed.

1. Crate a MySQL Docker container with the following command.

```bash
docker run --name ssi-webform-mysql -e MYSQL_ROOT_PASSWORD=u101 -p 3333:3306 -d mysql:latest
```

2. Use `docker ps` to list the available containers and take note of the MySQL's container ID.
3. Run `docker exec -it <CONTAINER_ID> sh` to open the shell inside of the container.
4. Run `mysql -p` to enter the mysql shell. The password is`u101` (the user will be `root`).
5. Run the following chain of commands
   1. `create database dev;`.
   2. Run `use dev;`
   3. Run `create table test (first_word text, second_word text);`.
   4. run `insert into test (first_word, second_word) values ("Hello", "world");`
