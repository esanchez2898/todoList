import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware function to authenticate requests
const authMiddleware = (req, res, next) => {
    const token = req.cookies.access_token; // Retrieve the access token from cookies
    //console.log('Token:', token); // Log the token for debugging

    if (!token) {
        console.log('No token provided'); // Log if no token
        return res.status(401).redirect('/'); // Redirect if no token
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log('Token verification failed:', err); // Log verification failure
                return res.redirect('/');
            }
            req.user = user; // Store the user information in the request object      // You can use any custom name here ->  req.anotherRandomWord = userData;
            console.log("req.user: ", req.user)
            next(); // Continue to the next middleware or route handler
        });
    } catch (error) {
        console.log('Error during token verification:', error); // Log any other errors
        return res.status(403).json({ error: 'Invalid token' });
    }
};


export default authMiddleware; // Export the middleware function for use in other parts of the application
