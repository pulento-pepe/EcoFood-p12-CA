import { useEffect } from "react";

import CardProducto from '../components/CardProductos';
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import CerrarSesion from "../components/CerrarSesion";


function Home() {
    
   /* useEffect(() => {
        const fetch = async () => {
        const datos = await getUserData(user.uid);
        setUserData(datos);
        };
        if (user) fetch();
    }, [user])*/
    return (
        <div className="container mt-4">
            CerrarSesion
            <CerrarSesion />
            <h1>Productos Disponibles</h1>
            <CardProducto nombre="Pan Integral" precio="$500" />
            <CardProducto nombre="Pan Integral" precio="$500" />
            <CardProducto nombre="Pan 22222" precio="$500" />
        </div>
    );
}

export default Home;