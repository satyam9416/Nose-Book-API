import jwt from "jsonwebtoken"

export const authMiddleware = async (req, res, next) => {

    const authorizationHeader = req.headers.authorization || req.headers.Authorization;
    if (!authorizationHeader?.startsWith("Bearer ")) return res.status(403).json({ message: 'No token Provided' })
    const token = authorizationHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).send('No token is provided.')
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, tokenData) => {

        if (error?.name == 'TokenExpiredError') return res.status(401).send({ message: 'Token expired' });

        if (error) return res.status(403).send('Access Forbidden')

        req.auth = tokenData;

        return next();
    })

}

export default authMiddleware;