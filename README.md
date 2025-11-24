# GuardianISP - Sistema de Monitoramento

Sistema de monitoramento de alta performance para Provedores de Internet (ISP), com suporte a NetFlow, IA e mitigação DDoS.

## 🚀 Instalação em Laboratório (Debian 13)

Siga os passos abaixo para rodar o sistema completo em seu servidor de laboratório.

### 1. Preparar o Sistema Operacional
Abra o terminal no seu Debian 13 e execute como **root** (ou use `sudo`):

```bash
# Atualizar repositórios e sistema
apt update && apt upgrade -y

# Instalar dependências básicas
apt install -y ca-certificates curl gnupg git
```

### 2. Instalar Docker e Docker Compose
No Debian 13 (Trixie), podemos usar o repositório oficial ou o script de conveniência:

```bash
# Instalar Docker via script oficial (método mais rápido para labs)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Habilitar e iniciar o serviço
systemctl enable docker
systemctl start docker
```

### 3. Clonar o Repositório
Baixe o código fonte do GuardianISP:

```bash
# Entrar no diretório home ou opt
cd /opt

# Clonar repositório
git clone https://github.com/jabrayan/Guardin-ISP.git

# Entrar na pasta
cd Guardin-ISP
```

### 4. Executar o Sistema
O projeto já conta com um `docker-compose.yml` configurado.

```bash
# Subir os containers em modo daemon (background)
docker compose up -d --build
```

### 5. Acessar
Após alguns instantes, o sistema estará disponível no IP do seu servidor:

*   **Frontend:** `http://SEU_IP_DEBIAN/`
*   **Banco de Dados:** Porta `5432`
*   **ElasticSearch:** Porta `9200`

---

## 🛠 Comandos Úteis

*   **Ver logs:** `docker compose logs -f`
*   **Parar sistema:** `docker compose down`
*   **Reiniciar serviços:** `docker compose restart`
