from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Categoria, Receta
from .serializers import CategoriaSerializer, RecetaSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by('id')
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.select_related('categoria').all().order_by('id')
    serializer_class = RecetaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]