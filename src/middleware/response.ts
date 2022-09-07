export const response = (req, res, next) => {
    res.ok = (data = {}) => {
        let response = {
            data,
            success: true
        };
        res.json(response);
        res.end();
    }

    next();
}