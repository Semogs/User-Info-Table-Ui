import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../css/userTable.css";
import { orderBy } from "lodash";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { User, SortOrder } from "./Interface";
import userService from "../services/UserService";
import { PAGE_SIZE } from "../config";
import ContentLoader from "./ContentLoader";
import { Tooltip } from "@mui/material";

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const navigate = useNavigate();

  const usersToShow = orderBy(users, ["name"], [sortOrder]).slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const fetchUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    const res = await userService.getUsers();
    if (Array.isArray(res)) {
      setUsers(res);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserRowClick = (userId: number) => {
    navigate(`/user/${userId}/posts`);
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const handleNextPage = () => setCurrentPage(currentPage + 1);

  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="page-con-user-table">
      {loading ? (
        <ContentLoader />
      ) : (
        <div className="user-table">
          <div className="user-table-container">
            <table className="user-table-table">
              <thead>
                <tr>
                  <th onClick={handleSort} className="full-name-th">
                    Full Name{" "}
                    <span className="full-name-span">{sortOrder === "asc" ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</span>
                  </th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {usersToShow.map((user) => {
                  const userAddress = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
                  return (
                    <tr key={user.id} className="user-table-row" onClick={() => handleUserRowClick(user.id)}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <Tooltip title={userAddress}>
                        <td>
                          <div className="user-table-address-cell">{userAddress}</div>
                        </td>
                      </Tooltip>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button className="user-table-button user-table-button-prev" onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <button
            className="user-table-button user-table-button-next"
            onClick={handleNextPage}
            disabled={users.length / PAGE_SIZE <= currentPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
