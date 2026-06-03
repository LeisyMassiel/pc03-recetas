import { useEffect, useState } from "react";
import { API_URL } from "./config/api";

function App() {
  const [vista, setVista] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [categorias, setCategorias] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [categoriaForm, setCategoriaForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    imagen: null,
  });

  const [recetaForm, setRecetaForm] = useState({
    id: null,
    categoria: "",
    nombre: "",
    ingredientes: "",
    preparacion: "",
    imagen: null,
  });

  useEffect(() => {
    if (token) {
      cargarDatos();
      setVista("dashboard");
    }
  }, [token]);

  const authHeaders = () => ({
    Authorization: `Token ${token}`,
  });

  const cargarDatos = async () => {
    try {
      const resCat = await fetch(`${API_URL}/categorias/`);
      const dataCat = await resCat.json();
      setCategorias(dataCat);

      const resRec = await fetch(`${API_URL}/recetas/`);
      const dataRec = await resRec.json();
      setRecetas(dataRec);
    } catch (error) {
      console.log("Error al cargar datos:", error);
    }
  };

  const login = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      setVista("dashboard");
    } else {
      const mensaje =
        data.error ||
        data.detail ||
        "Usuario, correo o contraseña incorrectos.";

      alert(mensaje);
    }
  };

  const register = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registro exitoso. Ahora inicia sesión.");

      setRegisterData({
        username: "",
        email: "",
        password: "",
        password2: "",
      });

      setLoginData({
        username: data.user.email,
        password: "",
      });

      setVista("login");
    } else {
      const mensaje =
        data.username?.[0] ||
        data.email?.[0] ||
        data.password?.[0] ||
        data.non_field_errors?.[0] ||
        "No se pudo registrar. Revisa los datos.";

      alert(mensaje);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);
    setVista("login");

    setLoginData({
      username: "",
      password: "",
    });
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", categoriaForm.nombre);
    formData.append("descripcion", categoriaForm.descripcion);

    if (categoriaForm.imagen) {
      formData.append("imagen", categoriaForm.imagen);
    }

    const url = categoriaForm.id
      ? `${API_URL}/categorias/${categoriaForm.id}/`
      : `${API_URL}/categorias/`;

    const method = categoriaForm.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: formData,
    });

    if (res.ok) {
      limpiarCategoriaForm();
      await cargarDatos();
      setVista("categorias");
    } else {
      alert("Error al guardar categoría.");
    }
  };

  const editarCategoria = (categoria) => {
    setCategoriaForm({
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      imagen: null,
    });

    setVista("formCategoria");
  };

  const eliminarCategoria = async (id) => {
    const confirmar = confirm("¿Deseas eliminar esta categoría?");

    if (!confirmar) return;

    const res = await fetch(`${API_URL}/categorias/${id}/`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (res.ok) {
      await cargarDatos();
    } else {
      alert("No se pudo eliminar la categoría.");
    }
  };

  const limpiarCategoriaForm = () => {
    setCategoriaForm({
      id: null,
      nombre: "",
      descripcion: "",
      imagen: null,
    });
  };

  const guardarReceta = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("categoria", recetaForm.categoria);
    formData.append("nombre", recetaForm.nombre);
    formData.append("ingredientes", recetaForm.ingredientes);
    formData.append("preparacion", recetaForm.preparacion);

    if (recetaForm.imagen) {
      formData.append("imagen", recetaForm.imagen);
    }

    const url = recetaForm.id
      ? `${API_URL}/recetas/${recetaForm.id}/`
      : `${API_URL}/recetas/`;

    const method = recetaForm.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: formData,
    });

    if (res.ok) {
      limpiarRecetaForm();
      await cargarDatos();
      setVista("recetas");
    } else {
      alert("Error al guardar receta.");
    }
  };

  const verDetalleReceta = (receta) => {
    setRecetaSeleccionada(receta);
    setVista("detalleReceta");
  };

  const editarReceta = (receta) => {
    setRecetaForm({
      id: receta.id,
      categoria: receta.categoria,
      nombre: receta.nombre,
      ingredientes: receta.ingredientes,
      preparacion: receta.preparacion,
      imagen: null,
    });

    setVista("formReceta");
  };

  const eliminarReceta = async (id) => {
    const confirmar = confirm("¿Deseas eliminar esta receta?");

    if (!confirmar) return;

    const res = await fetch(`${API_URL}/recetas/${id}/`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (res.ok) {
      setRecetaSeleccionada(null);
      await cargarDatos();
      setVista("recetas");
    } else {
      alert("No se pudo eliminar la receta.");
    }
  };

  const limpiarRecetaForm = () => {
    setRecetaForm({
      id: null,
      categoria: "",
      nombre: "",
      ingredientes: "",
      preparacion: "",
      imagen: null,
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-orange-600 text-center mb-2">
            Sistema de Recetas
          </h1>

          <p className="text-center text-gray-600 mb-6">
            Regístrate o inicia sesión para ingresar al panel
          </p>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setVista("login")}
              className={`w-1/2 py-3 rounded-xl font-bold ${
                vista === "login"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setVista("register")}
              className={`w-1/2 py-3 rounded-xl font-bold ${
                vista === "register"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              Register
            </button>
          </div>

          {vista === "login" && (
            <form onSubmit={login} className="space-y-4">
              <input
                type="text"
                placeholder="Usuario o correo"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                className="input"
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="input"
                required
              />

              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold">
                Ingresar
              </button>
            </form>
          )}

          {vista === "register" && (
            <form onSubmit={register} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
                className="input"
                required
              />

              <input
                type="email"
                placeholder="Correo"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                className="input"
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                className="input"
                required
              />

              <input
                type="password"
                placeholder="Repetir contraseña"
                value={registerData.password2}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password2: e.target.value,
                  })
                }
                className="input"
                required
              />

              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold">
                Registrarme
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold">Sistema de Recetas</h1>
          <p className="mt-2">
            Aplicación web con Django REST Framework, React y Tailwind CSS
          </p>
        </div>

        <nav className="bg-orange-700">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setVista("dashboard")} className="btn-nav">
                Inicio
              </button>

              <button onClick={() => setVista("categorias")} className="btn-nav">
                Categorías
              </button>

              <button
                onClick={() => {
                  limpiarCategoriaForm();
                  setVista("formCategoria");
                }}
                className="btn-nav"
              >
                Agregar categoría
              </button>

              <button onClick={() => setVista("recetas")} className="btn-nav">
                Recetas
              </button>

              <button
                onClick={() => {
                  limpiarRecetaForm();
                  setVista("formReceta");
                }}
                className="btn-nav"
              >
                Agregar receta
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold">{user?.username}</span>

              <button
                onClick={logout}
                className="bg-white text-orange-700 px-4 py-2 rounded-xl font-bold"
              >
                Salir
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {vista === "dashboard" && (
          <section className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-3xl font-bold mb-4">
              Bienvenido al panel de administración
            </h2>

            <p className="text-gray-600 mb-6">
              Desde este panel puedes gestionar categorías y recetas.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-2xl p-6 bg-orange-50">
                <h3 className="text-xl font-bold text-orange-600">
                  Categorías registradas
                </h3>

                <p className="text-4xl font-bold mt-4">
                  {categorias.length}
                </p>

                <button
                  onClick={() => setVista("categorias")}
                  className="btn-primary mt-4"
                >
                  Ver categorías
                </button>
              </div>

              <div className="border rounded-2xl p-6 bg-orange-50">
                <h3 className="text-xl font-bold text-orange-600">
                  Recetas registradas
                </h3>

                <p className="text-4xl font-bold mt-4">{recetas.length}</p>

                <button
                  onClick={() => setVista("recetas")}
                  className="btn-primary mt-4"
                >
                  Ver recetas
                </button>
              </div>
            </div>
          </section>
        )}

        {vista === "categorias" && (
          <section>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold">Categorías</h2>

              <button
                onClick={() => {
                  limpiarCategoriaForm();
                  setVista("formCategoria");
                }}
                className="btn-primary"
              >
                Nueva categoría
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorias.map((categoria) => (
                <div key={categoria.id} className="card">
                  {categoria.imagen && (
                    <img
                      src={categoria.imagen}
                      alt={categoria.nombre}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="text-2xl font-bold text-orange-600">
                      {categoria.nombre}
                    </h3>

                    <p className="text-gray-600 mt-3 line-clamp-3">
                      {categoria.descripcion}
                    </p>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => editarCategoria(categoria)}
                        className="btn-edit"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarCategoria(categoria.id)}
                        className="btn-delete"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {vista === "formCategoria" && (
          <section className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-3xl font-bold mb-6">
              {categoriaForm.id ? "Editar categoría" : "Agregar categoría"}
            </h2>

            <form onSubmit={guardarCategoria} className="space-y-5">
              <input
                type="text"
                placeholder="Nombre"
                value={categoriaForm.nombre}
                onChange={(e) =>
                  setCategoriaForm({ ...categoriaForm, nombre: e.target.value })
                }
                className="input"
                required
              />

              <textarea
                placeholder="Descripción"
                value={categoriaForm.descripcion}
                onChange={(e) =>
                  setCategoriaForm({
                    ...categoriaForm,
                    descripcion: e.target.value,
                  })
                }
                className="input h-28"
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCategoriaForm({
                    ...categoriaForm,
                    imagen: e.target.files[0],
                  })
                }
                className="input"
              />

              <button className="btn-primary">
                {categoriaForm.id ? "Actualizar" : "Guardar"}
              </button>
            </form>
          </section>
        )}

        {vista === "recetas" && (
          <section>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold">Recetas</h2>

              <button
                onClick={() => {
                  limpiarRecetaForm();
                  setVista("formReceta");
                }}
                className="btn-primary"
              >
                Nueva receta
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recetas.map((receta) => (
                <div key={receta.id} className="card">
                  {receta.imagen && (
                    <img
                      src={receta.imagen}
                      alt={receta.nombre}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-5">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                      {receta.categoria_nombre}
                    </span>

                    <h3 className="text-2xl font-bold mt-4">
                      {receta.nombre}
                    </h3>

                    <p className="mt-3 text-gray-700 line-clamp-3">
                      <b>Ingredientes:</b> {receta.ingredientes}
                    </p>

                    <p className="mt-3 text-gray-700 line-clamp-3">
                      <b>Preparación:</b> {receta.preparacion}
                    </p>

                    <button
                      onClick={() => verDetalleReceta(receta)}
                      className="mt-5 w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {vista === "detalleReceta" && recetaSeleccionada && (
          <section className="bg-white rounded-2xl shadow p-8">
            <button
              onClick={() => setVista("recetas")}
              className="mb-6 bg-gray-200 text-gray-800 px-5 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
            >
              ← Volver a recetas
            </button>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                {recetaSeleccionada.imagen && (
                  <img
                    src={recetaSeleccionada.imagen}
                    alt={recetaSeleccionada.nombre}
                    className="w-full h-96 object-cover rounded-2xl shadow"
                  />
                )}
              </div>

              <div>
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold">
                  {recetaSeleccionada.categoria_nombre}
                </span>

                <h2 className="text-4xl font-bold mt-5 text-orange-600">
                  {recetaSeleccionada.nombre}
                </h2>

                <div className="mt-6">
                  <h3 className="text-2xl font-bold mb-3">Ingredientes</h3>
                  <p className="text-gray-700 leading-8 whitespace-pre-line">
                    {recetaSeleccionada.ingredientes}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-2xl font-bold mb-3">Preparación</h3>
                  <p className="text-gray-700 leading-8 whitespace-pre-line">
                    {recetaSeleccionada.preparacion}
                  </p>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => editarReceta(recetaSeleccionada)}
                    className="btn-edit"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarReceta(recetaSeleccionada.id)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {vista === "formReceta" && (
          <section className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-3xl font-bold mb-6">
              {recetaForm.id ? "Editar receta" : "Agregar receta"}
            </h2>

            <form onSubmit={guardarReceta} className="space-y-5">
              <select
                value={recetaForm.categoria}
                onChange={(e) =>
                  setRecetaForm({ ...recetaForm, categoria: e.target.value })
                }
                className="input"
                required
              >
                <option value="">Selecciona una categoría</option>

                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Nombre"
                value={recetaForm.nombre}
                onChange={(e) =>
                  setRecetaForm({ ...recetaForm, nombre: e.target.value })
                }
                className="input"
                required
              />

              <textarea
                placeholder="Ingredientes"
                value={recetaForm.ingredientes}
                onChange={(e) =>
                  setRecetaForm({
                    ...recetaForm,
                    ingredientes: e.target.value,
                  })
                }
                className="input h-28"
                required
              />

              <textarea
                placeholder="Preparación"
                value={recetaForm.preparacion}
                onChange={(e) =>
                  setRecetaForm({
                    ...recetaForm,
                    preparacion: e.target.value,
                  })
                }
                className="input h-28"
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setRecetaForm({
                    ...recetaForm,
                    imagen: e.target.files[0],
                  })
                }
                className="input"
              />

              <button className="btn-primary">
                {recetaForm.id ? "Actualizar" : "Guardar"}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;