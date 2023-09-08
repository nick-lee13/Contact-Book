import React from "react";

const ContactRow = ({
  data,
  onDeleteData,
  onUpdateData,
}: {
  data: Contact;
  onDeleteData: any;
  onUpdateData: any;
}) => {
  return (
    <tr data-key={data.id} className="contact-row">
      <td>
        <img alt="User Profile" className="thumbnail" src={data.imageUrl} />
      </td>
      <td>{data.fName}</td>
      <td>{data.lName}</td>
      <td>{data.email}</td>
      <td>{data.phone}</td>
      <td>
        <button className="btn btn-primary" onClick={onUpdateData}>Update</button>
        <button className="btn btn-danger" onClick={onDeleteData}>Delete</button>
      </td>
    </tr>
  );
};

export default ContactRow;
