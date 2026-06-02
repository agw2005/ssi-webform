# PRISM

**PRISM** (Purchasing Request Invocation SysteM), previously called `WEBFORM Online`, is a full-stack web application made by Foxconn Technology
Indonesia (formerly Sharp Semiconductor Indonesia) under the `Redevelopment of Purchasing Request Online System` project for creating, recording, validating,
and archiving the usage of a given division's budget (purchasing request) from the company. It is
built on [Deno](https://github.com/denoland/deno) for the GNU/Linux environment, with [`jsr:@oak/oak`](https://jsr.io/@oak/oak) as the backend server and [`ReactJS`](https://react.dev/) as the client-side library.

# Development

To start the development environment, you will need Docker installed on your
system.

You will also need a snapshot of the `Purchasing Request Online System` database as a `.bak` file,
rename it to `backup.bak`, and place it inside the `/database` workspace. Please
contact the staff of the MIS section of FTI (Foxconn Technology
Indonesia) if you need a snapshot.

Run the command `docker compose up --build -d` inside the root of the project.

Omit the `--build` flag if you've already run it once.

To stop the dev environment, run `docker compose down -v` in the same location. Omit the `-v` flag if you want any changes to the database to persist for the next time the container starts.

# Deployment

1. Configure a `.env` in the root directory of the project accordingly as per `.env.example` file.
2. Run `deno task package` in the root directory of the project.
3. Move the contents of `/build` to the `/var/www/prism` directory.
4. Configure a systemd service to run that executable in the background according to `/nginx.conf`. Change the configuration according to your needs (i.e ports, server name, etc)
5. Opening the `/prism` path of the machine in the browser should display the homepage of the application without any errors.

# API

Below are the APIs of the backend, expected to use the `/prism-api` path.

| Method | Endpoint                     | Description                                                                                                                                                                                                                                                                                                                                   |
| ------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/section/names`             | Section names and its respective ID                                                                                                                                                                                                                                                                                                           |
| GET    | `/section/users`             | User `NameUser`s and their respective section name                                                                                                                                                                                                                                                                                            |
| GET    | `/section/users`             | User `NameUser`s and their respective ID                                                                                                                                                                                                                                                                                                      |
| GET    | `/section/auth`              | User IDs and their respective `UserName`, `Password`, `NameUser`, and `NRP`. Used for authentication purposes.                                                                                                                                                                                                                                |
| GET    | `/section/[NRP]`             | A single user's `NameUser` and ID according to the `[NRP]`                                                                                                                                                                                                                                                                                    |
| GET    | `/budget/fileresources`      | The name of all available file resources                                                                                                                                                                                                                                                                                                      |
| GET    | `/budget/years`              | The available years (YYYY)                                                                                                                                                                                                                                                                                                                    |
| GET    | `/budget/periods`            | The available periods (YYYY[halves])                                                                                                                                                                                                                                                                                                          |
| GET    | `/budget/nature`             | The available natures based on the `period`, `fileresource`, `dept`, `costcenter`                                                                                                                                                                                                                                                             |
| GET    | `/budget/balance`            | A single balance according to the parameter `costcenter`, `period`,`nature`, `fileresource`, `dept`.                                                                                                                                                                                                                                          |
| GET    | `/budget/`                   | All of the available budgets information (period, month index, period year (YYYY), file resource, department, cost center, nature, description, budget, and balance) according to the parameter `year` (YYYY) and `fileresource`                                                                                                              |
| GET    | `/budget/report`             | All of the available budgets information (period, file resource, resource name, department, department group, cost center, nature, description, budget, and balance) according to the parameter `periode` (YYYY[halves][month-index]) and `fileresource`                                                                                      |
| GET    | `/budget/departments`        | All of the available departments information (id, description, and name) according to the parameter `periode` (YYYY[halves][month-index]) and `fileresource`                                                                                                                                                                                  |
| GET    | `/budget/costcenters`        | All of the available cost centers (id and description) based on the parameter `period` (YYYY[halves][month-index]), `fileresource`, and `dept` (department id)                                                                                                                                                                                |
| GET    | `/trace/requests`            | All of the available purchasing requests based on the parameter `requestorsectionid`, `currentsupervisorid`, `status`, `startdate`, `enddate`, `search`, `page`, and `pagination`. The parameters are optional.                                                                                                                               |
| GET    | `/trace/requests/count`      | Returns the count of all purchasing requests based on the parameter `requestorsectionid`, `currentsupervisorid`, `status`, `startdate`, `enddate`, and `search`. The parameters are optional.                                                                                                                                                 |
| GET    | `/trace/request/[Trace ID]`  | Returns the information of a single purchasing request based on the `[Trace ID]`                                                                                                                                                                                                                                                              |
| GET    | `/trace/approve`             | All of the available purchasing requests based on the parameter `status`, `startdate`, `enddate`, `search`, `page`, `pagination`, and `currentsupervisorid`. All of the parameters are optional except for `currentsupervisorid`.                                                                                                             |
| GET    | `/trace/approve/count`       | Returns the count of all purchasing requests based on the parameter `status`, `startdate`, `enddate`, `search`, and `nrp`. The parameters are optional except for `nrp`.                                                                                                                                                                      |
| GET    | `/frmprd/request/[Trace ID]` | All of the items information of a single purchasing request based on the given `[Trace ID]`                                                                                                                                                                                                                                                   |
| GET    | `/uploadfile/[Trace ID]`     | All of the attachments of a single purchasing request based on the given `[Trace ID]`                                                                                                                                                                                                                                                         |
| GET    | `/traced/[Trace ID]`         | All of the approval path of a single purchasing request based on the given `[Trace ID]`                                                                                                                                                                                                                                                       |
| GET    | `/frmprh/`                   | All of the purchasing request that correlates to a budget's usage (for the `/usage` url) according to the parameter `nature`, `costcenter`, `startdate`, and `enddate`                                                                                                                                                                        |
| POST   | `/jwt/request`               | Generates a JWT to be given to the requestor based on the payload `{ nrp: string, password: string }`. This will update the `LastLogin` of the user.                                                                                                                                                                                          |
| GET    | `/jwt/verify`                | Verifies whether a given JWT is valid, returning the `JWT issuer`, `expiration date`, `username`, `user id`, and `nrp`.                                                                                                                                                                                                                       |
| PATCH  | `/approve/remarks`           | Updates the remarks of a single purchasing request according to the payload `{ noForm: string, newRemarks: string }`. This operation will update the table `Trace` and `frm_PR_H` as they both contains a remarks column.                                                                                                                     |
| PATCH  | `/approve/reject`            | Reject a single purchasing request as a supervisor, closing that request.                                                                                                                                                                                                                                                                     |
| PATCH  | `/approve/accept`            | Approve a single purchasing request as a supervisor, forwarding the approval path to the next supervisor. If there is no next supervisor, the request will be closed and the server will prints out the information regarding the purchasing request. The contents of the information is a `FinalApprovalPayload` and can be seen in `mod.ts` |
| POST   | `/approve/attach`            | Attach one or multiple files as a supervisor to a purchasing request, if any additional documents need to be tied to a specific purchasing request.                                                                                                                                                                                           |
| GET    | `/admin/template`            | Sends a spreadsheet file, containing the template to upload budgets as an administrator.                                                                                                                                                                                                                                                      |
| PUT    | `/admin/budget`              | Updates the budget according to the `CostCenter`, `Nature`, `Periode`, `IDSection`, `FileResource`, and the new `budget` value. If no budget is detected, a new budget row is created, otherwise it will replace the current budget with the new value.                                                                                       |
| DELETE | `/admin/[Trace ID]`          | Delete an instance of a purchasing request according to its `[Trace ID]`.                                                                                                                                                                                                                                                                     |
| PATCH  | `/admin/ratedollartemp`      | Updates the values of the currency value for all rows in `ratedollartemp`.                                                                                                                                                                                                                                                                    |
| GET    | `/`                          | Check if the server is running. Will return `Healthy` if it is                                                                                                                                                                                                                                                                                |
| POST   | `/submit`                    | Creates a new purchasing request instance according the incoming payload.                                                                                                                                                                                                                                                                     |
| GET    | `/forex`                     | The name and value of the available currencies (including USD), against USD, from the `RateDollar` table.                                                                                                                                                                                                                                     |
| GET    | `/forextemp`                 | The name and value of the available currencies (including USD), against USD, from the `RateDollarTemp` table.                                                                                                                                                                                                                                 |
| GET    | `/attachment/[File Name]`    | Sends a file back to the user according to the file correlating to the `[File Name]`. Front-end logic : if the API fails, it will fetch from the `.env` fallback API (old WEBFORM Online app).                                                                                                                                                |

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
