// proj1_server.ts

import express, { Request, Response } from  'express'
import { User, getUser } from  './db'

const app = express()
const port = 3000

app.get('/user/:id', (req: Request, res: Response) => {
const id = parseInt(req.params.id)
const  user: User | undefined = getUser(id)
if (user) {
res.send(user)
} else {
res.status(404).send('User not found')
}
})

app.listen(port, () => {
console.log(`App listening at http://localhost:${port}`)
})
