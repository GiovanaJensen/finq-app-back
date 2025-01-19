# Web API de Vagas de Estágio - Fatec

Esta é uma Web API desenvolvida em **Node.js** para gerenciar as vagas de estágio direcionadas para os alunos da **Fatec**. A API utiliza o **Prisma** como ORM (Object Relational Mapping) para interagir com o banco de dados e fornecer uma interface RESTful para o aplicativo de vagas.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no backend.
- **Express**: Framework minimalista para construção de APIs em Node.js.
- **Prisma**: ORM para Node.js que facilita a manipulação de dados no banco de dados.
- **SQL**: Banco de dados relacional utilizado para armazenar as informações das vagas e usuários.
- **JWT**: JSON Web Tokens para autenticação e controle de acesso.
- **Dotenv**: Biblioteca para gerenciar variáveis de ambiente.

## Funcionalidades

- **Cadastro de Vagas**: Permite o cadastro de vagas de estágio que podem ser acessadas pelos alunos da Fatec.
- **Busca de Vagas**: Filtragem e busca de vagas com base em critérios como área de atuação, disponibilidade e requisitos.
- **Autenticação de Usuários**: Permite que os alunos se registrem, façam login e acessem as vagas de forma segura.
- **Gerenciamento de Vagas**: Admins podem adicionar, editar e remover vagas de estágio.

## Instalação

### Pré-requisitos

Antes de rodar o projeto, você precisa ter o **Node.js** e o **SQL** instalados.

1. **Node.js**: Você pode verificar se o Node.js está instalado executando `node -v`. Caso não esteja, você pode baixá-lo [aqui](https://nodejs.org/).
   
2. **SQL**: Instale o SQL e crie um banco de dados para o projeto.

### Passos para Instalação

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/GiovanaJensen/finq-app-back.git
   cd finq-app-back
