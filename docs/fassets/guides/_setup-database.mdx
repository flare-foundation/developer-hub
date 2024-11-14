### Setting up Database for FAssets Agent

To proceed with this process, you must set up a database, either [MySQL](#setting-up-mysql-database) or [PostgreSQL](#setting-up-postgresql-database).

#### Setting up MySQL Database

You have two options to set up a MySQL database: using Docker (preferred) or installing it manually.

**Setting up MySQL Database with Docker**

1. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Create a `docker-compose.yml` file in your directory, add the following lines, and change the value of `VerySafePassword` according to your security standards:
    ```docker
    services:
      mysql:
        image: mysql:8.0
      environment:
        MYSQL_ROOT_PASSWORD: 'root'
        MYSQL_DATABASE: 'fasset_bots'
        MYSQL_USER: 'fassetbot'
        MYSQL_PASSWORD: 'my1beta2password3'
      volumes:
        - ./data:/var/lib/mysql
        - ./init.mysql.sql:/docker-entrypoint-initdb.d/init.mysql.sql
      ports:
        - "3306:3306"
      healthcheck:
        test: ['CMD', 'mysqladmin', 'ping', '-h', '127.0.0.1', '-u', 'root', '-p$MYSQL_ROOT_PASSWORD']
        timeout: 20s
        retries: 10

    volumes:
      mysql_data:
    ```
3. Create a file named `init.mysql.sql` in the same directory, add the following lines, and change the value of `VerySafePassword` according to your security standards:
   ```sql
   CREATE USER IF NOT EXISTS 'fassetbot'@'%' IDENTIFIED BY 'my1beta2password3';
   GRANT ALL PRIVILEGES ON *.* TO 'fassetbot'@'%' WITH GRANT OPTION;
   GRANT ALL PRIVILEGES ON fasset_bots.* TO 'fassetbot'@'%' WITH GRANT OPTION;
   ```
4. Start the MySQL server as a Docker container by running `docker-compose up -d`. After the MySQL database is started, it will continue to run in the background every time you run the agent.
5. In the `secrets.json` file, add this block to the list to set the database `user` and `password`, and change the value of `password` to the same password you have been using.
    ```
    "database": {
        "user": "fassetbot",
        "password": "my1beta2password3"
    }
    ```

**Setting up MySQL Database Manually**

To install the MySQL database manually, refer to the official [MySQL documentation](https://dev.mysql.com/doc/).

The MySQL database connection parameters are listed in the file as the value for the variable `FASSET_BOT_CONFIG` in the `.env` file.

Create a new user in MySQL that will be used by the `fasset-bots` to connect to the database. In this example, we will create a user with the username `fassetbot` and password `VerySafePassword`, which you must replace with a secure value.

!!! warning
	You only need to create the user in the database and grant privileges to that user. Do not create the database.

1. Open your terminal or command prompt and login to MySQL database using the `mysql` command with the appropriate credentials:

2. Create a new user `fassetbot` in MySQL database using the "CREATE USER" command with the password "VerySafePassword":
     
    ```sql
    CREATE USER 'fassetbot'@'localhost' IDENTIFIED BY 'VerySafePassword';
    ```

3. Grant all privileges on all databases to the user by using the `GRANT` statement:
    
    ```sql
    GRANT ALL PRIVILEGES ON *.* TO 'fassetbot'@'localhost' WITH GRANT OPTION;
    ```

4. **Grant Privileges:**
    After creating the user, you need to grant appropriate privileges to the user. Use the `GRANT` statement to give permissions to the user. For example, to grant all privileges on the `fasset_bots` database:
     ```sql
     GRANT ALL PRIVILEGES ON fasset_bots.* TO 'fassetbot'@'localhost' WITH GRANT OPTION;
     ```

5. Exit the MySQL database prompt by typing:
    
    ```bash
    exit;
    ```

#### Setting up PostgreSQL Database

To set up a PostgreSQL database, you have two options: using Docker (preferred) or installing it manually.

**Setting up PostgreSQL Database with Docker**

1. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Create a `docker-compose.yml` file in your directory, add the following lines, and change the value of `VerySafePassword` according to your security standards:
    ```docker
    services:
      postgres:
        image: postgres:15
        container_name: postgres_db
        environment:
          POSTGRES_USER: fassetbot
          POSTGRES_PASSWORD: my1beta2password3
          POSTGRES_DB: fasset_bots
        ports:
          - "5432:5432"
        volumes:
          - pgdata:/var/lib/postgresql/data
          - ./init.postgresql.sql:/docker-entrypoint-initdb.d/init.postgresql.sql
        healthcheck:
          test: ["CMD-SHELL", "pg_isready -U $POSTGRES_USER -d $POSTGRES_DB -h 127.0.0.1"]
          timeout: 20s
          retries: 10

    volumes:
      pgdata:
    ```

3. Start the PostgreSQL server as a Docker container by running `docker-compose up -d`. After the PostgreSQL database is started, it will continue to run in the background every time you run the agent.
4. In the `secrets.json` file, add this block to the list to set the database `user` and `password`, and change the value of `password` to the same password you have been using.
    ```
    "database": {
        "user": "fassetbot",
        "password": "my1beta2password3"
    }
    ```
5. Modify the `FASSET_BOT_CONFIG variable` in the `.env` file located in the root of the repository.
   ```
   FASSET_BOT_CONFIG="./packages/fasset-bots-core/run-config/coston-bot-postgresql.json"
   ```

**Setting up PostgreSQL Database Manually**

To install the PostgreSQL database manually, refer to the official [PostgreSQL documentation](https://www.postgresql.org/docs/current/index.html).

You can find PostgreSQL database connection parameters in the file listed as the value for the variable `FASSET_BOT_CONFIG` in the `.env` file.

Create a new user in PostgreSQL that will be used by the `fasset-bots` to connect to the database. In this example, we will create a user with the username `fassetbot` and password `VerySafePassword`, which you must replace with a secure value.

!!! warning
	You only need to create the user in the database and grant privileges to that user. Do not create the database.

1. Open your terminal or command prompt and login to PostgreSQL database using the `psql` command with the appropriate credentials.

2. Create a new user `fassetbot` in the PostgreSQL database command with the password "VerySafePassword" and grant the superuser privileges:
     
    ```pgsql
    CREATE ROLE fassetbot WITH SUPERUSER LOGIN PASSWORD 'VerySafePassword';
    ```

3. Exit the PostgreSQL database prompt by typing:
    
    ```bash
    exit;
    ```

4. Modify the `FASSET_BOT_CONFIG variable` in the `.env` file located in the root of the repository.
   ```
   FASSET_BOT_CONFIG="./packages/fasset-bots-core/run-config/coston-bot-postgresql.json"
   ```