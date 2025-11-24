# GuardianISP - AI Network Monitoring

Sistema de monitoramento profissional para ISPs, integrando IA, análise de NetFlow e proteção DDoS.

## 🚀 Como Rodar (Docker)

### Pré-requisitos
- Docker & Docker Compose
- Debian 12/13 ou Ubuntu 22.04+

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/Guardin-ISP.git
cd Guardin-ISP
```

2. Suba o ambiente:
```bash
docker compose up -d --build
```

3. Acesse:
Abra `http://localhost` ou o IP do servidor no navegador.

## 🛠 Desenvolvimento

Para rodar localmente sem Docker (requer Node.js 18+):

```bash
npm install
npm run dev
```

## 🏗 Estrutura

- **Frontend:** React + Vite + TailwindCSS
- **Database:** TimescaleDB (PostgreSQL)
- **Cache:** Redis
- **Search/Logs:** ElasticSearch
