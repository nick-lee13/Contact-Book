import React from "react";

const ContactRow = ({
  data,
  onDeleteData,
  onUpdateData,
  onSort,
  sortColumn,
  sortDirection,
}: {
  data: Contact;
  onDeleteData: any;
  onUpdateData: any;
  onSort: (column: string) => void;
  sortColumn: string | null;
  sortDirection: number;
}) => {
  return (
    <tr data-key={data.id} className="contact-row">
      <td>
        <img alt="User Profile" className="thumbnail" src={data.imageUrl} />
      </td>
      <td>{data.fName}</td>
      <td>{data.lName}</td>
      <td onClick={() => onSort("email")} className={sortColumn === "email" ? (sortDirection === 1 ? 'ascending' : 'descending') : ''}>{data.email}</td>
      <td onClick={() => onSort("phone")} className={sortColumn === "phone" ? (sortDirection === 1 ? 'ascending' : 'descending') : ''}>{data.phone}</td>
      <td>
        <button className="btn btn-primary" onClick={onUpdateData}>
          Update
        </button>
        <button className="btn btn-danger" onClick={onDeleteData}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ContactRow;
