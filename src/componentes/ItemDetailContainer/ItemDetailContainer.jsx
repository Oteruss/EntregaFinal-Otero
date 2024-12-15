import { useState, useEffect } from "react";
import ItemDetail from "../ItemDetail/ItemDetail";
import { useParams } from "react-router-dom";
import { db } from "../../services/config";
import { getDoc, doc } from "firebase/firestore";


const ItemDetailContainer = () => {
  const [productos, setproductos] = useState(null);
  const { idItem } = useParams();

  useEffect(() => {
    const nuevoDoc = doc(db, "productos", idItem);

    getDoc(nuevoDoc)
      .then(res => {
        const data = res.data();
        const nuevoproductos = { id: res.id, ...data };
        setproductos(nuevoproductos);
      })
      .catch(error => console.log("Estás en la sección prohibida.", error))
  }, [idItem])

  return (
    <div>
      <ItemDetail {...productos} />
    </div>
  )
}

export default ItemDetailContainer