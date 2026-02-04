import jwt, { decode } from "jsonwebtoken";
export const authMiddleWare = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
        res.status(404).json({ message: "Token Not Found" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
//# sourceMappingURL=middleware.js.map