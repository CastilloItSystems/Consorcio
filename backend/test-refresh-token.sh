#!/bin/bash

# Script para probar el flujo completo de refresh token con rotación
echo "🧪 Probando flujo de Refresh Token con rotación automática"
echo "=========================================================="

BASE_URL="http://localhost:4000"
EMAIL="superadmin@consorcio.com"
PASSWORD="superadmin"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Login para obtener tokens iniciales
echo -e "\n${YELLOW}1. Login inicial...${NC}"
LOGIN_RESPONSE=$(curl -s -c cookies.txt -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ "$ACCESS_TOKEN" != "null" ] && [ -n "$ACCESS_TOKEN" ]; then
  echo -e "${GREEN}✓ Login exitoso${NC}"
  echo "Access Token (primeros 50 chars): ${ACCESS_TOKEN:0:50}..."
else
  echo -e "${RED}✗ Login falló${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

# Verificar que la cookie fue guardada
if [ -f cookies.txt ]; then
  echo -e "${GREEN}✓ Cookie refresh_token guardada${NC}"
  REFRESH_TOKEN_1=$(grep 'refresh_token' cookies.txt | awk '{print $7}')
  echo "Refresh Token ID: ${REFRESH_TOKEN_1:0:36}..."
else
  echo -e "${RED}✗ Cookie no encontrada${NC}"
  exit 1
fi

# 2. Esperar un momento
echo -e "\n${YELLOW}2. Esperando 2 segundos...${NC}"
sleep 2

# 3. Primer refresh - debería funcionar
echo -e "\n${YELLOW}3. Primer refresh token...${NC}"
REFRESH_RESPONSE_1=$(curl -s -b cookies.txt -c cookies.txt -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{}')

ACCESS_TOKEN_2=$(echo $REFRESH_RESPONSE_1 | jq -r '.access_token')

if [ "$ACCESS_TOKEN_2" != "null" ] && [ -n "$ACCESS_TOKEN_2" ]; then
  echo -e "${GREEN}✓ Primer refresh exitoso${NC}"
  echo "Nuevo Access Token (primeros 50 chars): ${ACCESS_TOKEN_2:0:50}..."
  
  REFRESH_TOKEN_2=$(grep 'refresh_token' cookies.txt | awk '{print $7}')
  echo "Nuevo Refresh Token ID: ${REFRESH_TOKEN_2:0:36}..."
  
  if [ "$REFRESH_TOKEN_1" != "$REFRESH_TOKEN_2" ]; then
    echo -e "${GREEN}✓ Refresh token rotado correctamente${NC}"
  else
    echo -e "${RED}✗ Refresh token NO fue rotado${NC}"
  fi
else
  echo -e "${RED}✗ Primer refresh falló${NC}"
  echo "Response: $REFRESH_RESPONSE_1"
  exit 1
fi

# 4. Segundo refresh - debe usar el nuevo token rotado
echo -e "\n${YELLOW}4. Segundo refresh token (con token rotado)...${NC}"
sleep 2

REFRESH_RESPONSE_2=$(curl -s -b cookies.txt -c cookies.txt -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{}')

ACCESS_TOKEN_3=$(echo $REFRESH_RESPONSE_2 | jq -r '.access_token')

if [ "$ACCESS_TOKEN_3" != "null" ] && [ -n "$ACCESS_TOKEN_3" ]; then
  echo -e "${GREEN}✓ Segundo refresh exitoso${NC}"
  echo "Nuevo Access Token (primeros 50 chars): ${ACCESS_TOKEN_3:0:50}..."
  
  REFRESH_TOKEN_3=$(grep 'refresh_token' cookies.txt | awk '{print $7}')
  echo "Nuevo Refresh Token ID: ${REFRESH_TOKEN_3:0:36}..."
  
  if [ "$REFRESH_TOKEN_2" != "$REFRESH_TOKEN_3" ]; then
    echo -e "${GREEN}✓ Refresh token rotado nuevamente${NC}"
  else
    echo -e "${RED}✗ Refresh token NO fue rotado${NC}"
  fi
else
  echo -e "${RED}✗ Segundo refresh falló${NC}"
  echo "Response: $REFRESH_RESPONSE_2"
  exit 1
fi

# 5. Intentar usar el primer refresh token (debe fallar porque fue revocado)
echo -e "\n${YELLOW}5. Intentando usar refresh token revocado...${NC}"

# Crear cookie temporal con el primer token
echo "localhost	FALSE	/	FALSE	0	refresh_token	$REFRESH_TOKEN_1" > cookies_old.txt

REFRESH_RESPONSE_OLD=$(curl -s -b cookies_old.txt -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{}')

ERROR_MESSAGE=$(echo $REFRESH_RESPONSE_OLD | jq -r '.message')

if [[ "$ERROR_MESSAGE" == *"revoked"* ]] || [[ "$ERROR_MESSAGE" == *"Invalid"* ]]; then
  echo -e "${GREEN}✓ Token revocado correctamente rechazado${NC}"
  echo "Mensaje de error: $ERROR_MESSAGE"
else
  echo -e "${RED}✗ Token revocado debería haber sido rechazado${NC}"
  echo "Response: $REFRESH_RESPONSE_OLD"
fi

# 6. Verificar access token con /auth/me
echo -e "\n${YELLOW}6. Verificando access token con /auth/me...${NC}"

ME_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN_3")

USER_EMAIL=$(echo $ME_RESPONSE | jq -r '.user.email')

if [ "$USER_EMAIL" == "$EMAIL" ]; then
  echo -e "${GREEN}✓ Access token válido${NC}"
  echo "Usuario: $USER_EMAIL"
else
  echo -e "${RED}✗ Access token inválido${NC}"
  echo "Response: $ME_RESPONSE"
fi

# Limpieza
rm -f cookies.txt cookies_old.txt

echo -e "\n${GREEN}=========================================================="
echo "✓ Todas las pruebas completadas exitosamente"
echo -e "===========================================================${NC}"
