import React, { useState, useEffect } from "react";
import { Chart as ChartJS, LineElement, Tooltip, Legend } from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import moment from "moment";

import styles from "./Statistics.module.css";

const back = import.meta.env.VITE_APP_BACK;

Chart.register(...registerables);
ChartJS.register(LineElement, Tooltip, Legend);

const Statistics = () => {
  const [chartData, setChartData] = useState({
    usuariosRegistrados: {
      labels: [],
      datasets: [
        {
          label: "Usuarios Registrados por Mes",
          borderColor: "#000",
          borderWidth: 2,
          data: [],
          fill: false,
        },
      ],
    },
    reviews: {
      labels: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      datasets: [],
    },
    ventas: {
      labels: [],
      datasets: [
        {
          label: "Ventas",
          borderColor: "#000",
          borderWidth: 2,
          data: [],
          fill: false,
        },
      ],
    },
    visitas: {
      labels: [],
      datasets: [
        {
          label: "Visitas",
          borderColor: "rgba(255, 0, 0, 1)",
          borderWidth: 2,
          data: [],
          fill: false,
        },
      ],
    },
    ventasPorCategoria: {
      labels: [],
      datasets: [
        {
          label: "Ventas por Categoría",
          backgroundColor: [
            "#ad4dfc",
            "#5841d8",
            "#cb41d8",
            "#5841d8",
            "#5841d8",
          ],
          borderWidth: 2,
          data: [],
        },
      ],
    },
  });

  const [totalUsuariosRegistrados, setTotalUsuariosRegistrados] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalProductosActivos, setTotalProductosActivos] = useState(0);
  const [totalProductosInactivos, setTotalProductosInactivos] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalVisitas, setTotalVisitas] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de usuarios registrados
        const usersResponse = await fetch(`${back}users`);
        const usersData = await usersResponse.json();

        const totalUsuarios = usersData.length;
        setTotalUsuariosRegistrados(totalUsuarios);

        const userCountByMonth = {};
        usersData.forEach((user) => {
          const registrationDate = moment(user.purchaseDate);
          const monthYear = registrationDate.format("MMM YYYY");
          if (userCountByMonth[monthYear]) {
            userCountByMonth[monthYear]++;
          } else {
            userCountByMonth[monthYear] = 1;
          }
        });

        const usuariosRegistradosData = {
          labels: Object.keys(userCountByMonth),
          datasets: [
            {
              label: "Usuarios Registrados por Mes",
              borderColor: "#ad4dfc",
              borderWidth: 2,
              data: Object.values(userCountByMonth),
              fill: false,
              backgroundColor: "#333", // Violeta
            },
          ],
        };

        setChartData((prevChartData) => ({
          ...prevChartData,
          usuariosRegistrados: usuariosRegistradosData,
        }));

        // Obtener datos de revisiones
        const reviewsResponse = await fetch(`${back}reviews`);
        let reviewsData = await reviewsResponse.json();

        const months = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
        const positiveData = Array.from({ length: 12 }, () => 0);
        const negativeData = Array.from({ length: 12 }, () => 0);

        reviewsData.forEach((review) => {
          const date = new Date(review.PurchaseDate);
          const month = date.getMonth();
          const rating = review.rating;

          if (rating >= 3) {
            positiveData[month]++;
          } else {
            negativeData[month]++;
          }
        });

        reviewsData = {
          labels: months,
          datasets: [
            {
              label: "Comentarios Negativos (1 y 2 estrellas)",
              backgroundColor: "#6f32ff",
              borderWidth: 1,
              data: negativeData,
            },
            {
              label: "Comentarios Positivos (3, 4 y 5 estrellas)",
              backgroundColor: "#c532ff",
              borderWidth: 1,
              data: positiveData,
            },
          ],
        };

        setChartData((prevChartData) => ({
          ...prevChartData,
          reviews: reviewsData,
        }));

        // Obtener datos de ventas
        const orderResponse = await fetch(`${back}order`);
        const orderData = await orderResponse.json();

        const totalSales = orderData.length;
        setTotalVentas(totalSales);

        const total = orderData.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
        setTotalIngresos(total);

        const meses = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
        const ventasPorMes = Array(12).fill(0);

        orderData.forEach((venta) => {
          const fecha = new Date(venta.purchaseDate);
          const mes = fecha.getMonth();
          ventasPorMes[mes] += 1;
        });

        const ventasData = {
          labels: meses,
          datasets: [
            {
              label: "Ventas",

              borderColor: "#ad4dfc",
              borderWidth: 2,
              data: ventasPorMes,
              fill: false,
            },
          ],
        };

        setChartData((prevChartData) => ({
          ...prevChartData,
          ventas: ventasData,
        }));

        const categoryCounts = {};

        orderData.forEach((order) => {
          const category = order.category;
          if (category) {
            if (categoryCounts[category]) {
              categoryCounts[category]++;
            } else {
              categoryCounts[category] = 1;
            }
          }
        });

        // Convertir los datos en un formato adecuado para el gráfico de pastel
        const pieChartData = {
          labels: Object.keys(categoryCounts),
          datasets: [
            {
              data: Object.values(categoryCounts),
              backgroundColor: [
                "#cb41d8ea",
                "#8741d8ea",
                "#3235cfea",
                "#cf3259ea",
                "#254bf5ea",
                "#ff3a85ea",
              ],
            },
          ],
        };

        // Actualiza el estado con los datos del gráfico de pastel
        setChartData((prevChartData) => ({
          ...prevChartData,
          ventasPorCategoria: pieChartData,
        }));

        // Obtener datos de visitas
        const visitResponse = await fetch(`${back}visit`);
        const visitData = await visitResponse.json();

        // Procesar los datos de visitas aquí
        // Puedes implementar lógica similar a la de ventas o usuarios registrados

        // para calcular estadísticas relacionadas con las visitas
        setTotalVisitas(visitData[0].count);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Realiza una solicitud HTTP para obtener los datos de productos
    const fetchProducts = async () => {
      try {
        const productsResponse = await fetch(`${back}products`);
        const productsData = await productsResponse.json();

        const activeProducts = productsData.filter(
          (product) => product.deleted === false
        );
        const totalActiveProducts = activeProducts.length;
        setTotalProductosActivos(totalActiveProducts);
      } catch (error) {
        console.error("Error al obtener los datos de productos:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Realiza una solicitud HTTP para obtener los datos de productos
    const fetchDeletedProducts = async () => {
      try {
        const productsDeletedResponse = await fetch(`${back}products-deleted`);
        const productsDeletedData = await productsDeletedResponse.json();

        const inactiveProducts = productsDeletedData.filter(
          (product) => product.deleted === true
        );
        const totalInactiveProducts = inactiveProducts.length;
        setTotalProductosInactivos(totalInactiveProducts);
      } catch (error) {
        console.error("Error al obtener los datos de productos:", error);
      }
    };

    fetchDeletedProducts();
  }, []);

  return (
    <div>
      <h2>ESTADISTICAS</h2>
      <div className={styles.cardsContainer}>
        <div className={`${styles.StatsCard} ${styles.card1}`}>
          <h3 className={styles.cardTitle}>Ventas: </h3>
          <h2>{totalVentas}</h2>
          <p>Total de ventas realizadas hasta la fecha.</p>
        </div>
        <div className={`${styles.StatsCard} ${styles.card2}`}>
          <h3 className={styles.cardTitle}>Ingresos: </h3>
          <h2>${totalIngresos.toFixed(2)}</h2>
          <p>Total generado por todas las ventas hasta la fecha.</p>
        </div>
        <div className={`${styles.StatsCard} ${styles.card3}`}>
          <h3 className={styles.cardTitle}>Productos Activos: </h3>
          <h2>{totalProductosActivos}</h2>
          <p>Productos actualmente disponibles y activos en la plataforma.</p>
        </div>
        <div className={`${styles.StatsCard} ${styles.card4}`}>
          <h3 className={styles.cardTitle}>Productos Inactivos: </h3>
          <h2>{totalProductosInactivos}</h2>
          <p>
            Productos que fueron desactivados o eliminados de la plataforma.
          </p>
        </div>
        <div className={`${styles.StatsCard} ${styles.card5}`}>
          <h3 className={styles.cardTitle}>Usuarios: </h3>
          <h2>{totalUsuariosRegistrados}</h2>
          <p>Usuarios que se han registrado en la plataforma.</p>
        </div>
        <div className={`${styles.StatsCard} ${styles.card6}`}>
          <h3 className={styles.cardTitle}>Visitas: </h3>
          <h2>{totalVisitas}</h2>
          <p>Total de visitas o interacciones en la plataforma.</p>
        </div>
      </div>

      <div className={styles.bigChartContainer}>
        <div className={styles.chartContainer}>
          <h2>Estadísticas de Ventas</h2>
          <Line data={chartData.ventas} />
        </div>

        <div className={styles.chartContainer}>
          <h2>Usuarios Registrados por Mes</h2>
          <Line data={chartData.usuariosRegistrados} />
        </div>

        <div className={styles.chartContainer}>
          <h2>Revisiones Recibidas</h2>
          <Bar data={chartData.reviews} className={styles.barChart} />
        </div>

        <div className={styles.chartContainer}>
          <h2>Ventas por Categoría</h2>
          <Pie
            data={chartData.ventasPorCategoria}
            options={{ responsive: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
