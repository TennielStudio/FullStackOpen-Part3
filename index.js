const express = require('express')
const morgan = require('morgan')
const moment = require('moment')
const cors = require('cors')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('morganPost', (request, response) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    } else {
        return ''
    }
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :morganPost'))
app.use(cors())
app.use(express.static('dist'))

app.get('/api/persons/', (request, response) => {
    response.json(persons)
})

app.get('/info/', (request, response) => {
    const currentTime = moment.utc()
    const formattedTime = currentTime.format('ddd MMM D YYYY [GMT] HH:mm:ss')
    response.send(`<p>Phonebook has info for ${persons.length} people <br/> ${formattedTime}</p>`)
})

app.get('/api/persons/:id/', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generateId = (min, max) => {
    const randomId = Math.floor(Math.random() * (max-min+1)) + min
    return randomId
}

app.post('/api/persons', (request, response) => {
    const requestBody = request.body

    if (!requestBody.name || !requestBody.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const findName = persons.find(person => person.name === requestBody.name)
    if (findName) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(5, 1000),
        name: requestBody.name,
        number: requestBody.number
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id/', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => id !== person.id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})