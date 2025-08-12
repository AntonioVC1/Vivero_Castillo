document.addEventListener('DOMContentLoaded', function() {

    const PRELOADED_MEDIA_URL = "source/cancion1.mp4";
    const PRELOADED_MEDIA_TITLE = "Sweet Child O' Mine";

    // --- Elementos del DOM ---
    const card = document.querySelector('.card');
    const confettiBtn = document.getElementById('confettiBtn');
    const showPlayerBtn = document.getElementById('showPlayerBtn');
    const closePlayerBtn = document.getElementById('closePlayerBtn');
    const playerCard = document.getElementById('playerCard');
    const birthdaySong = document.getElementById('birthdaySong');
    // Solo el botón de voltear en la parte trasera
    const backFlipBtn = document.querySelector('.flip-card-btn.back-flip-btn');

    // Elementos del reproductor personalizado
    const customMediaPlayer = document.getElementById('customMediaPlayer');
    const songTitleDisplay = document.getElementById('songTitle');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteToggleBtn = document.getElementById('muteToggleBtn');
    const volumeUpBtn = document.getElementById('volumeUpBtn');
    const volumeDownBtn = document.getElementById('volumeDownBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBarFilled = document.getElementById('progressBarFilled');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const totalDurationDisplay = document.getElementById('totalDurationDisplay');

    let previousVolume = 1;

    // --- Elementos del Cuestionario ---
    const openLetterBtnQuiz = document.querySelector('.open-letter-btn');
    const letterClosed = document.querySelector('.letter-closed');
    const quizContainer = document.querySelector('.quiz-container');
    const questionCards = document.querySelectorAll('.question-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const submitQuizBtn = document.querySelector('.submit-quiz-btn');
    const feedbackMessage = document.querySelector('.feedback-message');
    const feedbackText = document.getElementById('feedback-text');
    const retryQuizBtn = document.querySelector('.retry-quiz-btn');
    const currentQuestionNumberDisplay = document.getElementById('current-question-number');
    const letterOpened = document.querySelector('.letter-opened');
    const hintButtons = document.querySelectorAll('.hint-btn');

    // --- Elementos del Modal de Pista ---
    const hintModal = document.getElementById('hint-modal');
    const hintModalText = document.getElementById('hint-modal-text');
    const closeHintModalBtn = document.getElementById('close-hint-modal');


    const quizData = [
        {
            question: "¿Cuál es mi película favorita que vimos juntos?",
            options: ["Titanic", "El Rey León", "Avengers: Endgame", "Tu Nombre (Kimi no Na wa)"],
            correctAnswer: "Tu Nombre (Kimi no Na wa)",
            hint: "Es una película de animación japonesa con una hermosa historia de amor y viajes en el tiempo."
        },
        {
            question: "¿En qué mes es mi cumpleaños?",
            options: ["Enero", "Abril", "Julio", "Octubre"],
            correctAnswer: "Julio",
            hint: "Es un mes de verano, ¡perfecto para celebrar!"
        },
        {
            question: "¿Cuál de estos es mi postre preferido?",
            options: ["Helado de chocolate", "Tarta de queso (Cheesecake)", "Flan", "Pastel de tres leches"],
            correctAnswer: "Tarta de queso (Cheesecake)",
            hint: "Es cremoso y suele tener una base de galleta."
        }
    ];

    let currentQuestionIndex = 0;
    const userAnswers = new Array(quizData.length).fill(null);


    // --- Funciones Auxiliares ---
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateMuteButtonIcon() {
        if (!customMediaPlayer || !muteToggleBtn) return;
        if (customMediaPlayer.muted || customMediaPlayer.volume === 0) {
            muteToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            muteToggleBtn.title = "Activar Sonido";
        } else if (customMediaPlayer.volume > 0.5) {
            muteToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            muteToggleBtn.title = "Silenciar";
        } else {
            muteToggleBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
            muteToggleBtn.title = "Silenciar";
        }
    }

    // --- Lógica de Giro de Tarjeta (Actualizada) ---
    if (card) {
        // Primer giro: al hacer clic en la tarjeta (lado frontal)
        card.addEventListener('click', function(e) {
            // Solo girar si la tarjeta NO está volteada AÚN
            // y si el clic NO fue sobre el botón de "Ver tu canción"
            if (!this.classList.contains('flipped') && !e.target.closest('button.surprise-btn')) {
                this.classList.add('flipped'); // Usar 'add' para el primer giro específico
            }
        });
    }

    if (backFlipBtn) {
        // Giros subsecuentes: usando el botón en la parte trasera
        backFlipBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Detener la propagación para no afectar otros listeners
            if (card) {
                card.classList.toggle('flipped'); // 'toggle' para voltear en ambas direcciones
            }
        });
    }


    // --- Lógica del Reproductor Personalizado ---
    if (customMediaPlayer) {
        customMediaPlayer.addEventListener('loadedmetadata', () => {
            if(totalDurationDisplay) totalDurationDisplay.textContent = formatTime(customMediaPlayer.duration);
            if(progressBarFilled) progressBarFilled.style.width = '0%';
            if(volumeSlider) volumeSlider.value = customMediaPlayer.volume;
            updateMuteButtonIcon();
        });

        customMediaPlayer.addEventListener('timeupdate', () => {
            if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(customMediaPlayer.currentTime);
            if (customMediaPlayer.duration && progressBarFilled) {
                const progressPercent = (customMediaPlayer.currentTime / customMediaPlayer.duration) * 100;
                progressBarFilled.style.width = `${progressPercent}%`;
            }
        });

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (customMediaPlayer.paused || customMediaPlayer.ended) {
                    customMediaPlayer.play().catch(err => console.error("Error al reproducir:", err));
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    playPauseBtn.title = "Pausar";
                } else {
                    customMediaPlayer.pause();
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    playPauseBtn.title = "Reproducir";
                }
            });
        }
        customMediaPlayer.addEventListener('ended', () => {
            if(playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.title = "Reproducir";
            }
            if(progressBarFilled) progressBarFilled.style.width = '0%';
            if(currentTimeDisplay) currentTimeDisplay.textContent = formatTime(0);
        });

        if (muteToggleBtn) {
            muteToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (customMediaPlayer.muted) {
                    customMediaPlayer.muted = false;
                    customMediaPlayer.volume = previousVolume;
                } else {
                    previousVolume = customMediaPlayer.volume;
                    customMediaPlayer.muted = true;
                }
                if(volumeSlider) volumeSlider.value = customMediaPlayer.muted ? 0 : customMediaPlayer.volume;
                updateMuteButtonIcon();
            });
        }

        customMediaPlayer.addEventListener('volumechange', () => {
            if (volumeSlider) volumeSlider.value = customMediaPlayer.volume;
            if (!customMediaPlayer.muted && customMediaPlayer.volume > 0) {
                previousVolume = customMediaPlayer.volume;
            }
            updateMuteButtonIcon();
        });

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                e.stopPropagation();
                customMediaPlayer.volume = parseFloat(volumeSlider.value);
                customMediaPlayer.muted = customMediaPlayer.volume === 0;
                updateMuteButtonIcon();
            });
        }

        if (volumeUpBtn) {
            volumeUpBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (customMediaPlayer.volume < 1) {
                    customMediaPlayer.volume = Math.min(1, customMediaPlayer.volume + 0.1);
                }
                customMediaPlayer.muted = false;
            });
        }
        if (volumeDownBtn) {
            volumeDownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (customMediaPlayer.volume > 0) {
                    customMediaPlayer.volume = Math.max(0, customMediaPlayer.volume - 0.1);
                }
                if (customMediaPlayer.volume < 0.05) {
                    customMediaPlayer.volume = 0;
                    customMediaPlayer.muted = true;
                } else {
                    customMediaPlayer.muted = false;
                }
            });
        }

        if (progressBarContainer) {
            progressBarContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = progressBarContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const barWidth = rect.width;
                if (barWidth > 0 && customMediaPlayer.duration) {
                    const seekTime = (clickX / barWidth) * customMediaPlayer.duration;
                    if (isFinite(seekTime)) {
                        customMediaPlayer.currentTime = seekTime;
                    }
                }
            });
        }
    }

    // --- Lógica del Cuestionario ---
    function loadQuizQuestion(index) {
        const currentQuestionData = quizData[index];
        const questionTextElement = document.getElementById(`question-text-${index + 1}`);
        const optionsContainer = document.getElementById(`options-${index + 1}`);

        if (questionTextElement && optionsContainer && currentQuestionData) {
            questionTextElement.textContent = currentQuestionData.question;
            optionsContainer.innerHTML = '';

            currentQuestionData.options.forEach(optionText => {
                const button = document.createElement('button');
                button.textContent = optionText;
                button.classList.add('option-btn');
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectQuizAnswer(optionText, index, button, optionsContainer);
                });
                optionsContainer.appendChild(button);
            });
        }
        if (userAnswers[index] !== null) {
            const buttons = optionsContainer.querySelectorAll('.option-btn');
            buttons.forEach(btn => {
                if (btn.textContent === userAnswers[index]) {
                    btn.classList.add('selected');
                }
            });
        }
    }

    function selectQuizAnswer(answer, questionIndex, clickedButton, optionsContainer) {
        userAnswers[questionIndex] = answer;
        const allOptionButtons = optionsContainer.querySelectorAll('.option-btn');
        allOptionButtons.forEach(btn => btn.classList.remove('selected'));
        clickedButton.classList.add('selected');
    }

    function showQuizQuestion(index) {
        questionCards.forEach((qCard, i) => {
            qCard.classList.toggle('active', i === index);
            qCard.classList.toggle('hidden', i !== index);
        });
        currentQuestionNumberDisplay.textContent = index + 1;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === quizData.length - 1;
        submitQuizBtn.classList.toggle('hidden', index !== quizData.length - 1);
    }

    function checkQuizAnswers() {
        let correctCount = 0;
        let allAnswered = true;
        quizData.forEach((question, index) => {
            if (userAnswers[index] === null) {
                allAnswered = false;
            }
            if (userAnswers[index] === question.correctAnswer) {
                correctCount++;
            }
        });

        if (!allAnswered) {
            feedbackText.textContent = 'Por favor, responde todas las preguntas.';
            feedbackMessage.className = 'feedback-message incorrect';
            feedbackMessage.classList.remove('hidden');
            retryQuizBtn.classList.add('hidden');
            return;
        }

        if (correctCount === quizData.length) {
            quizContainer.classList.add('hidden');
            letterOpened.classList.remove('hidden');
            if (typeof confetti === 'function') {
                confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#ff6b6b', '#ffa3a3', '#a18cd1', '#fbc2eb', '#ffffff', '#64d8cb'] });
            }
        } else {
            feedbackMessage.classList.remove('hidden');
            feedbackMessage.className = 'feedback-message incorrect';
            feedbackText.textContent = `Respondiste ${correctCount} de ${quizData.length} correctamente. ¡Inténtalo de nuevo!`;
            retryQuizBtn.classList.remove('hidden');
        }
    }

    if (openLetterBtnQuiz) {
        openLetterBtnQuiz.addEventListener('click', (e) => {
            e.stopPropagation();
            letterClosed.classList.add('hidden');
            quizContainer.classList.remove('hidden');
            const envelopeFlap = document.querySelector('.envelope-flap');
            if (envelopeFlap) envelopeFlap.style.transform = 'rotateX(180deg)';

            currentQuestionIndex = 0;
            userAnswers.fill(null);
            feedbackMessage.classList.add('hidden');
            retryQuizBtn.classList.add('hidden');
            quizData.forEach((_, index) => loadQuizQuestion(index));
            showQuizQuestion(currentQuestionIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentQuestionIndex < quizData.length - 1) {
                currentQuestionIndex++;
                showQuizQuestion(currentQuestionIndex);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                showQuizQuestion(currentQuestionIndex);
            }
        });
    }

    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            checkQuizAnswers();
        });
    }

    if (retryQuizBtn) {
        retryQuizBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            feedbackMessage.classList.add('hidden');
            retryQuizBtn.classList.add('hidden');
            currentQuestionIndex = 0;
            userAnswers.fill(null);
            quizData.forEach((_, index) => loadQuizQuestion(index));
            showQuizQuestion(currentQuestionIndex);
        });
    }

    // --- Lógica del Modal de Pista ---
    hintButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const questionIndex = parseInt(this.dataset.question) - 1;
            if (quizData[questionIndex] && quizData[questionIndex].hint) {
                hintModalText.textContent = quizData[questionIndex].hint;
                hintModal.classList.remove('hidden');
            }
        });
    });

    if (closeHintModalBtn) {
        closeHintModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hintModal.classList.add('hidden');
        });
    }

    if (hintModal) {
        hintModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hintModal.classList.add('hidden');
            }
        });
    }


    // --- Lógica General de la Página (Existente) ---
    function createBalloons() {
        const colors = ['#ff6b6b', '#ffa3a3', '#ffd3b6', '#dcedc1', '#a8e6cf', '#64d8cb', '#ffaaa5', '#FFC3A0', '#FFB6C1', '#C3AED6'];
        const balloonContainer = document.querySelector('.balloons');
        if (!balloonContainer) return;
        balloonContainer.innerHTML = '';
        const numBalloons = Math.floor(window.innerWidth / 80);
        for (let i = 0; i < Math.min(numBalloons, 20) ; i++) {
            const balloon = document.createElement('div');
            balloon.classList.add('balloon');
            balloon.style.left = `${Math.random() * 100}%`;
            const duration = 6 + Math.random() * 8;
            balloon.style.animationDuration = `${duration}s`;
            balloon.style.animationDelay = `${Math.random() * duration}s`;
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            const scale = 0.8 + Math.random() * 0.5;
            balloon.style.transform = `scale(${scale})`;
            balloonContainer.appendChild(balloon);
        }
    }

    if (showPlayerBtn && playerCard && customMediaPlayer) {
        showPlayerBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Muy importante para que no gire la tarjeta al clickear este botón

            if (birthdaySong && !birthdaySong.paused) {
                birthdaySong.pause();
                if (confettiBtn && confettiBtn.textContent.includes('Detener')) {
                    confettiBtn.textContent = 'Música y ¡Celebrar!';
                }
            }

            customMediaPlayer.src = PRELOADED_MEDIA_URL;
            customMediaPlayer.load();
            if(songTitleDisplay) songTitleDisplay.textContent = PRELOADED_MEDIA_TITLE;
            if(playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.title = "Reproducir";
            }
            if(currentTimeDisplay) currentTimeDisplay.textContent = formatTime(0);
            if(totalDurationDisplay) totalDurationDisplay.textContent = formatTime(0);
            if(progressBarFilled) progressBarFilled.style.width = '0%';
            if(volumeSlider) volumeSlider.value = customMediaPlayer.volume;
            updateMuteButtonIcon();

            playerCard.classList.remove('hidden');
        });
    }

    if (closePlayerBtn && playerCard && customMediaPlayer) {
        closePlayerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            customMediaPlayer.pause();
            customMediaPlayer.src = "";
            if(playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playerCard.classList.add('hidden');
        });
    }

    if (confettiBtn && birthdaySong) {
        confettiBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!birthdaySong.paused) {
                birthdaySong.pause();
                this.textContent = 'Música y ¡Celebrar!';
            } else {
                birthdaySong.play().catch(error => console.error("Error al reproducir canción de fondo:", error));
                this.textContent = 'Detener Música';
                if (customMediaPlayer && !customMediaPlayer.paused) {
                    customMediaPlayer.pause();
                    if(playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            }
            if (typeof confetti === 'function') {
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 150 };
                function randomInRange(min, max) { return Math.random() * (max - min) + min; }
                const confettiDuration = 3 * 1000;
                const confettiAnimationEnd = Date.now() + confettiDuration;
                const interval = setInterval(function() {
                    const timeLeft = confettiAnimationEnd - Date.now();
                    if (timeLeft <= 0) return clearInterval(interval);
                    const particleCount = 50 * (timeLeft / confettiDuration);
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
                }, 250);
            }
        });
    }

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const nameFromUrl = urlParams.get('name');
        if (nameFromUrl) {
            const decodedName = decodeURIComponent(nameFromUrl);
            const nameElements = document.querySelectorAll('.recipient-name');
            nameElements.forEach(el => el.textContent = decodedName);
            const titleNameElement = document.querySelector('.letter-opened .name');
            if (titleNameElement) titleNameElement.textContent = `Para ${decodedName}`;
        }
    } catch (error) { console.error("Error procesando parámetros de URL:", error); }

    createBalloons();
    window.addEventListener('resize', createBalloons);

    if (quizData.length > 0) {
         quizData.forEach((_, index) => loadQuizQuestion(index));
         if (questionCards.length > 0) {
            showQuizQuestion(0);
         }
    }
});