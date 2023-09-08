"use client";
import { useEffect, useState } from "react";
import ContactRow from "./ContactRow";
import ContactForm from "./ContactForm";

const ContactTable = () => {
  const [contactData, setContactData] = useState<Contact[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [displayForm, setDisplayForm] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    //await fetch api
    let res = localStorage.getItem("@contact-data");
    let json = [];
    if (res != null) json = JSON.parse(res);
    setContactData(json);
  };

  const deleteUserData = async (id: string) => {
    //await delete api
    let temp = contactData.filter((el) => el.id !== id);
    localStorage.setItem("@contact-data", JSON.stringify(temp));
    fetchUserData()
  };

  const updateUserData = async (contact: Contact) => {
    if (selectedIndex != -1) {
      //await update api
      let temp = contactData;
      temp[selectedIndex] = contact;
      localStorage.setItem("@contact-data", JSON.stringify(temp));
    } else {
      //await add api
      let temp = contactData;
      temp.push(contact);
      localStorage.setItem("@contact-data", JSON.stringify(temp));
    }
    fetchUserData()
    closeFormModal();
  };

  const closeFormModal = () => {
    setDisplayForm(false);
    setSelectedIndex(-1);
  };

  return (
    <>
      <table className="table">
        <thead>
          <tr className="contact-row">
            <th>image</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone #</th>
            <th>options</th>
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
