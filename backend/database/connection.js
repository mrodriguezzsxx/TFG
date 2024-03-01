const db = require("mongoose");

const connection = async() => {

    try {

        await db.connect("mongodb+srv://root:5YBcY3ipMZIocw6R@cluster0.gxpyquf.mongodb.net/?retryWrites=true&w=majority");

        console.log("Conexion exitosa");

    }catch(error) {
        throw new Error("No se ha podido conectar a la BBDD: ", error);
    }
}

module.exports = connection;