import { useState, useEffect } from "react";
import ItemList from "../ItemList/ItemList";
import { useParams } from "react-router-dom";
import { db } from "../../services/config";
import { collection, getDocs, where, query } from "firebase/firestore";
import './ItemListContainer.css';

const ItemListContainer = () => {
  const [productes, setproductes] = useState([]);
  const { idCategoria } = useParams();

  useEffect(() => {
    const misproductes = idCategoria ? query(collection(db, "productos"), where("idCat", "==", idCategoria)) : collection(db, "productos");

    getDocs(misproductes)
      .then(res => {
        const nuevosproductes = res.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data }
        })
        setproductes(nuevosproductes);
      })
      .catch(error => console.log("Muggle alert! Esta página no puede ser vista", error))
  }, [idCategoria])

  return (
    <div>
      <h2 className="titulo-tienda">Tienda mágica</h2>
      <ItemList productes={productes} />
    </div>
  )
}

export default ItemListContainer