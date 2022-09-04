const {MongoClient, ObjectId} = require("mongodb");
async function connect(){
    if (global.db) return global.db;
    const conn = await MongoClient.connect("mongodb://localhost:27017/");
    if (!conn) return new Error("Can't Connect!");
    global.db = await conn.db("workshop");
    return global.db
}


const express = require('express');
const app = express();
const port = 3000; /* Porta Padrão */

app.use(express.urlencoded({extended:true}));
app.use(express.json());

/* Definindo as Rotas 
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!'}));
app.use('/', router);
*/

// Definindo rotas
const router = express.Router();
router.get('/clientes/:id?', async function (req, res, next){
    try {
        const db = await connect();
        if(req.params.id)
            res.json(await db.collection("costumers").findOne({_id: new ObjectId(req.params.id)}));
        else
            res.json(await db.collection("costumers").find().toArray());
    } catch (ex) {
        console.log(ex);
        res.status(400).json({erro: `${ex}`});
    }
})


router.post('/clientes', async function (req, res, next){
    try {
        const customer = req.body;
        const db = await connect();
        res.json(await db.collection("costumers").insertOne(customer));
    } catch (ex) {
        console.log(ex);
        res.status(400).json({erro: `${ex}`});
    }
})

router.put('/clientes/:id', async function (req, res, next){
    try {
        const customer = req.body;
        const db = await connect();
        res.json(await db.collection("costumers").updateOne({_id: new ObjectId(req.params.id)}, {$set: customer}));
    } catch (ex) {
        console.log(ex);
        res.status(400).json({erro: `${ex}`});
    }
})

router.patch('/clientes/:id', async function (req, res, next){
    try {
        const customer = req.body;
        const db = await connect();
        const id = {_id: new ObjectId(req.params.id)};
        res.json(await db.collection("costumers").updateOne(id, {$set: customer}));
    } catch (ex) {
        console.log(ex);
        res.status(400).json({erro: `${ex}`});
    }
})

router.delete('/clientes/:id', async function (req, res, next){
    try {
        const db = await connect();
        res.json(await db.collection("costumers").deleteOne({_id: new ObjectId(req.params.id)}));
    } catch (ex) {
        console.log(ex);
        res.status(400).json({erro: `${ex}`});
    }
})

app.use('/', router);

/* Iniciando o Servidor */

app.listen(port);
console.log('API funcionando!');