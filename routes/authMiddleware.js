import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).redirect('/'); 
        //return res.status(403).json({ error: 'Access denied, no token provided' });
    }

    try {


        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.redirect('/');
            }
            req.user = user; // Almacenar el usuario en la solicitud
            next(); // Continuar a la siguiente middleware o ruta
        });


    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

export default authMiddleware;
