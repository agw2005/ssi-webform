# Set Up

The following README is for setting-up the development environment of the
SSI-WEBFORM project.

You can visit the repository at `https://github.com/agw2005/ssi-webform`.

The project is a monorepo built using `Deno` as the main runtime, initialized
using `deno init`. The front-end still uses `Deno` but with `package.json`
dependency as to build the `node_modules` necessary to run `vite`.

The following README will show you how to set-up the `Front-end`, `Back-end`,
and `Development Database`.

# Prerequisites

- Development platform : `Windows 11`
- Runtime : `Deno`
- Additional program : `Docker`

_Be sure to install Deno and Docker._

# Front-end

The front-end lives inside the `/client` directory.

It is created using `deno run -A npm:create-vite@latest` using TypeScript, React
Compiler, and Rolldown Vite.

After cloning the project, you should `cd` into `/client` and run
`deno install`.

After that, you can run `deno task dev` to start the development server of the
front-end.

# Back-end

The back-end lives inside the `/server` directory.

It is created using `deno init`.

After cloning the project, you should be able to run `deno task dev` and the
back-end server will be up and running.

The default port 8000 is used, but you can use a different port by passing
`{ port : [PORT_OF_YOUR_CHOOSING]}` into the `oakApp.listen()` method.

# Development Database

For testing and development, the project uses a MySQL database running under a
docker container.

The contents of the database will be used by the `/server` as a means to bridge
the front-end and the database.

You might notice that when accessing the routes declared in the back-end, it
leads to an internal server error response. This is because the database doesn't
exist yet. You first need to set it up using the following guide.

1. Crate a MySQL Docker container with the following command.

   ```bash
   docker run --name [CONTAINER_NAME_OF_YOUR_CHOOSING] -e MYSQL_ROOT_PASSWORD=[PASSWORD_OF_YOUR_CHOOSING] -p [PORT_OF_YOUR_CHOOSING]:3306 -d mysql:latest
   ```

2. Use `docker ps` to list the available containers and take note of the MySQL's
   container ID.
3. Copy the SQL dump into the container using
   `docker cp [PATH_TO_SQL_DUMP] [CONTAINER_ID]:/tmp/[SQL_DUMP_NAME].sql`.
4. Run `docker exec -it [CONTAINER_ID] sh` to open the shell inside of the
   container.
5. Run `mysql -p` to enter the mysql shell. The password is the same as when you
   created the container (the user will be `root`).
6. Run `create database dev;`.
7. Exist the mysql shell with `ctrl`+`D`.
8. Run the SQL dump using
   `mysql -uroot -p[DB_PASSWORD] dev < /tmp/[SQL_DUMP_NAME].sql`.

   _Contact Danial to get the sql dump of the testing database._

9. Run the `fix_table.sql` against the database.

After this set-up, you will have a docker container serving MySQL database.
Change the value of `DB_PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and
`DB_NAME` of the `/server/.env` file to match the development database container
that you've created.
