const { verifyToken } = require('../helpers/jwt')
const { User, Todo } = require('../models')

function authentication(req, res, next) {
    try {
        let decoded = verifyToken(req.headers.access_key)

        User.findOne({
            where: { email: decoded.email }
        })
            .then(data => {
                if (!data) {
                    //res.status(401).json({ message: 'Please login first!' })
                    next({
                        message: 'Please login first',
                        code: 401,
                        from: 'middleware: authentication'
                    })
                } else {
                    req.userId = data.id
                    req.ProjectId = data.ProjectId
                    next()
                }
            })
            .catch(err => {
                //res.status(500).json({ message: 'internal server error' })
                next({
                    message: 'Internal server error',
                    code: 500,
                    from: 'middleware: authentication'
                })
            })

    } catch (error) {
        //res.status(400).json({ message: error.message })
        next({
            message: error.message,
            code: 400,
            from: 'middleware: authentication'
        })
    }
}

function authorization(req, res, next) {
    const todo_id = +req.params.id
    const user_id = req.userId

    Todo.findOne({
        where: { id: todo_id }
    })
        .then(data => {
            if (!data || data.user_id !== user_id) {
                //res.status(401).json({ message: 'disallowed' })
                next({
                    message: 'disallowed',
                    code: 401,
                    from: 'middleware: authorization'
                })
            } else {
                next()
            }
        })
        .catch(err => {
            //res.status(500).json({ message: 'internal server error' })
            next({
                message: 'Internal server error',
                code: 500,
                from: 'middleware: authorization'
            })
        })
}

module.exports = { authentication, authorization }