# WEBFORM Online

**WEBFORM Online** is full-stack web application made by Foxconn Technology Indonesia (formerly Sharp Semiconductor Indonesia) for validating, recording, and archiving usage of a given section's budget (purchasing request). It is built on [Deno](https://github.com/denoland/deno) for the GNU/Linux environment.

# Development

To start the development environment, you will need Docker installed on your system.

Additionally, you need a snapshot of the `webformdb` database as a `.bak` file, rename it to `backup.bak`, and place it inside the `/database` workspace. Please contact the staff at the MIS section of FTI if you need a snapshot.

Run the command `docker compose up --build -d` inside the root of the project.

Omit the `--build` flag if you've already run it once.

To stop the dev environment, run `docker compose down` in the same location.

# Deployment

Deployment of the application already assumes that the `webformdb` database already exists on port 1433.

Additionally, you should configure `/server/.env` file before proceeding.

1. Inside the `/client` workspace, run `deno task build`.
2. Copy the contents of the `/client/dist` directory to the production environment's `/var/www/webform` directory.
3. Inside the `/server` workspace, run `deno task build`.
4. Copy the compiled server executable into a location of your choice.
5. Make a new folder called `/logs` in the same location where the server executable lives.
6. Inside the `/logs` directory, create an empty file called `server.log`.
7. In the same directory as the server's executable, copy the `/public` directory from the `/server` workspace to that directory.
8. Configure a systemd service to run that executable in the background. Check out this [systemd manual](https://www.freedesktop.org/software/systemd/man/systemd.service.html) for more information.
9. Configure nginx to map the front-end (port 4173) to the url `intranet.ssi-asiasharp.com/webform` and the back-end (port 8000) to the url `intranet.ssi-asiasharp.com/webform-api`. Check out the `/nginx.conf` file for an example of this.
10. Opening `intranet.ssi-asiasharp.com/webform` in the browser should display the homepage of the application without any errors.

# Commit Guidelines

This project uses the form of type `[PURPOSE]([SCOPE]):[MESSAGE]`

`[PURPOSE]` refers to the purpose of the commit, the content is according to the
table below.

| PURPOSE-value | Description                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| feat          | When changes adds a new feature or functionality                                                        |
| fix           | When changes fixes a bug in the codebase                                                                |
| chore         | When changes doesn't affect code logic, such as updating dependencies, CI/CD configurations, or scripts |
| refactor      | When changes improve the code without changing functionality                                            |
| docs          | When the changes updates the documentation                                                              |

`[SCOPE]` indicates the name of the file(s) that is changed.

`[MESSAGE]` is a short summary plus occasionally a long explanation or reference
to other relative issues

```bash
# Good commit message following conventional guidelines
git commit -m "feat(auth.js): add JWT-based authentication"
git commit -m "fix(login.jsx): resolve race condition in login flow"
```

## 2. Atomic & Focused

Do not mix several independent changes in one commit.

```bash
# Good commit
git commit -m "Add user authentication"

# Bad commit
git commit -m "Add user authentication AND update UI styles"
```

## 3. Descriptive Message

What the commit does and why the change was made.

```bash
# Good commit message
git commit -m "Fix Correct null pointer exception in user login"
# Bad commit message
git commit -m "Fix bug"
```
