const axios = require('axios')
const { Todo } = require('../models')
const formatDate = require('../helpers/format-date')

class Controller {
    static showAllTodos(req, res, next) {
        Todo.findAll({
            where: { user_id: req.userId },
            attributes: { exclude: ['createdAt', 'updatedAt', 'user_id'] }
        })
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => {
                //res.status(500).json({ message: 'internal server error' })
                next({
                    message: 'Internal server error',
                    code: 500,
                    from: 'Controller Todo: show all todos'
                })
            })
    }

    static createTodos(req, res, next) {
        const todo = {
            title: req.body.title,
            description: req.body.description,
            status: 'undone',
            due_date: formatDate(req.body.due_date),
            user_id: req.userId,
            ProjectId: +req.body.ProjectId
        }

        Todo.create(todo)
            .then(data => {
                res.status(201).json(data)
            })
            .catch(err => {
                const messageError = err.message.split(',')[0]
                const code = +err.message.split(',')[1]

                if (code === 400) {
                    //res.status(400).json({ message: messageError })
                    next({
                        message: messageError,
                        code: 400,
                        from: 'Controller Todo: create todos'
                    })
                } else {
                    //res.status(500).json({ message: 'internal server error' })
                    next({
                        message: 'Internal server error',
                        code: 500,
                        from: 'Controller Todo: create todos'
                    })
                }
            })
    }

    static showById(req, res, next) {
        const id = req.params.id

        Todo.findOne({
            where: { id }
        })
            .then(data => {
                if (data) {
                    res.status(200).json(data)
                } else {
                    //res.status(404).json({ message: 'todo item not found' })
                    next({
                        message: 'Item not found',
                        code: 404,
                        from: 'Controller Todo: find by id todos'
                    })
                }
            })
            .catch(err => {
                //res.status(500).json({ message: 'internal server error' })
                next({
                    message: 'Internal server error',
                    code: 500,
                    from: 'Controller Todo: find by id todos'
                })
            })
    }

    static updateTodos(req, res, next) {
        const id = req.params.id

        Todo.findOne({
            where: { id }
        })
            .then(data => {
                if (!data) {
                    //res.status(404).json({ message: 'todo item not found' })

                    next({
                        message: 'Item not found',
                        code: 404,
                        from: 'Controller Todo: update todos'
                    })
                }

                const todo = {
                    title: req.body.title,
                    description: req.body.description,
                    due_date: req.body.due_date
                }

                return Todo.update(todo, {
                    where: { id },
                    returning: true
                })

            })
            .then(data => {
                res.status(200).json(data[1][0])
            })
            .catch(err => {
                const messageError = err.message.split(',')[0]
                const code = +err.message.split(',')[1]

                if (code === 400) {
                    //res.status(400).json({ message: messageError })
                    next({
                        message: messageError,
                        code: 400,
                        from: 'Controller Todo: update todos'
                    })
                } else {
                    //res.status(500).json({ message: 'internal server error' })
                    next({
                        message: 'Internal server error',
                        code: 500,
                        from: 'Controller Todo: update todos'
                    })
                }
            })
    }

    static changeStatus(req, res, next) {
        const id = req.params.id

        Todo.findOne({
            where: { id }
        })
            .then(data => {
                if (!data) {
                    //res.status(404).json({ message: 'todo item not found' })
                    next({
                        message: 'Item not found',
                        code: 404,
                        from: 'Controller Todo: change status todos'
                    })
                }

                const todo = {
                    status: 'done'
                }

                return Todo.update(todo, {
                    where: { id },
                    returning: true
                })

            })
            .then(data => {
                res.status(200).json(data[1][0])
            })
            .catch(err => {
                const messageError = err.message.split(',')[0]
                const code = +err.message.split(',')[1]

                if (code === 400) {
                    //res.status(400).json({ message: messageError })
                    next({
                        message: messageError,
                        code: 400,
                        from: 'Controller Todo: change status todos'
                    })
                } else {
                    //res.status(500).json({ message: 'internal server error' })
                    next({
                        message: 'Internal server error',
                        code: 500,
                        from: 'Controller Todo: change status todos'
                    })
                }
            })
    }

    static deleteTodos(req, res, next) {
        const id = req.params.id

        Todo.findOne({
            where: { id }
        })
            .then(data => {
                if (!data) {
                    //res.status(404).json({ message: 'todo item not found' })
                    next({
                        message: 'Item not found',
                        code: 404,
                        from: 'Controller Todo: delete todos'
                    })
                }

                return Todo.destroy({
                    where: { id }
                })
            })
            .then(data => {
                res.status(200).json({ message: 'todo successfully deleted' })
            })
            .catch(err => {
                //res.status(500).json({ message: 'internal server error' })
                next({
                    message: 'Internal server error',
                    code: 500,
                    from: 'Controller Todo: delete todos'
                })
            })
    }

    static numberFact(req, res, next) {
        const id = req.headers.id

        let apiURL = `http://numbersapi.com/${id}/math`

        axios.get(apiURL)
            .then(response => {
                console.log(response.data)
                res.status(200).json({ data: response.data })
            })
            .catch(err => {
                console.log(err)
            })
    }

    static randomQuote(req, res, next) {
        const id = +req.headers.id

        let apiURL = `https://api.adviceslip.com/advice/${id}`

        axios.get(apiURL)
            .then(response => {
                const end = response.data.length - 2
                const msg = response.data.substring(32, end)
            
                console.log(msg)

                res.status(200).json({ data: msg })
            })
            .catch(err => {
                console.log(err)
            })
    }
}

module.exports = Controller