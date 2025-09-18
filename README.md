#  Acervo Virtual

Este é o projeto do sistema Acervo Digital para o Projeto Aplicado III, desenvolvido em Django.
O sistema permite que bibliotecários e administradores gerenciem o cadastro de livros e leitores, controlando empréstimos, reservas, devoluções, multas e o estoque de livros. 
A interface de usuário intuitiva facilita o acesso e a organização das informações, garantindo um controle eficiente do acervo.

---

##  Tecnologias Utilizadas
- **Python**: Linguagem de programação principal.
- **Django**: Framework web para o desenvolvimento do back-end.
- **HTML, CSS e JavaScript**: Para a criação da interface de usuário (front-end).
- **SQLite**: Banco de dados padrão do Django, ideal para o desenvolvimento.

---

##  Pré-requisitos
- **Git** – Para clonar o repositório.
- **Python** – Com o ambiente de desenvolvimento configurado (versão 3.x recomendada).
- **pip** – Gerenciador de pacotes do Python.

---

##  Clonar o Repositório

Abra o terminal em seu computador e use o comando:

```bash
git clone https://github.com/23Aline/biblioteca_virtual.git
```

Em seguida:

```bash
cd acervo_digital
```

---

##  Configurar o Ambiente Virtual

É uma boa prática criar um ambiente virtual para isolar as dependências do projeto.

```bash
python -m venv venv
```

Ative o ambiente virtual:
- **Windows**
```bash
venv\Scripts\activate
```
- **macOS/Linux**
```bash
source venv/bin/activate
```

---

## Instalar as Dependências

Com o ambiente virtual ativado, instale todas as bibliotecas e dependências necessárias:

```bash
pip install -r requirements.txt
```

---

## Executar o Projeto

1. Aplique as migrações do banco de dados para criar as tabelas necessárias:

```bash
python manage.py migrate
```

2. Por fim, inicie o servidor de desenvolvimento:

```bash
python manage.py runserver
```

O projeto estará acessível no link disponível no terminal.

3. Usuário e senha para o login:
   
- **Usuário**: acervo_virtual
- **Senha**: Biblioteca123*


