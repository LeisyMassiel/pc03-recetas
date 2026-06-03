"""
URL configuration for core project.
"""

from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from recetas.views import CategoriaViewSet, RecetaViewSet

from django.conf import settings
from django.views.static import serve

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'recetas', RecetaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # Ruta para mostrar imágenes subidas en Render
    re_path(r'^media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
]