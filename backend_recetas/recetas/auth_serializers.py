from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        username = data["username"].strip()
        email = data["email"].strip().lower()

        if not username:
            raise serializers.ValidationError({
                "username": "Ingresa un nombre de usuario válido."
            })

        if data["password"] != data["password2"]:
            raise serializers.ValidationError({
                "password": "Las contraseñas no coinciden."
            })

        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({
                "username": "Este usuario ya existe. Intenta con otro nombre."
            })

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({
                "email": "Este correo ya está registrado."
            })

        data["username_final"] = username
        data["email_final"] = email

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username_final"],
            email=validated_data["email_final"],
            password=validated_data["password"]
        )

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]