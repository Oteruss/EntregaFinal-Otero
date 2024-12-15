import { useState, useEffect, useContext } from "react";
import { CarritoContext } from "../../context/CarritoContext";
import { db } from "../../services/config";
import { collection, addDoc, updateDoc, getDoc, doc } from "firebase/firestore";
import './Checkout.css';

const Checkout = () => {
    const { carrito, vaciarCarrito, total, cantidadTotal } = useContext(CarritoContext);

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [emailConfimacion, setEmailConfirmacion] = useState("");
    const [ordenId, setOrdenId] = useState("");
    const [error, setError] = useState("");

    const manejadorSubmit = (event) => {
        event.preventDefault();

        //Verificamos que todos los campos esten completos 
        if (!nombre || !apellido || !telefono || !email || !emailConfimacion) {
            setError("Completa todos los campos por Merlín!");
            return;
        }

        //Validamos que el campo del email coincida: 
        if (email !== emailConfimacion) {
            setError("Los emails no coinciden, sangresucia");
            return;
        }

        //Creamos un objeto con todos los datos de la orden de compra: 

        const orden = {
            items: carrito.map(productos => ({
                id: productos.item.id,
                nombre: productos.item.nombre,
                cantidad: productos.cantidad
            })),
            total: total,
            fecha: new Date(),
            nombre,
            apellido,
            telefono,
            email
        }

        //Vamos a modificar el código para que ejecute varias promesas en parelalo, por un lado que pueda crear la orden de compra y por el otro que actualice el stock: 

        Promise.all(
            orden.items.map(async (productosOrden) => {
                //Por cada productos obtengo una referencia y a partir de esa referencia obtengo el DOC: 
                const productosRef = doc(db, "productos", productosOrden.id);
                const productosDoc = await getDoc(productosRef);
                const stockActual = productosDoc.data().stock;
                //recordemos, data() me permite obtener los datos del documento. 

                await updateDoc(productosRef, {
                    stock: stockActual - productosOrden.cantidad
                })

                //Modifico el stock y subo la info actualizada. 
            })
        )
            //Guardamos en la base de datos la orden: 
            .then(() => {
                addDoc(collection(db, "ordenes"), orden)
                    .then(docRef => {
                        setOrdenId(docRef.id);
                        vaciarCarrito();
                    })
                    .catch(error => console.log("Error al crear la orden ", error))
            })
            .catch(error => {
                console.log("No se pudo actualizar el stock ", error);
                setError("No se pudo actualizar el stock ");
            })
    }


    return (
        <div className='contenedorItem'>
            <h3 className="checkout"> Checkout </h3>

            <div className="contenedorItem p-0">
                <form onSubmit={manejadorSubmit}>
                    {
                        carrito.map(productos => (
                            <div className="item" key={productos.item.id}>
                                <p> {productos.item.nombre} x {productos.cantidad} </p>
                                <p> Precio: $ {productos.item.precio} </p>
                            </div>
                        ))
                    }
                    <div className='contenedorItems'>
                        <div className="item">
                            <label htmlFor=""> Nombre </label>
                            <input type="text" onChange={(e) => setNombre(e.target.value)} />
                        </div>

                        <div className="item">
                            <label htmlFor=""> Apellido </label>
                            <input type="text" onChange={(e) => setApellido(e.target.value)} />
                        </div>

                        <div className="item">
                            <label htmlFor=""> Telefono </label>
                            <input type="text" onChange={(e) => setTelefono(e.target.value)} />
                        </div>

                        <div className="item">
                            <label htmlFor=""> Email </label>
                            <input type="email" onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="item">
                            <label htmlFor=""> Email Confirmación </label>
                            <input type="email" onChange={(e) => setEmailConfirmacion(e.target.value)} />
                        </div>

                        {
                            error && <p style={{ color: "red" }}> {error} </p>
                        }


                    </div>
                    <div className="btn-checkout">
                        <button type="submit"> Finalizar Orden </button>
                    </div>


                    {
                        ordenId && (
                            <strong>¡Gracias por su compra! Tu número de orden es: {ordenId} </strong>
                        )
                    }

                </form>
            </div>
        </div>
    )
}

export default Checkout