import { useState } from "react"
import { Pie } from "react-chartjs-2";



export const PieGraph = ({ user }) => {

  const orders = user.orders;
  const categorydata = [];

  for (const order of orders) {
    const category = order.category;
    const existingCategory = categorydata.find(data => data.category === category);

    if (existingCategory) {
      existingCategory.orders++;
    } else {
      categorydata.push({ category: category, orders: 1 });
    }
  }


  const [userData, setUserData] = useState({
    labels: categorydata.map((data) => data.category),
    datasets: [
      {
        label: "Orders",
        data: categorydata.map((data) => data.orders),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
          "#ecf0f1",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });



  return (
    <div style={{ width: 300, height: 300, marginLeft: 50 }}>
      <Pie data={userData} />
    </div>
  )
}