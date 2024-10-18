import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).redirect('/'); 
        //return res.status(403).json({ error: 'Access denied, no token provided' });
    }

    try {
        const privateKey = "test";
        const decoded = jwt.verify(token, privateKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

export default authMiddleware;
