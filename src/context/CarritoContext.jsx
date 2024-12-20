import { useState, createContext } from "react";

export const CarritoContext = createContext({
    carrito: [],
    total: 0,
    cantidadTotal: 0
})
export const CarritoProvider = ({ children }) => {
    //Creamos los estados: 
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);
    const [cantidadTotal, setCantidadTotal] = useState(0);

    //Verificamos por consola:  (después lo borramos)
    console.log(carrito);
    console.log("Cantidad Items: ", cantidadTotal);
    console.log("Precio total de la compra: ", total);

    const agregarAlCarrito = (item, cantidad) => {
        const productosExistente = carrito.find(prod => prod.item.id === item.id);

        if (!productosExistente) {
            setCarrito(prev => [...prev, { item, cantidad }]);
            setCantidadTotal(prev => prev + cantidad);
            setTotal(prev => prev + (item.precio * cantidad));
            //La sintaxis: prev => [...prev, {item, cantidad}] se utiliza para crear un nuevo array a partir del estado anterior del carrito y agregar un nuevo objeto que representa el productos agregado. 
        } else {
            const carritoActualizado = carrito.map(prod => {
                if (prod.item.id === item.id) {
                    return { ...prod, cantidad: prod.cantidad + cantidad };
                } else {
                    return prod;
                }
            })
            setCarrito(carritoActualizado);
            setCantidadTotal(prev => prev + cantidad);
            setTotal(prev => prev + (item.precio * cantidad));
        }
    }

    const eliminarproductos = (id) => {
        const productosEliminado = carrito.find(prod => prod.item.id === id);
        const carritoActualizado = carrito.filter(prod => prod.item.id !== id);

        setCarrito(carritoActualizado);
        setCantidadTotal(prev => prev - productosEliminado.cantidad);
        setTotal(prev => prev - (productosEliminado.item.precio * productosEliminado.cantidad));
    }

    const vaciarCarrito = () => {
        setCarrito([]);
        setCantidadTotal(0);
        setTotal(0);
    }

    return (
        <CarritoContext.Provider value={{ carrito, total, cantidadTotal, agregarAlCarrito, eliminarproductos, vaciarCarrito }}>
            {children}
        </CarritoContext.Provider>
    )
}

