import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  paymentOrder,
  deleteOrders,
  removeCart,
  getUserByName,
  removeproductStock,
} from "../../Redux/actions/productsActions";
import enviarMail from "./funcionCompra";
import Swal from "sweetalert2";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import styles from "./Orders.module.css";

const Orders = () => {
  
  const dispatch = useDispatch();
  const [ArrayOrders, setArrayOrders] = useState([]);
  const back = import.meta.env.VITE_APP_BACK;
  const user = useSelector((state) => state.infoUser);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = localStorage.getItem("username");
  const googleName = localStorage.getItem("googleName");
  const collectionStatus = queryParams.get("collection_status");
  const status = queryParams.get("status");
  // Info Mercado Pago
  let userId = 0;
  if (user.length > 0) {
    userId = user[0].id;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Obtener datos del Local Storage
        const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const checkout = JSON.parse(localStorage.getItem("checkout")) || [];
        // Verifica si se ha recibido la confirmación de pago (status: success)
        if (
          status === "approved" &&
          storedOrders.length > 0 &&
          collectionStatus === "approved"
        ) {
          dispatch(removeCart(storedOrders[0].userId));
          if (storedOrders) {
            const email = storedOrders[0].userEmail;
            await Promise.all(
              storedOrders.map(async (order) => {
                const {
                  userId,
                  productId,
                  sizeId,
                  quantity,
                  totalPrice,
                  category,
                } = order;
                dispatch(
                  paymentOrder(
                    userId,
                    productId,
                    sizeId,
                    quantity,
                    totalPrice,
                    category
                  )
                );
                for (let i = 0; i < quantity; i++) {
                  console.log("se ejecutop el for");
                  dispatch(removeproductStock(productId, sizeId));
                }
              })
            );
            await enviarMail(email, "COMPRA REALIZADA", checkout, storedOrders);
            dispatch(deleteOrders(storedOrders[0].userId));
          }
        }
        if (userId > 0) {
          // Si no se cumple la condición, obtén datos de la API
          dispatch(deleteOrders(userId));
          const response = await axios.get(`${back}order/${userId}`);
          const data = response.data;
          setArrayOrders(data); // Actualiza el estado con los datos de la API
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        // Maneja el error según tu lógica (por ejemplo, mostrar un mensaje al usuario)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error al obtener los datos de la API o al pagar los productos.",
        });
      }
    };
    fetchOrders(); // Llama a la función para cargar los datos
  }, [dispatch, status, collectionStatus, back, user, userId]);

  useEffect(() => {
    if (!googleName) {
      dispatch(getUserByName(name));
    } else {
      dispatch(getUserByName(googleName));
    }
  }, [dispatch, name, userId, googleName]);
  return (
    <div>
      <SideBar />
      <div className={styles.orderscontainer}>
        {ArrayOrders.map((order) => (
          <div className={styles.ordercard} key={order.id}>
            <p>Compra {order.id}</p>
            <p>Producto: {order.productName}</p>
            <img
              className={styles.imgCard}
              src={order.image[0]}
              alt={`Imagen de ${order.productName}`} // Agrega un texto descriptivo aquí :D todo bien
            />
            <Link to={`/detail-order/${order.id}`}>Ver Detalle de Compra</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
