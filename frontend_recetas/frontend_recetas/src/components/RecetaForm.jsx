import { useEffect, useState } from "react";

function RecetaForm({ categorias, recetaEditando, onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState({
    categoria: "",
    nombre: "",
    ingredientes: "",
    preparacion: "",
    imagen: null,
  });

  useEffect(() => {
    if (recetaEditando) {
      setFormulario({
        categoria: recetaEditando.categoria || "",
        nombre: recetaEditando.nombre || "",
        ingredientes: recetaEditando.ingredientes || "",
        preparacion: recetaEditando.preparacion || "",
        imagen: null,
      });
    } else {
      setFormulario({
        categoria: "",
        nombre: "",
        ingredientes: "",
        preparacion: "",
        imagen: null,
      });
    }
  }, [recetaEditando]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const manejarImagen = (e) => {
    setFormulario({
      ...formulario,
      imagen: e.target.files[0],
    });
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    if (
      !formulario.categoria ||
      !formulario.nombre.trim() ||
      !formulario.ingredientes.trim() ||
      !formulario.preparacion.trim()
    ) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const datos = new FormData();
    datos.append("categoria", formulario.categoria);
    datos.append("nombre", formulario.nombre);
    datos.append("ingredientes", formulario.ingredientes);
    datos.append("preparacion", formulario.preparacion);

    if (formulario.imagen) {
      datos.append("imagen", formulario.imagen);
    }

    onGuardar(datos);
  };

  return (
    <form
      onSubmit={manejarSubmit}
      className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-orange-100"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {recetaEditando ? "Editar receta" : "Agregar receta"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Categoría
          </label>
          <select
            name="categoria"
            value={formulario.categoria}
            onChange={manejarCambio}
            className="w-full border rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Ejemplo: Arroz con leche"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Ingredientes
          </label>
          <textarea
            name="ingredientes"
            value={formulario.ingredientes}
            onChange={manejarCambio}
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Ejemplo: arroz, leche, azúcar, canela..."
            rows="3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Preparación
          </label>
          <textarea
            name="preparacion"
            value={formulario.preparacion}
            onChange={manejarCambio}
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Describe los pasos de preparación"
            rows="4"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Imagen
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={manejarImagen}
            className="w-full border rounded-xl px-4 py-2 bg-white"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl font-semibold"
        >
          {recetaEditando ? "Actualizar" : "Guardar"}
        </button>

        {recetaEditando && (
          <button
            type="button"
            onClick={onCancelar}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-xl font-semibold"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default RecetaForm;