import { getConnection } from "../Database/Db_connect.js";

// GET all sessions for a case (summary list)
export const getAllSessions = async (req, res) => {
  try {
    const db = getConnection();
    const [sessions] = await db.query(
      `SELECT session_id, session_number, session_date
       FROM sessions WHERE case_id = ?
       ORDER BY session_number ASC`,
      [req.params.case_id]
    );
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sessions", error: err.message });
  }
};

// GET single session full details
export const getSessionById = async (req, res) => {
  try {
    const db = getConnection();
    const [rows] = await db.query(
      "SELECT * FROM sessions WHERE session_id = ? AND case_id = ?",
      [req.params.session_id, req.params.case_id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Session not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch session", error: err.message });
  }
};

// GET graph data for a case (all metrics vs session date)
export const getGraphData = async (req, res) => {
  try {
    const db = getConnection();
    const [rows] = await db.query(
      `SELECT session_number, session_date, pain, mobility, strength, motor_control
       FROM sessions
       WHERE case_id = ?
       ORDER BY session_number ASC`,
      [req.params.case_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch graph data", error: err.message });
  }
};

// POST add new session
export const addSession = async (req, res) => {
  const {
    session_date, exercises, therapy, medication,
    remarks, duration_minutes,
    pain, mobility, strength, motor_control
  } = req.body;
  const case_id = req.params.case_id;

  if (!session_date) {
    return res.status(400).json({ message: "session_date is required" });
  }

  try {
    const db = getConnection();

    // Auto-calculate next session number
    const [[{ count }]] = await db.query(
      "SELECT COUNT(*) as count FROM sessions WHERE case_id = ?",
      [case_id]
    );
    const session_number = count + 1;

    const [result] = await db.query(
      `INSERT INTO sessions
        (case_id, session_number, session_date, exercises, therapy, medication,
         remarks, duration_minutes, pain, mobility, strength, motor_control)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        case_id, session_number, session_date,
        exercises || null, therapy || null, medication || null,
        remarks || null, duration_minutes || null,
        pain || null, mobility || null, strength || null, motor_control || null
      ]
    );

    res.status(201).json({ message: "Session added", session_id: result.insertId, session_number });
  } catch (err) {
    res.status(500).json({ message: "Failed to add session", error: err.message });
  }
};

// DELETE session
export const deleteSession = async (req, res) => {
  try {
    const db = getConnection();
    await db.query("DELETE FROM sessions WHERE session_id = ?", [req.params.session_id]);
    res.json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete session", error: err.message });
  }
};