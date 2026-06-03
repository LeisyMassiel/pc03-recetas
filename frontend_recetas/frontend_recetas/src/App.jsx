import { useEffect, useState } from "react";
import { API_URL } from "./services/api";
import CategoriaForm from "./components/CategoriaForm";
import RecetaForm from "./components/RecetaForm";

function App() {
  const [categorias, setCategorias] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [recetaEditando, setRecetaEditando] = useState(null);

  const [seccionActiva, setSeccionActiva] = useState("inicio");

  const obtenerDatos = async () => {
    try {
      const respuestaCategorias = await fetch(`${API_URL}/categorias/`);
      const datosCategorias = await respuestaCategorias.json();

      const respuestaRecetas = await fetch(`${API_URL}/recetas/`);
      const datosRecetas = await respuestaRecetas.json();

      setCategorias(datosCategorias);
      setRecetas(datosRecetas);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const guardarCategoria = async (datos) => {
    try {
      const url = categoriaEditando
        ? `${API_URL}/categorias/${categoriaEditando.id}/`
        : `${API_URL}/categorias/`;

      const metodo = categoriaEditando ? "PATCH" : "POST";

      const respuesta = await fetch(url, {
        method: metodo,
        body: datos,
      });

      if (!respuesta.ok) {
        throw new Error("Error al guardar la categoría");
      }

      await obtenerDatos();
      setCategoriaEditando(null);
      alert(categoriaEditando ? "Categoría actualizada" : "Categoría registrada");
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la categoría.");
    }
  };

  const eliminarCategoria = async (id) => {
    const confirmar = confirm(
      "¿Seguro que deseas eliminar esta categoría? También se eliminarán sus recetas relacionadas."
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(`${API_URL}/categorias/${id}/`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("Error al eliminar la categoría");
      }

      await obtenerDatos();
      alert("Categoría eliminada");
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la categoría.");
    }
  };

  const guardarReceta = async (datos) => {
    try {
      const url = recetaEditando
        ? `${API_URL}/recetas/${recetaEditando.id}/`
        : `${API_URL}/recetas/`;

      const metodo = recetaEditando ? "PATCH" : "POST";

      const respuesta = await fetch(url, {
        method: metodo,
        body: datos,
      });

      if (!respuesta.ok) {
        throw new Error("Error al guardar la receta");
      }

      await obtenerDatos();
      setRecetaEditando(null);
      alert(recetaEditando ? "Receta actualizada" : "Receta registrada");
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la receta.");
    }
  };

  const eliminarReceta = async (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar esta receta?");

    if (!confirmar) return;

    try {
      const respuesta = await fetch(`${API_URL}/recetas/${id}/`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("Error al eliminar la receta");
      }

      await obtenerDatos();
      alert("Receta eliminada");
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la receta.");
    }
  };

  const cambiarSeccion = (seccion) => {
    setSeccionActiva(seccion);
    setCategoriaEditando(null);
    setRecetaEditando(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-orange-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            Sistema de Recetas
          </h1>
          <p className="text-orange-100 mt-1">
            Aplicación web con Django REST Framework, React y Tailwind CSS
          </p>
        </div>

        <nav className="bg-orange-700">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => cambiarSeccion("inicio")}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                seccionActiva === "inicio"
                  ? "bg-white text-orange-700"
                  : "bg-orange-600 text-white hover:bg-orange-500"
              }`}
            >
              Inicio
            </button>

            <button
              onClick={() => cambiarSeccion("categorias")}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                seccionActiva === "categorias"
                  ? "bg-white text-orange-700"
                  : "bg-orange-600 text-white hover:bg-orange-500"
              }`}
            >
              Categorías
            </button>

            <button
              onClick={() => cambiarSeccion("recetas")}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                seccionActiva === "recetas"
                  ? "bg-white text-orange-700"
                  : "bg-orange-600 text-white hover:bg-orange-500"
              }`}
            >
              Recetas
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {cargando ? (
          <p className="text-center text-gray-600">Cargando datos...</p>
        ) : (
          <>
            {seccionActiva === "inicio" && (
              <section className="bg-white rounded-2xl shadow-md p-8 border border-orange-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Bienvenido al Sistema de Recetas
                </h2>

                <p className="text-gray-600 mb-6">
                  Esta aplicación permite gestionar categorías y recetas usando
                  Django REST Framework como backend y React con Tailwind CSS
                  como frontend.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-orange-600">
                      Categorías registradas
                    </h3>
                    <p className="text-4xl font-bold text-gray-800 mt-3">
                      {categorias.length}
                    </p>
                    <button
                      onClick={() => cambiarSeccion("categorias")}
                      className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl font-semibold"
                    >
                      Ver categorías
                    </button>
                  </div>

                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-orange-600">
                      Recetas registradas
                    </h3>
                    <p className="text-4xl font-bold text-gray-800 mt-3">
                      {recetas.length}
                    </p>
                    <button
                      onClick={() => cambiarSeccion("recetas")}
                      className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl font-semibold"
                    >
                      Ver recetas
                    </button>
                  </div>
                </div>
              </section>
            )}

            {seccionActiva === "categorias" && (
              <>
                <CategoriaForm
                  categoriaEditando={categoriaEditando}
                  onGuardar={guardarCategoria}
                  onCancelar={() => setCategoriaEditando(null)}
                />

                <section>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Categorías
                    </h2>

                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm w-fit">
                      Total: {categorias.length}
                    </span>
                  </div>

                  {categorias.length === 0 ? (
                    <p className="text-gray-600">
                      No hay categorías registradas.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categorias.map((categoria) => (
                        <div
                          key={categoria.id}
                          className="bg-white rounded-2xl shadow-md overflow-hidden border border-orange-100"
                        >
                          {categoria.imagen && (
                            <img
                              src={categoria.imagen}
                              alt={categoria.nombre}
                              className="w-full h-48 object-cover"
                            />
                          )}

                          <div className="p-5">
                            <h3 className="text-xl font-bold text-orange-600">
                              {categoria.nombre}
                            </h3>

                            <p className="text-gray-600 mt-2 line-clamp-3">
                              {categoria.descripcion}
                            </p>

                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => {
                                  setCategoriaEditando(categoria);
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                              >
                                Editar
                              </button>

                              <button
                                onClick={() =>
                                  eliminarCategoria(categoria.id)
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {seccionActiva === "recetas" && (
              <>
                <RecetaForm
                  categorias={categorias}
                  recetaEditando={recetaEditando}
                  onGuardar={guardarReceta}
                  onCancelar={() => setRecetaEditando(null)}
                />

                <section>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Recetas
                    </h2>

                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm w-fit">
                      Total: {recetas.length}
                    </span>
                  </div>

                  {recetas.length === 0 ? (
                    <p className="text-gray-600">
                      No hay recetas registradas.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recetas.map((receta) => (
                        <div
                          key={receta.id}
                          className="bg-white rounded-2xl shadow-md overflow-hidden border border-orange-100"
                        >
                          {receta.imagen && (
                            <img
                              src={receta.imagen}
                              alt={receta.nombre}
                              className="w-full h-48 object-cover"
                            />
                          )}

                          <div className="p-5">
                            <span className="inline-block bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full mb-3">
                              {receta.categoria_nombre}
                            </span>

                            <h3 className="text-xl font-bold text-gray-800">
                              {receta.nombre}
                            </h3>

                            <p className="mt-3 text-gray-700 line-clamp-3">
                              <strong>Ingredientes:</strong>{" "}
                              {receta.ingredientes}
                            </p>

                            <p className="mt-3 text-gray-700 line-clamp-3">
                              <strong>Preparación:</strong>{" "}
                              {receta.preparacion}
                            </p>

                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => {
                                  setRecetaEditando(receta);
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                              >
                                Editar
                              </button>

                              <button
                                onClick={() => eliminarReceta(receta.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;