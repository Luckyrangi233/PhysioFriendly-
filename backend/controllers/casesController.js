import { getConnection } from "../Database/Db_connect.js";

// GET all cases (for dashboard cards)
export const getAllCases = async (req, res) => {
  try {
    const db = getConnection();
    const [cases] = await db.query(`
      SELECT case_id, patient_name, injury_name
      FROM cases
      ORDER BY created_at DESC
    `);
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cases", error: err.message });
  }
};

// GET single case full details
export const getCaseById = async (req, res) => {
  try {
    const db = getConnection();
    const [rows] = await db.query(
      "SELECT * FROM cases WHERE case_id = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Case not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch case", error: err.message });
  }
};

// POST create case
export const createCase = async (req, res) => {
  const { patient_name, age, gender, injury_name, injury_details, mobile, address } = req.body;

  if (!patient_name || !age || !gender || !injury_name) {
    return res.status(400).json({ message: "patient_name, age, gender and injury_name are required" });
  }

  try {
    const db = getConnection();
    const [result] = await db.query(
      `INSERT INTO cases (patient_name, age, gender, injury_name, injury_details, mobile, address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patient_name, age, gender, injury_name, injury_details || null, mobile || null, address || null]
    );
    res.status(201).json({ message: "Case created", case_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Failed to create case", error: err.message });
  }
};
// DELETE case
export const deleteCase = async (req, res) => {
  try {
    const db = getConnection();
    await db.query("DELETE FROM cases WHERE case_id = ?", [req.params.id]);
    res.json({ message: "Case deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete case", error: err.message });
  }
};
// GET cases by patient name
export const getCasesByPatientName = async (req, res) => {
  try {
    const db = getConnection()
    const [cases] = await db.query(
      `SELECT case_id, patient_name, injury_name 
       FROM cases 
       WHERE patient_name LIKE ?
       ORDER BY created_at DESC`,
      [`%${req.query.name}%`]
    )
    res.json(cases)
  } catch (err) {
    res.status(500).json({ message: "Failed to search cases", error: err.message })
  }
}

// GET cases by injury name
export const getCasesByInjury = async (req, res) => {
  try {
    const db = getConnection()
    const [cases] = await db.query(
      `SELECT case_id, patient_name, injury_name 
       FROM cases 
       WHERE injury_name LIKE ?
       ORDER BY created_at DESC`,
      [`%${req.query.injury}%`]
    )
    res.json(cases)
  } catch (err) {
    res.status(500).json({ message: "Failed to search cases", error: err.message })
  }
}