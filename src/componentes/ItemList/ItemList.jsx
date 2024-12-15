import Item from "../Item/Item";
import './ItemList.css';

const ItemList = ({ productes }) => {
  return (
    <div className="contenedorproductes">
      {
        productes.map(productos => <Item key={productos.id} {...productos} />)
      }
    </div>
  )
}

export default ItemList