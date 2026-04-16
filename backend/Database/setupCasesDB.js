import { getConnection } from "./Db_connect.js";

export const setupCasesDB = async () => {
  const db = getConnection();
  await db.query(`USE ${process.env.DB_NAME}`);

  await db.query(`
    CREATE TABLE IF NOT EXISTS cases (
      case_id INT AUTO_INCREMENT PRIMARY KEY,
      patient_name VARCHAR(100) NOT NULL,
      age INT NOT NULL,
      gender ENUM('Male', 'Female', 'Other') NOT NULL,
      injury_name VARCHAR(100) NOT NULL,
      injury_details TEXT,
      mobile VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Cases table ready");
};