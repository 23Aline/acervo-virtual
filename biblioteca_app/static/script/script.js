document.addEventListener('DOMContentLoaded', function () {

    const toggleSenha = document.getElementById('toggleSenha');
    const inputSenha = document.getElementById('password');

    if (toggleSenha && inputSenha) {
        toggleSenha.addEventListener('click', () => {
            const tipo = inputSenha.getAttribute('type') === 'password' ? 'text' : 'password';
            inputSenha.setAttribute('type', tipo);

            toggleSenha.classList.toggle('fa-eye');
            toggleSenha.classList.toggle('fa-eye-slash');
        });
    }

    const botoesExcluir = document.querySelectorAll(".btn-excluir");
    botoesExcluir.forEach(botao => {
        botao.addEventListener("click", e => {
            if (!confirm("Tem certeza que deseja excluir?")) {
                e.preventDefault();
            }
        });
    });

    /*MENU LATERAL*/
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const body = document.body;

    if (menuToggle) {
        menuToggle.addEventListener('click', function (event) {
            event.stopPropagation(); 
            body.classList.toggle('menu-open');
        });
    }

    document.addEventListener('click', function (event) {
        if (
            body.classList.contains('menu-open') &&
            !sideMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            body.classList.remove('menu-open');
        }
    });
    const hasSubmenuItems = document.querySelectorAll('.has-submenu > a');

    hasSubmenuItems.forEach(item => {
        item.addEventListener('click', function (event) {
            const parentLi = this.parentElement;

            if (window.innerWidth <= 768 && this.getAttribute('href') === '#') {
                event.preventDefault();
                parentLi.classList.toggle('open');

                document.querySelectorAll('.has-submenu').forEach(otherItem => {
                    if (otherItem !== parentLi && otherItem.classList.contains('open')) {
                        otherItem.classList.remove('open');
                    }
                });
            }
        });
    });

    /*CEP*/
    const urlEmprestimo = window.urlEmprestimo || '/';

    const cepInput = document.getElementById('cep');
    if (cepInput) {
        const enderecoInput = document.getElementById('endereco-edicao') || document.getElementById('endereco');
        const cidadeInput = document.getElementById('cidade-edicao') || document.getElementById('cidade');

        cepInput.addEventListener('blur', () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length === 8) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(res => res.json())
                    .then(data => {
                        if (!data.erro) {
                            enderecoInput.value = `${data.logradouro}, ${data.bairro}`;
                            cidadeInput.value = `${data.localidade} - ${data.uf}`;
                        } else {
                            alert('CEP não encontrado.');
                            enderecoInput.value = '';
                            cidadeInput.value = '';
                        }
                    })
                    .catch(() => {
                        alert('Erro ao buscar o CEP.');
                        enderecoInput.value = '';
                        cidadeInput.value = '';
                    });
            }
        });
    }

    /*BUSCA POR CPF*/
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        const leitorNomeDisplay = document.getElementById('leitor-nome');
        const multaInfoDisplay = document.getElementById('multa-info');

        cpfInput.addEventListener('blur', () => {
            const cpf = cpfInput.value.replace(/\D/g, '');

            if (cpf.length !== 11) {
                leitorNomeDisplay.innerText = '❌ Erro: CPF deve ter 11 dígitos.';
                leitorNomeDisplay.style.color = '#b14942';
                multaInfoDisplay.innerText = '';
                return;
            }
            leitorNomeDisplay.style.color = 'inherit';
            leitorNomeDisplay.innerText = 'Buscando...';

            fetch(`/api/leitor/buscar/?cpf=${cpf}`)
                .then(response => response.json())
                .then(data => {
                    if (data.erro) throw new Error(data.erro);
                    leitorNomeDisplay.innerText = data.nome;
                    multaInfoDisplay.innerText = data.tem_multa ? 'Possui multa por atraso' : 'Não possui multas';
                })
                .catch(error => {
                    leitorNomeDisplay.innerText = error.message;
                    leitorNomeDisplay.style.color = '#b14942';
                    multaInfoDisplay.innerText = 'N/A';
                    console.error('Erro:', error);
                });
        });
    }

    /*BUSCA LIVRO EMPRESTIMO*/
    const livroBuscaInput = document.getElementById('livro-busca');
    if (livroBuscaInput) {
        const livroCapaDisplay = document.getElementById('livro-capa');
        const livroTituloDisplay = document.getElementById('livro-titulo');
        const livroAutorDisplay = document.getElementById('livro-autor');
        const livroEdicaoDisplay = document.getElementById('livro-edicao');
        const livroNumeroPaginasDisplay = document.getElementById('livro-numero_paginas');
        const livroGeneroDisplay = document.getElementById('livro-genero');
        const livroClassificacaoDisplay = document.getElementById('livro-classificacao');
        const modalIndisponivel = document.getElementById('modal-livro-indisponivel');
        const mensagemIndisponivel = document.getElementById('mensagem-indisponivel');

        function fecharModalIndisponivel() { modalIndisponivel.style.display = 'none'; }

        if (modalIndisponivel) {
            modalIndisponivel.querySelectorAll('.fechar-modal, .btn-voltar-modal').forEach(btn => {
                btn.addEventListener('click', fecharModalIndisponivel);
            });
            window.addEventListener('click', (e) => {
                if (e.target === modalIndisponivel) fecharModalIndisponivel();
            });
        }


        livroBuscaInput.addEventListener('change', () => {
            const tituloBusca = livroBuscaInput.value;
            if (tituloBusca) {
                fetch(`/api/livro/completo/?titulo=${encodeURIComponent(tituloBusca)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.erro) throw new Error(data.erro);

                        livroCapaDisplay.src = data.capa || '';
                        livroCapaDisplay.style.display = data.capa ? 'block' : 'none';
                        livroTituloDisplay.innerText = data.titulo;
                        livroAutorDisplay.innerText = data.autor;
                        livroEdicaoDisplay.innerText = `Edição: ${data.edicao}`;
                        livroNumeroPaginasDisplay.innerText = `Páginas: ${data.numero_paginas}`;
                        livroGeneroDisplay.innerText = `Gênero: ${data.genero}`;
                        livroClassificacaoDisplay.innerText = `Classificação: ${data.classificacao}`;

                        if (!data.disponivel) {
                            let msg = "Livro indisponível.";
                            if (data.data_devolucao_proxima) msg += ` Data mais próxima de devolução: ${data.data_devolucao_proxima}`;
                            mensagemIndisponivel.innerText = msg;
                            modalIndisponivel.style.display = 'block';
                        }
                    })
                    .catch(error => {
                        alert(error.message);
                        livroCapaDisplay.style.display = 'none';
                        livroTituloDisplay.innerText = 'Livro não encontrado.';
                        livroAutorDisplay.innerText = '';
                        livroEdicaoDisplay.innerText = '';
                        livroNumeroPaginasDisplay.innerText = '';
                        livroGeneroDisplay.innerText = '';
                        livroClassificacaoDisplay.innerText = '';
                    });
            }
        });
    }

    /*LIMPAR FORMULÁRIO DE EMPRÉSTIMO*/
    const limparBtn = document.querySelector('.btn-limpar');
    if (limparBtn) {
        limparBtn.addEventListener('click', () => {
            const form = document.getElementById('form-emprestimo');
            form.reset();
            ['leitor-nome', 'multa-info', 'livro-capa', 'livro-titulo', 'livro-autor', 'livro-edicao', 'livro-numero_paginas', 'livro-genero', 'livro-classificacao'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (el.tagName === 'IMG') { el.src = ''; el.style.display = 'none'; }
                    else el.innerText = '';
                }
            });
        });
    }

    /*MODAIS*/
    const modalSucesso = document.getElementById("modal-sucesso");
    const modalErro = document.getElementById("modal-erro");

    if (modalSucesso) {
        const mensagemSucesso = modalSucesso.querySelector("#mensagem-sucesso").textContent.trim();
        if (mensagemSucesso) {
            modalSucesso.style.display = "block";
        }
        document.querySelectorAll(".fechar-modal-sucesso, .btn-fechar-modal-sucesso").forEach(function (btn) {
            btn.addEventListener("click", function () {
                modalSucesso.style.display = "none";
            });
        });
    }

    if (modalErro) {
        const mensagemErro = modalErro.querySelector("#mensagem-erro").textContent.trim();
        if (mensagemErro) {
            modalErro.style.display = "block";
        }
        document.querySelectorAll(".fechar-modal-erro, .btn-fechar-modal-erro").forEach(function (btn) {
            btn.addEventListener("click", function () {
                modalErro.style.display = "none";
            });
        });
    }

    /*MODAL DE EDIÇÃO DE LEITOR*/
    const btnsEditarLeitor = document.querySelectorAll(".btn-editar[data-leitor-id]");
    const modalEdicaoLeitor = document.getElementById("modal-edicao-leitor");
    const fecharModalLeitor = modalEdicaoLeitor?.querySelector(".fechar-modal");
    const btnVoltarLeitor = modalEdicaoLeitor?.querySelector(".btn-voltar-modal");

    btnsEditarLeitor.forEach(btn => {
        btn.addEventListener("click", (event) => {
            const tr = event.target.closest("tr");

            document.getElementById("leitor-id-edicao").value = tr.dataset.leitorId;
            document.getElementById("nome-edicao").value = tr.dataset.nome || '';
            document.getElementById("celular-edicao").value = tr.dataset.celular || '';
            document.getElementById("email-edicao").value = tr.dataset.email || '';
            document.getElementById("cep-edicao").value = tr.dataset.cep || '';
            document.getElementById("endereco-edicao").value = tr.dataset.endereco || '';
            document.getElementById("complemento-edicao").value = tr.dataset.complemento || '';
            document.getElementById("cidade-edicao").value = tr.dataset.cidade || '';

            const form = document.getElementById("form-edicao-leitor");
            form.action = `/usuarios/editar/${tr.dataset.leitorId}/`;

            modalEdicaoLeitor.style.display = "block";
        });
    });

    [fecharModalLeitor, btnVoltarLeitor].forEach(el => {
        el?.addEventListener("click", () => {
            modalEdicaoLeitor.style.display = "none";
        });
    });

    window.addEventListener("click", e => {
        if (e.target === modalEdicaoLeitor) {
            modalEdicaoLeitor.style.display = "none";
        }
    });

    /* MODAL DE EDIÇÃO DE LIVRO*/
    const btnsEditarLivro = document.querySelectorAll(".btn-editar:not([data-leitor-id])");
    const modalEdicaoLivro = document.getElementById("modal-edicao");
    const btnFecharLivro = modalEdicaoLivro?.querySelector(".fechar-modal");
    const btnVoltarLivro = modalEdicaoLivro?.querySelector(".btn-voltar-modal");

    btnsEditarLivro.forEach(btn => {
        btn.addEventListener("click", (event) => {
            const tr = event.target.closest("tr");
            const livroId = tr.dataset.livroId;

            document.getElementById("livro-id-edicao").value = livroId;
            document.getElementById("titulo-edicao").value = tr.dataset.livroTitulo || "";
            document.getElementById("autor-edicao").value = tr.dataset.autor || "";
            document.getElementById("genero-edicao").value = tr.dataset.genero || "";
            document.getElementById("edicao-edicao").value = tr.dataset.edicao || "";
            document.getElementById("numero_paginas-edicao").value = tr.dataset.numeroPaginas || "";
            document.getElementById("classificacao-edicao").value = tr.dataset.classificacao || "";
            document.getElementById("sinopse-edicao").value = tr.dataset.sinopse || "";
            document.getElementById("capa-preview").src = tr.dataset.capa || "";
            document.getElementById("quantidade-edicao").value = tr.dataset.quantidade || 0;

            const form = document.getElementById("form-edicao");
            form.action = `/editar_livro/${livroId}/`;

            modalEdicaoLivro.style.display = "block";
        });
    });

    [btnFecharLivro, btnVoltarLivro].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => {
                modalEdicaoLivro.style.display = "none";
            });
        }
    });

    window.addEventListener("click", e => {
        if (e.target === modalEdicaoLivro) {
            modalEdicaoLivro.style.display = "none";
        }
    });

    /*MODAL CONTAS*/
    const btnsEditarConta = document.querySelectorAll('.configuracoes-main .btn-editar');
    const modalEditar = document.getElementById("modal-editar");
    const formEditar = modalEditar ? modalEditar.querySelector('form') : null;

    if (btnsEditarConta.length > 0 && modalEditar && formEditar) {
        btnsEditarConta.forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const email = this.getAttribute('data-email');
                const endereco = this.getAttribute('data-endereco');

                document.getElementById("usuario_id").value = id;
                document.getElementById("modal-email").value = email;
                document.getElementById("modal-endereco").value = endereco;

                modalEditar.style.display = "flex";

            });
        });
    }

    /*MODAL DE DEVOLUÇÃO*/
    const btnsDevolucao = document.querySelectorAll(".btn-devolucao");
    const modalDevolucao = document.getElementById("modal-devolucao");
    const fecharModalDevolucao = modalDevolucao?.querySelector(".fechar-modal");
    const btnVoltarDevolucao = modalDevolucao?.querySelector(".btn-voltar-modal");

    const dataEntregaInput = document.getElementById("data-entrega");
    const valorMultaP = document.getElementById("valor-multa");
    const valorMultaHidden = document.getElementById("valor-multa-hidden");
    const atrasadoP = document.getElementById("atrasado-devolucao");
    const btnPago = document.getElementById("btn-pago");
    const formDevolucao = document.getElementById("form-devolucao");
    const emprestimoIdInput = document.getElementById("emprestimo-id");

    function formatarData(dataStr) {
        if (!dataStr) return '';
        try {
            const [ano, mes, dia] = dataStr.split('-');
            return `${dia}/${mes}/${ano}`;
        } catch (e) {
            console.error("Erro ao formatar a data:", e);
            return dataStr;
        }
    }

    btnsDevolucao.forEach(btn => {
        btn.addEventListener("click", () => {
            const tr = btn.closest("tr");

            const emprestimoId = tr.dataset.emprestimoId;
            const titulo = tr.children[0].textContent;
            const leitor = tr.children[1].textContent;
            const dataEmprestimo = formatarData(tr.dataset.emprestimoData);
            const dataDevolucaoPrevista = formatarData(tr.dataset.emprestimoDevolucao);

            const atrasado = tr.dataset.emprestimoAtrasado === "1" ? "Sim" : "Não";
            const valorMulta = tr.dataset.emprestimoMulta || "0.00";

            emprestimoIdInput.value = emprestimoId;
            document.getElementById("titulo-devolucao").textContent = titulo;
            document.getElementById("leitor-devolucao").textContent = leitor;
            document.getElementById("data-emprestimo-devolucao").textContent = dataEmprestimo;
            document.getElementById("data-devolucao-prevista").textContent = dataDevolucaoPrevista;
            atrasadoP.textContent = atrasado;
            valorMultaP.textContent = valorMulta;
            valorMultaHidden.value = valorMulta;

            const hoje = new Date().toISOString().substring(0, 10);
            dataEntregaInput.value = hoje;

            formDevolucao.action = `/reservas/devolver/${emprestimoId}/`;

            modalDevolucao.style.display = "block";
        });
    });

    [fecharModalDevolucao, btnVoltarDevolucao].forEach(el => {
        el?.addEventListener("click", () => {
            modalDevolucao.style.display = "none";
        });
    });

    window.addEventListener("click", e => {
        if (e.target === modalDevolucao) {
            modalDevolucao.style.display = "none";
        }
    });

    btnPago?.addEventListener("click", () => {
        valorMultaHidden.value = "0.00";
        valorMultaP.textContent = "PAGO";
    });

    /*MODAL DE EDIÇÃO DE CONTA*/
    window.abrirModal = function (id, email, cpf, endereco) {
        document.getElementById("usuario_id").value = id;
        document.getElementById("modal-email").value = email;
        document.getElementById("modal-endereco").value = endereco;
        const modalEditar = document.getElementById("modal-editar");
        if (modalEditar) {
            modalEditar.style.display = "flex";
        }
    };

    window.fecharModal = function () {
        const modalEditar = document.getElementById("modal-editar");
        if (modalEditar) {
            modalEditar.style.display = "none";
        }
    };

    /*TRATAMENTO DE MENSAGENS DJANGO*/
    const djangoMensagensEl = document.getElementById("django-mensagens");
    if (djangoMensagensEl) {
        try {
            const mensagens = JSON.parse(djangoMensagensEl.textContent);
            if (mensagens.length > 0) {
                abrirModalFeedback(mensagens[0].mensagem, mensagens[0].tipo);
            }
        } catch (e) {
            console.error("Erro ao parsear mensagens do Django:", e);
        }
    }

});


window.fecharModalFeedback = function () {
    const modal1 = document.getElementById("modal-feedback");
    if (modal1) { modal1.style.display = "none"; }
}

window.abrirModalFeedback = function (mensagem = null, tipo = null) {
    const modal = document.getElementById("modal-feedback");
    const conteudo = document.getElementById("conteudo-feedback");

    if (mensagem && conteudo) {
        conteudo.innerHTML = `
            <span class="fechar-modal" onclick="fecharModalFeedback()">&times;</span>
            <p class="mensagem-feedback ${tipo || 'info'}">${mensagem}</p>
            <button class="btn-voltar-modal" onclick="fecharModalFeedback()">Fechar</button>
        `;
    }

    if (modal) {
        modal.style.display = "flex";
    }
}

