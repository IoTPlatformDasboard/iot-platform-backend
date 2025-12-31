import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';
import { UserRole, User } from '../entities/user.entity';
import AppDataSource from '../database.config';

const addAdmin = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  // Get data from environment variables
  const adminUsername = process.env.ADMIN_USERNAME ?? 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  // Insert data into the database
  await userRepository.save({
    id: uuidv4(),
    username: adminUsername,
    password: hashedPassword,
    role: UserRole.ADMIN,
  });
  console.log('Successfully added Admin user to the database.');
};

AppDataSource.initialize()
  .then(async (dataSource) => {
    console.log('Data Source has been initialized!');
    await addAdmin(dataSource);
    await dataSource.destroy();
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
