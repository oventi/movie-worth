import express from 'express'
import {advise} from './actions/advise'
import {search} from './actions/search'

const PORT = process.env.PORT || 4000

const app = express()

app.use(express.urlencoded({ extended: true }))

app.post('/', async (req, res) => {
  let response = {}

  try {
    switch (req.body.fn) {
      case 'advise':
        response = await advise(req.body)
        break
      case 'search':
        response = await search(req.body)
        break
    }
  }
  catch(error) {
    return res.status(500).json({error: error.message})
  }

  res.json(response)
})

app.use(express.static('public'))

app.listen(PORT, () => console.log(`movie app listening on port ${PORT}!`))
