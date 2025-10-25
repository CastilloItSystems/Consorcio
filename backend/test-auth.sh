#!/bin/bash

# Script para probar la autenticación JWT

BASE_URL="http://localhost:4000"

echo "🔐 Probando Sistema de Autenticación JWT"
echo "=========================================="
echo ""

# 1. Login
echo "1️⃣  Intentando login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ejemplo.com",
    "password": "password123"
  }')

echo "Respuesta:"
echo "$LOGIN_RESPONSE" | jq '.'

# Extraer el token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Error: No se obtuvo el token"
  exit 1
fi

echo ""
echo "✅ Token obtenido: ${TOKEN:0:20}..."
echo ""

# 2. Usar el token para acceder a una ruta protegida (si existe)
echo "2️⃣  Probando acceso a ruta protegida..."
curl -s -X GET "$BASE_URL/protected-route" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "✅ Autenticación configurada correctamente"
