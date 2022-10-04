import express, { json } from 'express'

const app = express()

app.use(json())

app.get('/', (req, res) => {
    res.send('Hello World!')
    }
)

app.listen(30001, () => {
    console.log('Server started on port 30001')
    }
)