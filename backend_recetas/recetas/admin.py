from django.contrib import admin
from .models import Categoria, Receta


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'descripcion')


@admin.register(Receta)
class RecetaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'categoria')
    list_filter = ('categoria',)
    search_fields = ('nombre', 'ingredientes')