# GuardianISP - Sistema de Monitoramento (Lab Edition)

Sistema de monitoramento ISP rodando em Docker, configurado para ambiente de laboratório (HTTP Porta 80).

## 📋 Requisitos

*   Debian 13 (Trixie) ou Debian 12 (Bookworm)
*   Acesso Root
*   Conexão com Internet

## 🚀 Instalação Completa no Debian 13

Siga este roteiro linha por linha no seu terminal.

### 1. Preparação do Sistema
Atualize os repositórios e instale as dependências básicas:

```bash
apt update && apt upgrade -y
apt install -y curl git gnupg ca-certificates lsb-release
```

### 2. Instalação do Docker
A maneira mais segura de instalar no Debian Testing/Unstable (13) é usando o script oficial:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Verifique se o Docker está rodando:
```bash
systemctl start docker
systemctl enable docker
docker --version
```

### 3. Configuração do Projeto
Entre na pasta onde você clonou o projeto (ou crie uma nova):

```bash
mkdir -p /opt/Guardin-ISP
cd /opt/Guardin-ISP
```

**IMPORTANTE:** Se você não tem os arquivos `docker-compose.yml` ou `nginx.conf` nesta pasta (o erro que você viu antes), crie e execute o script de setup:

1.  Crie o arquivo do script:
    ```bash
    nano setup_lab.sh
    ```
2.  Cole o conteúdo do arquivo `setup_lab.sh` (fornecido na documentação/chat).
3.  Salve (Ctrl+O, Enter) e saia (Ctrl+X).
4.  Execute:
    ```bash
    chmod +x setup_lab.sh
    ./setup_lab.sh
    ```

### 4. Execução
Agora que os arquivos de configuração existem, suba o ambiente:

```bash
docker compose up -d --build
```

### 5. Acesso
Abra seu navegador e acesse o IP do servidor:
`http://SEU_IP_DEBIAN/`

---

## 🛠 Comandos de Manutenção

*   **Verificar logs em tempo real:**
    ```bash
    docker compose logs -f
    ```
*   **Parar e remover tudo:**
    ```bash
    docker compose down
    ```
*   **Reiniciar apenas o frontend:**
    ```bash
    docker compose restart frontend
    ```
