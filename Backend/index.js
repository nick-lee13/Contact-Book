const express = require('express');
const Mongoclient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");

const app = express ();
app.use(cors());

const PORT = 5038;

// Use ENV for sensitive db info
const CONNECTION_STRING = "mongodb+srv://ntlee:Vq6lyOilehqIm9z6@cluster0.fetbrjv.mongodb.net/?retryWrites=true&w=majority";
var DATABASE_NAME = "contactsDB";


// Connect to DB and log connection
app.listen(PORT, () => {
    Mongoclient.connect(CONNECTION_STRING,(error,client)=>{
        database = client.db(DATABASE_NAME);
        console.log("MONGO DB CONNECTED");
    })
    console.log("Server Listening on PORT:", PORT);
  })

  // GET REQUEST: Gets all contacts in DB
  app.get('/api/contacts/GetContacts',(request,response)=>{
    database.collection("contactsCollection").find({}).toArray((error,result)=>{
        response.send(result);
    });
  })

  // POST REQUEST: Adds a contact to DB
  app.post('/api/contacts/AddContacts',multer().none(),(request,response)=>{
    database.collection("contactsCollection").count({},function(error,numOfDocs){
        database.collection("contactsCollection").insertOne({
            id:(numOfDocs+1).toString(),
            description:request.body.newContacts
        });
        response.json("Added Succesfully");
    })
  })

  // DELETE REQUEST: Deletes a contact from the DB
  app.delete('contacts/DeleteContacts',(request,response)=>{
    database.collection("contactsCollection").deleteOne({
        id:request.query.id
    });
    response.json("Deleted Succesfully")
  })

  // PATCH REQUEST: Updates a contact in the DB
  app.patch('/api/contacts/UpdateContacts', multer().none(), (request, response) => {
    const { id, newContacts } = request.body;
    
    if (!id || !newContacts) {
        return response.status(400).json({ error: 'Both id and newContacts are required for the update.' });
    }
    database.collection("contactsCollection").findOneAndUpdate(
        { id: id },
        { $set: { description: newContacts } },
        { returnOriginal: false }, // This option ensures you get the updated document
        (error, result) => {
            if (error) {
                return response.status(500).json({ error: 'An error occurred while updating the contact.' });
            }

            if (!result.value) {
                return response.status(404).json({ error: 'Contact not found.' });
            }

            response.json({ message: 'Contact updated successfully', updatedContact: result.value });
        }
    );
});
