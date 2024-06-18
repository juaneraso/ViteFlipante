import React, { useState, useEffect } from "react";
import CardBan from "../BannedList/BannedCard";
import styles from "./Banned.module.css";

const back = import.meta.env.VITE_APP_BACK;

const Banned = () => {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    const fetchBannedUsers = async () => {
      try {
        const response = await fetch(`${back}users-deleted`);
        if (!response.ok) {
          throw new Error("No se pudo obtener la lista de usuarios prohibidos");
        }
        const data = await response.json();
        setBannedUsers(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchBannedUsers();
  }, []);

  // Filtrar usuarios prohibidos según el término de búsqueda
  const filteredBannedUsers = bannedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica para el paginado
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentBannedUsers = filteredBannedUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = Math.ceil(filteredBannedUsers.length / usersPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h2>Lista de Usuarios baneados</h2>
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles["input-text"]}
      />
      <div className={styles.pagination}>
        {Array(totalPages)
          .fill()
          .map((_, i) => (
            <button key={i} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          ))}
      </div>
      <div className={styles.bannedFlex}>
        {currentBannedUsers.map((user) => (
          <div className={styles.bannedList}>
            <CardBan
              key={user.id}
              id={user.id}
              name={user.name}
              address={user.address}
              phone={user.phone}
              imageProfile={user.imageProfile}
              deleted={user.deleted}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banned;
