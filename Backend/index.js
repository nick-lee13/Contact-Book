const express = require('express');
const Mongoclient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");

const app = express ();
app.use(cors()); //avoid CORS issues
app.use(express.json()); //for reading incoming data correctly

const PORT = 5038;

// Use ENV for sensitive db info
const CONNECTION_STRING = "mongodb+srv://ntlee:Vq6lyOilehqIm9z6@cluster0.fetbrjv.mongodb.net/?retryWrites=true&w=majority";
var DATABASE_NAME = "contactsDB";

//Multer storage for images
const storage = multer.memoryStorage();
const upload = multer({ storage });


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
    // Gets all results from DB and sents to frontend
    database.collection("contactsCollection").find({}).toArray((error,result)=>{
        response.send(result);
    });
  })

  // POST REQUEST: Adds a contact to DB
  app.post('/api/contacts/AddContacts', multer().none(), (request, response) => {
    // Get data from request received
    const {
      id,
      fName,
      lName,
      email,
      phone,
      imageUrl
    } = request.body;
  
    // Check if required properties are present
    if (!id || !fName || (!email && !phone)) {
      return response.status(400).json({ error: 'Missing required contact properties.' });
    }
  
    // Add contact data to the database
    database.collection("contactsCollection").insertOne({
      id,
      fName,
      lName,
      email,
      phone,
      imageUrl
    }, (error, result) => {
      if (error) {
        console.error("Error adding contact:", error);
        response.status(500).json({ error: 'An error occurred while adding the contact.' });
      } else {
        response.json("Added Successfully");
      }
    });
  });
  
  // DELETE REQUEST: Deletes a contact from the DB
  // Finds contact by ID and removes from DB
  app.delete('/api/contacts/DeleteContacts',(request,response)=>{
    database.collection("contactsCollection").deleteOne({
        id:request.query.id
    });
    response.json("Deleted Succesfully")
  })

  // PATCH REQUEST: Updates a contact in the DB
  app.patch('/api/contacts/UpdateContacts', multer().none(), (request, response) => {
    // Get data from request received
    const {
      id,
      fName,
      lName,
      email,
      phone,
      imageUrl
    } = request.body;
  
    //Must have ID
    if (!id) {
      return response.status(400).json({ error: 'id is required for the update.' });
    }
  
    //Empty array for updated fields
    const updateFields = {};
  
    //Check each data entry for changes and add to updateFields
    if (fName) {
      updateFields.fName = fName;
    }
    if (lName) {
      updateFields.lName = lName;
    }
    if (email) {
      updateFields.email = email;
    }
    if (phone) {
      updateFields.phone = phone;
    }
    if (imageUrl) {
      updateFields.imageUrl = imageUrl;
    }
  
    // Update the contact in the DB
    database.collection("contactsCollection").findOneAndUpdate(
      { id: id },
      { $set: updateFields }, // Update only provided fields
      { returnOriginal: false },
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

    // SEARCH REQUEST: returns search result:
    app.get('/api/contacts/SearchContacts', (req, res) => {
        const query = req.query.query.toLowerCase(); // Get the search query from query parameters
    
        // Search logic using MongoDB's $or operator to match any of the criteria
        database.collection("contactsCollection").find({
        $or: [
            { email: { $regex: query, $options: 'i' } }, // Case-insensitive email search
            { phone: { $regex: query } }, // Phone search
            { lName: { $regex: query, $options: 'i' } }, // Case-insensitive last name search
            { fName: { $regex: query, $options: 'i' } }, // Case-insensitive first name search
        ],
        }).toArray((error, result) => {
        if (error) {
            console.error("Error searching contacts:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    
        res.json(result);
        });
    });

    const { MongoClient, Binary } = require('mongodb');

    const client = new MongoClient(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

    app.post('/api/contacts/UploadImage', upload.single('image'), async (req, res) => {
        try {
          const imageCollection = client.collection('imageCollection');
      
          // Insert the image data into the imageCollection
          const result = await imageCollection.insertOne({
            data: new Binary(req.file.buffer), // Store the image data as Binary
          });
      
          // Respond with a success message or the inserted document's ID
          res.json({ message: 'Image uploaded successfully', imageId: result.insertedId });
        } catch (error) {
          console.error('Error uploading image: ', error);
          res.status(500).json({ error: 'An error occurred while uploading the image' });
        }
      });
      