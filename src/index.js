const express = require('express')
const {uuid, isUuid} = require('uuidv4')

const app = express()
const PORT = 3333



app.use(express.json())

/**
 * Métodos HTTP
 * 
 * GET: Busca informações do Backend
 * POST: Cria uma informação no Backend
 * PUT/PATCH: Altera uma ou mais informações no Backend
 * DELETE: Remove informações do Backend
 */

 /**
  * Tipos de Params
  * 
  * Query Params: Filtros e paginação
  * Route Params: 
  * Request Body
  */

  /**
   *  Middleware
   * 
   * Interceptador de requisições que interrompe totalmente 
   * ou altera dados da requisição
   */

let developers = []

function logRequest(req, res, next){
  const {method, url}  =req
  const logLabel =`[${method.toUpperCase()}] ${url}`

  console.time(logLabel)
  next()
  console.timeEnd(logLabel)
}

function validateId(req, res, next){
  const {id} = req.params

  if(!isUuid(id)){
    return res.status(400).json({
      error: `This id:${id} is invalid!`
    })
  }
  return next()
}

app.use(logRequest)

app.get('/developers', (req, res)=>{
  const {name, specialty} = req.query
  if(name || specialty ){
    return res.json(developers
      .filter(dev => dev.name === name || dev.specialty === specialty ))
  }else{
    return res.json(developers)
  }
 
})

app.post('/developers', (req, res)=>{
  const {name, specialty} = req.body
  const developer = {id: uuid(), name, specialty}

  developers.push(developer)

  return res.json(developer)
})

app.put('/developers/:id',validateId, (req, res)=>{
  const {id} = req.params
  const {name, specialty} = req.body

  const developerIndex = developers.findIndex(dev => dev.id === id)

  if(developerIndex < 0){
    return res.status(404).json({
      error: 'Developer not found'
    })
  }

 const developer = {
  id, name, specialty
 }

 developers[developerIndex] = developer
    
  return res.json(developer)
})

app.delete('/developers/:id',validateId, (req, res)=>{
  const {id} = req.params
  const developerIndex = developers.findIndex(dev => dev.id === id)

  if(developerIndex < 0){
    return res.status(404).json({
      error: 'Developer not found'
    })
  }

  developers.splice(developerIndex, 1)
  return res.status(204).json()
})

app.listen(3333, ()=>{
  console.log(`Backend is runing on port ${PORT}`);  
})