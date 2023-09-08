"use client";
import React, { useEffect, useState } from "react";
import ContactRow from "./ContactRow";
import ContactForm from "./ContactForm";
import axios from "axios"; // Import Axios

const ContactTable = () => {
  const [contactData, setContactData] = useState<Contact[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [displayForm, setDisplayForm] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");


  const API_URL = "http://localhost:5038/"; // Backend RESTful API URL

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(API_URL + "api/contacts/GetContacts"); // API Call to retrieve contacts from DB
      setContactData(response.data); // Sets returned data to populate the page
    } catch (error) {
      console.error("Error fetching contact data from the database: ", error);
    }
  };

  const deleteUserData = async (id: string) => {
    try {
      await axios.delete(`${API_URL}api/contacts/DeleteContacts?id=${id}`); // API Call to delete a contact given the ID
      fetchUserData(); // Refresh contact list
    } catch (error) {
      console.error("Error deleting contact: ", error);
    }
  };

  const updateUserData = async (contact: Contact) => {
    if (selectedIndex !== -1) {
      try {
        await axios.patch(
          `${API_URL}api/contacts/UpdateContacts?id=${contact.id}`,
          contact
        ); // API Call to update contact of ID with new contact info
        fetchUserData();
        closeFormModal();
      } catch (error) {
        console.error("Error updating contact: ", error);
      }
    } else {
      try {
        await axios.post(API_URL + "api/contacts/AddContacts", contact); // API call to add a new contact, sends contact data to the API
        fetchUserData();
        closeFormModal();
      } catch (error) {
        console.error("Error adding contact: ", error);
      }
    }
  };

  const closeFormModal = () => {
    setDisplayForm(false);
    setSelectedIndex(-1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }

  const handleSearch = async () => {
    if (searchQuery === "") {
      // If the search query is empty, fetch all contacts
      fetchUserData();
    } else {
      // Filter contacts based on the search query
      try {
        const response = await axios.get(
          `${API_URL}api/contacts/SearchContacts?query=${searchQuery}`
        );
        setContactData(response.data);
      } catch (error) {
        console.error("Error searching contacts: ", error);
      }
    }
  };
  

  const sortContacts = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(-1 * sortDirection);
    } else {
      setSortColumn(column);
      setSortDirection(1);
    }

    const sortedContacts = [...contactData];
    sortedContacts.sort((a, b) => {
      const valueA = a[column]?.toLowerCase() || ""; // Convert to lowercase for case-insensitive sorting
      const valueB = b[column]?.toLowerCase() || "";

      if (valueA < valueB) {
        return -1 * sortDirection;
      }
      if (valueA > valueB) {
        return 1 * sortDirection;
      }
      return 0;
    });

    setContactData(sortedContacts);
  };

  return (
    <>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      <table className="table">
        <thead>
          <tr className="contact-row">
            <th>Image</th>
            <th onClick={() => sortContacts("fName")} className={sortColumn === "fName" ? (sortDirection === 1 ? 'ascending' : 'descending') : ''}>First Name</th>
            <th onClick={() => sortContacts("lName")} className={sortColumn === "lName" ? (sortDirection === 1 ? 'ascending' : 'descending') : ''}>Last Name</th>
            <th onClick={() => sortContacts("email")} className={sortColumn === "email" ? (sortDirection === 1 ? 'ascending' : 'descending') : ''}>Email</th>
            <th onClick={() => sortContacts("phone")} className={sortColumn === "phone" ? (sortDirection === 1 ? 'ascending' : 'descending') : ''}>Phone #</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {contactData.map((contact, index) => {
            return (
              <ContactRow
                key={contact.id}
                data={contact}
                onDeleteData={() => deleteUserData(contact.id)}
                onUpdateData={() => {
                  setSelectedIndex(index);
                  setDisplayForm(true);
                }}
                onSort={sortContacts}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
              />
            );
          })}
        </tbody>
      </table>
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setDisplayForm(true);
          }}
        >
          Add New
        </button>
      </div>
      <ContactForm
        visible={displayForm}
        selectedIndex={selectedIndex}
        contactData={contactData}
        onUpdateData={updateUserData}
        onCloseModal={closeFormModal}
      ></ContactForm>
    </>
  );
};

export default ContactTable;
