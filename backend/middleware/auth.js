import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token tidak ada" });

  const token = authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "rahasia_super_admin"
    );

    req.user = decoded; // simpan data user dari JWT
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid" });
  }
};

// Middleware untuk membatasi akses berdasarkan role
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Unauthorized" });

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    next();
  };
};
