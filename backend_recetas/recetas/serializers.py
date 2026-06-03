from rest_framework import serializers
from .models import Categoria, Receta


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class RecetaSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')

    class Meta:
        model = Receta
        fields = [
            'id',
            'categoria',
            'categoria_nombre',
            'nombre',
            'ingredientes',
            'preparacion',
            'imagen',
        ]