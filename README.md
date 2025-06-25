# Supermarket App
 - Este projeto é uma solução desenvolvida como teste técnico para um sistema de pedidos de supermercado, utilizando backend em Laravel e frontend em React. O objetivo era criar uma aplicação completa, robusta e organizada, capaz de gerenciar produtos, clientes e pedidos com interface amigável. **Importante:** esta aplicação foi criada exclusivamente para fins de avaliação técnica e aprendizado, não sendo indicada como solução final para ambientes de produção.
---

## 💻 **Tecnologias Utilizadas**

- **Frontend:** React (em `/supermarket-client`)
- **Backend:** Laravel (em `/backend`)
- **Banco de Dados:** SQL Server (hospedado remotamente)
- **Hospedagem:** Azure VM ([Acesse aqui](http://34.95.239.164:3000/))

---

## 🚀 **Como rodar o projeto localmente**

### Pré-requisitos

- **Node.js** (v16+ recomendado)
- **npm** ou **yarn**
- **PHP** **8.3.22**  
  **Importante:** O backend exige **PHP 8.3.22** e os **drivers do SQL Server thread safe** instalados e habilitados (`pdo_sqlsrv` e `sqlsrv`).
- **Composer**
- **SQL Server** (ou acesso ao servidor do banco configurado)
- **Extensões PHP para SQL Server** (se rodar localmente)

---

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

---

### 2. Configurando o Backend (Laravel)

```bash
cd backend
cp .env.example .env
```

- **Edite o `.env`** e configure as variáveis de conexão com seu SQL Server.
- **Atenção:** É imprescindível que o PHP seja versão 8.3.22 e que os drivers do SQL Server estejam instalados (thread safe).

#### ⚠️ **IMPORTANTE:**
Se ocorrer erro ao rodar `composer install`, remova a pasta `vendor/` e rode novamente:

```bash
rm -rf vendor/
composer install
```

#### Geração da key e migração do banco

```bash
php artisan key:generate
php artisan migrate
```

#### Rodando o servidor Laravel

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

---

### 3. Configurando o Frontend (React)

```bash
cd ../supermarket-client
cp .env.example .env  # caso exista
npm install
```

- Altere as variáveis de ambiente do React conforme o backend (exemplo: `REACT_APP_API_URL`).

#### Rodando o React

```bash
npm start
```

---

### 4. Acessando a Aplicação

- **Local:** [http://localhost:3000/](http://localhost:3000/)
- **Servidor:** [http://34.95.239.164:3000/](http://34.95.239.164:3000/)

---

## 🏗️ **Sobre a Organização e Decisões do Projeto**

- **Separação clara:**  
  O código foi organizado em dois diretórios principais: `/backend` para o Laravel e `/supermarket-client` para o React, facilitando o desenvolvimento e manutenção isolada de cada parte.

- **API RESTful:**  
  O backend Laravel expõe uma API RESTful, com autenticação e endpoints claros para produtos, pedidos e clientes.

- **Frontend modular:**  
  O React foi estruturado em componentes reutilizáveis para tabela de produtos, formulário de pedido, carrinho, etc, visando clareza e fácil manutenção.

- **Comunicação:**  
  O frontend consome a API usando fetch, e mantém o estado sincronizado com o backend após cada operação.

- **Notificações e UX:**  
  Mensagens de alerta são usadas para feedback rápido ao usuário, e componentes desabilitam/atualizam conforme o estoque.

- **Banco de dados:**  
  Optei pelo SQL Server para explorar integração com ambientes corporativos e garantir robustez.

- **Hospedagem:**  
  O deploy foi realizado em uma VM Azure, com as portas 3000 (React) e 8000 (Laravel) abertas para acesso externo.

- **CORS e Segurança:**  
  O backend está configurado para aceitar requisições do frontend, inclusive de domínios diferentes, tratando CORS adequadamente.

---

## 📝 **Resumo do Processo**

- **Leitura do teste** e análise criteriosa dos requisitos.
- **Planejamento** da arquitetura e divisão de responsabilidades entre frontend e backend.
- **Implementação incremental:** backend primeiro (modelos, migrations, controllers), depois frontend (componentização, integração com API).
- **Testes locais** e deploy em ambiente remoto para garantir acesso externo.
- **Ajustes finos** de segurança (CORS, variáveis de ambiente) e usabilidade (feedback visual, validações).

---

## 📦 **Dica de Instalação dos Drivers SQL Server para PHP 8.3.22**

Para instalar os drivers necessários no Windows:

- [Drivers Microsoft para PHP para SQL Server - Site oficial](https://learn.microsoft.com/pt-br/sql/connect/php/download-drivers-php-sql-server)
- Baixe a versão correta (PHP 8.3 Thread Safe) e coloque as DLLs na pasta `ext` do PHP.
- Adicione no `php.ini`:
  ```
  extension=php_pdo_sqlsrv.dll
  extension=php_sqlsrv.dll
  ```
- Reinicie o servidor web ou terminal.

---
