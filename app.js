import express from 'express'

const app = express()

app.use('/', (req, res) => {
    res.send("Welcome to the e-coomerce Server")
})
export default app;    