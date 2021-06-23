export default (req, res, next) => {
    const WHITE_LIST = ['http://localhost:3000'];
    console.log(req.headers.origin);
    res.setHeader('Access-Control-Allow-Origin', WHITE_LIST.includes(req.headers.origin) ? req.headers.origin: null);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
};
