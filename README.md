## 🚀 Project setup

### 1️⃣ Install dependencies

Run the following command to install all required dependencies:

```bash
$ npm install
```

### 2️⃣ Configure .env

Add the following variables to the .env file in the project root:

```bash
# 📦 Database config
DB_HOST=your-db-host
DB_PORT=your-db-port
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

# 🔑 JWT Configuration
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# 🌍 Application Environment
NODE_ENV=development  # Choose "development", "staging", or "production" to set the desired mode, but by default it is set to "development"

# 📡 MQTT Configuration
MQTT_BROKER_URL=mqtt://your-broker-url:your-broker-port
MQTT_BROKER_USERNAME=your-broker-username
MQTT_BROKER_PASSWORD=your-broker-password
```

### 3️⃣ Create database

Create a postgreSQL database according to name in DB_NAME.

### 4️⃣ Run migrations

After configuring the database, run the following command to run the migration:

```bash
$ npx typeorm-ts-node-commonjs migration:run -d src/database/database.config.ts
```

### 5️⃣ Run scripts to add Admin user

If you don't want to add a Admin user, you can skip this step.

To add a Admin user to the database, add the following variables in .env:

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
```

Remember the password must be at least 6 characters and a maximum of 20.

You can only enter one password for all users and the default username is `admin` and the password is `admin123`.

Then run the following command:

```bash
$ npx ts-node src/database/scripts/addAdmin.ts
```

### 6️⃣ Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
