// Função para carregar as atividades armazenadas
function carregarAtividades() {
        const atividadesSalvas = localStorage.getItem('atividades');
        return atividadesSalvas ? JSON.parse(atividadesSalvas) : [];
    }
    
    // Função para salvar atividades no localStorage
    function salvarAtividades(atividades) {
        localStorage.setItem('atividades', JSON.stringify(atividades));
    }
    
    // Função para exibir atividades na página
    function exibirAtividades() {
        const atividadesDiv = document.getElementById('atividades');
        atividadesDiv.innerHTML = '';
    
        const atividades = carregarAtividades();
    
        atividades.forEach((atividade, index) => {
            const atividadeElemento = document.createElement('div');
            atividadeElemento.classList.add('atividade');
    
            let arquivoHTML = '';
            if (atividade.arquivo) {
                if (atividade.tipo === 'image') {
                    arquivoHTML = `<img src="${atividade.arquivo}" alt="Imagem da Matéria">`;
                } else {
                    arquivoHTML = `<a href="${atividade.arquivo}" target="_blank">${atividade.nomeArquivo}</a>`;
                }
            }
    
            atividadeElemento.innerHTML = `
                ${arquivoHTML}
                <h3>${atividade.materia}</h3>
                <p>${atividade.descricao}</p>
                <small>Data de entrega: ${atividade.data}</small>
                <button class="remover" data-index="${index}">Remover</button>
            `;
    
            atividadesDiv.appendChild(atividadeElemento);
    
            setTimeout(() => {
                atividadeElemento.classList.add('mostrar');
            }, 100);
        });
    
        document.querySelectorAll('button.remover').forEach(button => {
            button.addEventListener('click', removerAtividade);
        });
    }
    
    // Função para adicionar uma nova atividade
    function adicionarAtividade() {
        const nomeMateria = document.getElementById('nomeMateria').value;
        const dataEntrega = document.getElementById('dataEntrega').value;
        const descricaoAtividade = document.getElementById('descricaoAtividade').value;
        const arquivoMateria = document.getElementById('arquivoMateria').files[0];
    
        if (nomeMateria && dataEntrega && descricaoAtividade) {
            const reader = new FileReader();
            const novaAtividade = {
                materia: nomeMateria,
                data: dataEntrega,
                descricao: descricaoAtividade,
                arquivo: null,
                tipo: null,
                nomeArquivo: null
            };
    
            if (arquivoMateria) {
                reader.onload = function (e) {
                    novaAtividade.arquivo = e.target.result;
                    novaAtividade.nomeArquivo = arquivoMateria.name;
                    novaAtividade.tipo = arquivoMateria.type.includes('image') ? 'image' : 'file';
                    salvarEExibir(novaAtividade);
                };
                reader.readAsDataURL(arquivoMateria);
            } else {
                salvarEExibir(novaAtividade);
            }
        }
    }
    
    function salvarEExibir(atividade) {
        const atividades = carregarAtividades();
        atividades.push(atividade);
        salvarAtividades(atividades);
        exibirAtividades();
        document.getElementById('nomeMateria').value = '';
        document.getElementById('dataEntrega').value = '';
        document.getElementById('descricaoAtividade').value = '';
        document.getElementById('arquivoMateria').value = '';
    }
    
    // Função para remover uma atividade
    function removerAtividade(event) {
        const index = event.target.getAttribute('data-index');
        const atividades = carregarAtividades();
        atividades.splice(index, 1);
        salvarAtividades(atividades);
        exibirAtividades();
    }
    
    // Função para carregar a cor salva
    function carregarCorSalva() {
        const corSalva = localStorage.getItem('corDeFundo');
        if (corSalva) {
            document.body.style.backgroundColor = corSalva;
        }
    }
    
    // Função para salvar a cor escolhida
    function salvarCorEscolhida(cor) {
        localStorage.setItem('corDeFundo', cor);
    }
    
    // Função para desenhar a roda de cores
    function desenharRodaDeCores() {
        const canvas = document.getElementById('colorWheel');
        const ctx = canvas.getContext('2d');
    
        const size = canvas.width = canvas.offsetWidth;
        const radius = size / 2;
        const image = ctx.createImageData(size, size);
    
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = x - radius;
                const dy = y - radius;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > radius) continue;
    
                const angle = Math.atan2(dy, dx) + Math.PI;
                const hue = (angle / (2 * Math.PI)) * 360;
                const saturation = (distance / radius) * 100;
                const lightness = 50;
    
                const color = hslParaRgb(hue, saturation, lightness);
    
                const index = (y * size + x) * 4;
                image.data[index] = color[0];
                image.data[index + 1] = color[1];
                image.data[index + 2] = color[2];
                image.data[index + 3] = 255;
            }
        }
    
        ctx.putImageData(image, 0, 0);
    }
    
    // Função para converter HSL para RGB
    function hslParaRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
    }
    
    // Função para capturar a cor no clique
    function pegarCor(event) {
        const canvas = document.getElementById('colorWheel');
        const ctx = canvas.getContext('2d');
    
        const boundingRect = canvas.getBoundingClientRect();
        const x = event.clientX - boundingRect.left;
        const y = event.clientY - boundingRect.top;
    
        const imageData = ctx.getImageData(x, y, 1, 1);
        const pixel = imageData.data;
        const corEscolhida = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    
        document.body.style.backgroundColor = corEscolhida;
        salvarCorEscolhida(corEscolhida);
    }
    
    // Função para atualizar o círculo indicador
    function atualizarCursorIndicador(event) {
        const cursor = document.getElementById('cursorPosicao');
        const canvas = document.getElementById('colorWheel');
        const boundingRect = canvas.getBoundingClientRect();
        const x = event.clientX - boundingRect.left;
        const y = event.clientY - boundingRect.top;
    
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        cursor.style.display = 'block';
    }
    
    // Eventos de clique e movimento do mouse
    document.getElementById('colorWheel').addEventListener('click', pegarCor);
    document.getElementById('colorWheel').addEventListener('mousemove', atualizarCursorIndicador);
    
    // Ao carregar a página
    window.onload = function () {
        carregarCorSalva();
        desenharRodaDeCores();
        exibirAtividades();
    };
    
    document.getElementById('adicionarAtividade').addEventListener('click', adicionarAtividade);
    