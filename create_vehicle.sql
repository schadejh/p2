-- Remove any existing database and user.
DROP DATABASE IF EXISTS vehicle;
DROP USER IF EXISTS vehicleApp@localhost;

-- Create Unforget database and user. Ensure Unicode is fully supported.
CREATE DATABASE vehicle CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER vehicleApp@localhost IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON vehicle.* TO vehicleApp@localhost;
