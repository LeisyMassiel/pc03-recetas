import { useEffect, useState } from "react";

function CategoriaForm({ categoriaEditando, onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    imagen: null,
  });

  useEffect(() => {
    if (categoriaEditando) {
      setFormulario({
        nombre: categoriaEditando.nombre || "",
        descripcion: categoriaEditando.descripcion || "",
        imagen: null,
      });
    } else {
      setFormulario({
        nombre: "",
        descripcion: "",
        imagen: null,
      });
    }
  }, [categoriaEditando]);

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

    if (!formulario.nombre.trim() || !formulario.descripcion.trim()) {
      alert("Completa el nombre y la descripción.");
      return;
    }

    const datos = new FormData();
    datos.append("nombre", formulario.nombre);
    datos.append("descripcion", formulario.descripcion);

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
        {categoriaEditando ? "Editar categoría" : "Agregar categoría"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="Ejemplo: Postres"
          />
        </div>

        <div>
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

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Describe la categoría"
            rows="3"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl font-semibold"
        >
          {categoriaEditando ? "Actualizar" : "Guardar"}
        </button>

        {categoriaEditando && (
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

export default CategoriaForm;