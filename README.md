WeUsThem Developer Test Code - Nicholas Lee

TO RUN:
Backend:
- go into backend directory
- npm install cors express mongodb multer
- run "Node index.js" in console
- Should see a connection success msg

Frontend:
- Go into frontend directory
- npm install
- npm install axios
- npm run dev

Access at http://localhost:3000/

BACKEND
- RESTful API:
- Built using Node.JS + Express
- Hosted on local, port 5038
- MongoDB Database instantiated
- DATABASE_NAME: contactsDB
- COLLECTION_NAME: contactsCollection
- User: ntlee, Pass: Vq6lyOilehqIm9z6
- Endpoints:
    - /api/contacts/GetContacts: GET request retrieves and returns list of contact currently stored in database
    - /api/contacts/AddContacts: POST request adds a contact to the database
    - /api/contacts/DeleteContacts: DELETE request deletes a contact from the database
    - /api/contacts/UpdateContacts: PATCH request updates a contact if it is in the database
    - /api/contacts/SearchContacts: GET request to retrieve search results based on query
    - /api/contacts/UploadImage: POST request to upload an image to database
- Backend uses multer and express to read and store data between database and client

FRONTEND
- Updated from local storage to API using axios to make requests to the API
- Added form validation:
    - Must have at least a first name and a phone or email, rest is optional
    - Phone and Email must have proper format
    - Image upload must be an image file or proper image URL
- Sorting:
    - click on either first name, last name, phone, or email on header to sort in ascending/descending order
- Search:
    - Search by names, email, or phone, display is update with each character entry and search for partial or full results
- Image upload:
    - Doesnt fully function as of yet, there is storage and endpoints made but ran out of time.
