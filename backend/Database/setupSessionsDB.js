import { getConnection } from "./Db_connect.js";

export const setupSessionsDB = async () => {
  const db = getConnection();
  await db.query(`USE ${process.env.DB_NAME}`);

  await db.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id INT AUTO_INCREMENT PRIMARY KEY,
      case_id INT NOT NULL,
      session_number INT NOT NULL,
      session_date DATE NOT NULL,
      exercises TEXT,
      therapy TEXT,
      medication TEXT,
      remarks TEXT,
      duration_minutes INT,
      pain INT,
      mobility INT,
      strength INT,
      motor_control INT,
      FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
    )
  `);

  console.log("Sessions table ready");
};