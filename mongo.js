const mongoose = require('mongoose')

if (process.argv.length <3) {
    console.log('give password as an argument')
    process.exit(1)
}

const password = process.argv[2]
const argName = process.argv[3]
const argNumber = process.argv[4]

const url = `mongodb+srv://admin:${password}@cluster0.5y4t3l5.mongodb.net/part3-exercises?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//     name: argName,
//     number: argNumber,
// })

// person.save().then(result => {
//     console.log(`added ${result.name} number ${result.number} to phonebook`)
//     mongoose.connection.close()
// })

if (process.argv.length == 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
            mongoose.connection.close()
        })
    })
}