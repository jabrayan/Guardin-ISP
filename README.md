# GuardianISP - Sistema de Monitoramento

Sistema de monitoramento de alta performance para Provedores de Internet (ISP), com suporte a NetFlow, IA e mitigação DDoS.

## 🚀 Instalação em Laboratório (Debian 13)

### Método Rápido (Se o git clone estiver vazio)

Se você clonou o repositório e os arquivos `docker-compose.yml`, `nginx.conf` ou `Dockerfile` não apareceram (porque não foram enviados ao GitHub ainda), siga este passo:

1.  Crie o script de setup no servidor:
    ```bash
    nano setup_lab.sh
    # Cole o conteúdo do arquivo setup_lab.sh fornecido
    ```
2.  Execute o script:
    ```bash
    chmod +x setup_lab.sh
    ./setup_lab.sh
    ```
3.  Suba os containers:
    ```bash
    docker compose up -d --build
    ```

### Método Padrão

1.  **Preparar o Sistema**
    ```bash
    apt update && apt upgrade -y
    apt install -y ca-certificates curl gnupg git
    ```

2.  **Instalar Docker**
    ```bash
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    ```

3.  **Rodar o Projeto**
    ```bash
    cd /opt/Guardin-ISP
    docker compose up -d --build
    ```

## 🛠 Comandos Úteis

*   **Ver logs:** `docker compose logs -f`
*   **Parar sistema:** `docker compose down`
*   **Status:** `docker compose ps`
