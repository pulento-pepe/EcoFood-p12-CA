import CardProducto from '../components/CardProductos';
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";

useEffect(() => {
    const fetch = async () => {
    const datos = await getUserData(user.uid);
    setUserData(datos);
    };
    if (user) fetch();
    }, [user])

function Home() {
    return (
        <div className="container mt-4">
            <h1>Productos Disponibles</h1>
            <CardProducto nombre="Pan Integral" precio="$500" />
            <CardProducto nombre="Pan Integral" precio="$500" />
            <CardProducto nombre="Pan 22222" precio="$500" />
        </div>
    );
}

export default Home;