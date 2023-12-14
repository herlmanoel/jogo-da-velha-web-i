let celulas = [];
const message = document.querySelector('.message');
const resetButton = document.querySelector('.reset-btn');
const opponentSelect = document.getElementById('opponent');
const boardContainer = document.querySelector('.board');

let jogadorAtual = 'X';
let statusJogo = true;
let tamanhoMatriz = 3; 
const MAIOR_TAMANHO_MATRIZ = 10;
const MENOR_TRAMANHO_MATRIZ = 3;

const criarTabuleiro = () => {
    boardContainer.innerHTML = ''; 

    if(tamanhoMatriz > MAIOR_TAMANHO_MATRIZ) {
        tamanhoMatriz = MAIOR_TAMANHO_MATRIZ;
    } else if (tamanhoMatriz < MENOR_TRAMANHO_MATRIZ) {
        tamanhoMatriz = MENOR_TRAMANHO_MATRIZ;
    }

    if(tamanhoMatriz)

    for (let i = 0; i < tamanhoMatriz; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        for (let j = 0; j < tamanhoMatriz; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i * tamanhoMatriz + j;
            row.appendChild(cell);
        }

        boardContainer.appendChild(row);
    }

    celulas = document.querySelectorAll('.cell');
    celulas.forEach(cell => {
        cell.addEventListener('click', celulaClickHandler);
    });
};

const checkGanhador = () => {
    const combinacoesGanhadoras = [];

    for (let i = 0; i < tamanhoMatriz; i++) {
        combinacoesGanhadoras.push(Array.from({ length: tamanhoMatriz }, (_, index) => i * tamanhoMatriz + index));
    }

    for (let i = 0; i < tamanhoMatriz; i++) {
        combinacoesGanhadoras.push(Array.from({ length: tamanhoMatriz }, (_, index) => i + tamanhoMatriz * index));
    }

    combinacoesGanhadoras.push(Array.from({ length: tamanhoMatriz }, (_, index) => index * (tamanhoMatriz + 1)));
    combinacoesGanhadoras.push(Array.from({ length: tamanhoMatriz }, (_, index) => (index + 1) * (tamanhoMatriz - 1)).reverse());

    for (const combinacao of combinacoesGanhadoras) {
        const sequencia = combinacao.map(index => gameBoard[index]);
        const todasIguais = sequencia.every(cell => cell !== '' && cell === sequencia[0]);
        if (todasIguais) {
            statusJogo = false;
            return sequencia[0];
        }
    }

    if (!gameBoard.includes('')) {
        statusJogo = false;
        return 'draw';
    }

    return null;
};


const mudarJogador = () => {
    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
};

const alterarBoard = (index) => {
    if (gameBoard[index] === '' && statusJogo) {
        gameBoard[index] = jogadorAtual;
        celulas[index].textContent = jogadorAtual;

        const ganhador = checkGanhador();
        if (ganhador) {
            if (ganhador === 'draw') {
                message.textContent = 'Velha!';
            } else {
                message.textContent = `O jogador ${ganhador} venceu!`;
            }
            statusJogo = false;
        } else {
            mudarJogador();
            if (opponentSelect.value === 'computer' && jogadorAtual === 'O') {
                jogadaComputador();
            } else {
                message.textContent = `É a vez do jogador ${jogadorAtual}`;
            }
        }
    }
};

const celulaClickHandler = (event) => {
    const cellIndex = event.target.dataset.index;
    alterarBoard(cellIndex);
};

const jogadaComputador = () => {
    if (statusJogo && opponentSelect.value === 'computer' && jogadorAtual === 'O') {
        let celulasVazias = gameBoard.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        if (celulasVazias.length > 0) {
            const randomIndex = Math.floor(Math.random() * celulasVazias.length);
            const computerMove = celulasVazias[randomIndex];
            setTimeout(() => {
                alterarBoard(computerMove);
            }, 250);
        }
    }
};

resetButton.addEventListener('click', () => {
    resetGame();
});

const resetGame = () => {
    gameBoard = Array(tamanhoMatriz * tamanhoMatriz).fill('');
    jogadorAtual = 'X';
    statusJogo = true;
    message.textContent = `É a vez do jogador ${jogadorAtual}`;

    celulas.forEach(cell => {
        cell.textContent = '';
    });

    if (opponentSelect.value === 'computer' && jogadorAtual === 'O') {
        jogadaComputador();
    }
    resetButton.textContent = 'Reiniciar Jogo'
};

opponentSelect.addEventListener('change', () => {
    if (opponentSelect.value === 'computer' && jogadorAtual === 'O') {
        jogadaComputador();
    } else {
        message.textContent = `É a vez do jogador ${jogadorAtual}`;
    }
});

const atualizarTamanhoMatriz = () => {
    tamanhoMatriz = parseInt(prompt('Escolha o tamanho da matriz (3 a 10):'), MAIOR_TAMANHO_MATRIZ) || MENOR_TRAMANHO_MATRIZ;
    criarTabuleiro(); 
    resetGame(); 
};

criarTabuleiro();
