import Database from "better-sqlite3";
import express from "express";
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())




const db = new Database('./data.db', {
    verbose: console.log,
})



const dropMuseums = db.prepare(`
DROP TABLE IF EXISTS museums;
`)


const dropWorks = db.prepare(`
DROP TABLE IF EXISTS works
`)

dropWorks.run()
dropMuseums.run()

const museumeTable = db.prepare(`
CREATE TABLE IF NOT EXISTS  museums(
id INTEGER ,
name TEXT NOT NULL,
city TEXT NOT NULL,
PRIMARY KEY (id)
);`)

const worksTable = db.prepare(`
CREATE TABLE IF NOT EXISTS  works(
id INTEGER ,
name TEXT NOT NULL,
picture TEXT NOT NULL,
WorkId integer NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (WorkId) REFERENCES museums(id)
);`)


museumeTable.run()
worksTable.run()


const museums = [
    {
        name: 'National Museum of Archaeology',
        city: 'Tirana'
    },
    {
        name: 'Archaeological Museum of Durrës',
        city: 'Durres'
    },
    {
        name: 'Archaeological Museum of Korçë',
        city: 'Korçë'
    },
    {
        name: 'Museum of Kamenica Tumulus',
        city: 'Korçë'
    },
    {
        name: 'Archaeological Museum of Apolonia',
        city: 'Apolonia AKA Fier'
    },
    {
        name: 'Archaeological Museum of Butrint',
        city: 'Sarande'
    }
]


const works = [
    {
        name: 'Curators',
        picture: 'https://www.ne-mo.org/fileadmin/_processed_/1/0/csm__c_MRBAB__photo__Dieter_Telemans_wsp_ed7cbf8c2e.jpg',
        workId: 1
    },
    {
        name: 'Museum Conservator',
        picture: 'https://images.squarespace-cdn.com/content/v1/5443d7c7e4b06e8b47de9a55/1496442105064-Z18PGQDX0O7KBSQGN208/museum_conservation.jpg?format=1000w',
        workId: 2
    },
    {
        name: 'Exhibit Designer',
        picture: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/4eadad17319685.562b88caed6ea.jpg',
        workId: 3
    },
    {
        name: 'Museum Educator',
        picture: 'https://marvel-b1-cdn.bc0a.com/f00000000026007/resilienteducator.com/wp-content/uploads/2012/10/childrens-museum-educator.jpg',
        workId: 3
    },
    {
        name: 'Curators ',
        picture: 'https://www.ne-mo.org/fileadmin/_processed_/1/0/csm__c_MRBAB__photo__Dieter_Telemans_wsp_ed7cbf8c2e.jpg',
        workId: 4
    },
    {
        name: 'Museum Educator',
        picture: 'https://marvel-b1-cdn.bc0a.com/f00000000026007/resilienteducator.com/wp-content/uploads/2012/10/childrens-museum-educator.jpg',
        workId: 5
    }
]


const createMuseum = db.prepare(`
INSERT INTO  museums (name, city) VALUES(?, ?);    
`)


const creatework = db.prepare(`
INSERT INTO  works (name, picture, workId) VALUES(?, ?, ?);
`)

for (const museum of museums) {
    createMuseum.run(museum.city, museum.name)
}

for (const work of works) {
    creatework.run(work.name, work.picture, work.workId)
}


const getAllMuseums = db.prepare(`
SELECT * FROM museums;
`)

const getAllWorks = db.prepare(`
SELECT * FROM works;
`)

const getMuseumById = db.prepare(`
SELECT * FROM museums
WHERE id =?;
`)

const getWorkById = db.prepare(`
SELECT * FROM works 
WHERE id =?;
`)

app.get(`/museums`, (req, resp) => {
    const result = getAllMuseums.all()

    resp.send(result)
})
app.get(`/museums/:id`, (req, resp) => {
    const id = req.params.id

    const result = getMuseumById.get(id)

    resp.send(result)

})


app.get(`/works`, (req, resp) => {
    const result = getAllWorks.all()

    resp.send(result)
})

app.get(`/works/:id`, (req, resp) => {
    const id = req.params.id

    const result = getWorkById.get(id)

    resp.send(result)
})




app.listen(4000, () => console.log(`Listening on : http://localhost:4000`))
