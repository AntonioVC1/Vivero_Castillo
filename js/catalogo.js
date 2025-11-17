document.addEventListener('DOMContentLoaded', () => {

    
    
    // --- INICIO FUNCIONES DE FAVORITOS ---

    /** Obtiene los favoritos desde localStorage */
    function getFavoritos() {
        const favs = localStorage.getItem('vivero_favoritos');
        return favs ? JSON.parse(favs) : []; // Devuelve un array
    }

    /** Guarda los favoritos en localStorage */
    function saveFavoritos(favoritosArray) {
        localStorage.setItem('vivero_favoritos', JSON.stringify(favoritosArray));
    }


    /**
     * Función principal para añadir/quitar un favorito
     * @param {string} productoId - El ID del producto (ej: "sol-001")
     */
    function toggleFavorito(productoId) {
        let favoritos = getFavoritos();
        let esFavorito = false;

        if (favoritos.includes(productoId)) {
            // Ya era favorito, así que lo quitamos
            favoritos = favoritos.filter(id => id !== productoId);
            esFavorito = false;
        } else {
            // No era favorito, así que lo añadimos
            favoritos.push(productoId);
            esFavorito = true;
        }

        // Guardamos el nuevo array
        saveFavoritos(favoritos);

        const count = favoritos.length;
        // MODIFICADO: Añadidas comprobaciones de existencia
        if (favBadge) {
            favBadge.textContent = count;
            favBadge.style.display = count > 0 ? 'flex' : 'none';
        }
        if (favCounterText) {
            favCounterText.textContent = `${count} planta${count !== 1 ? 's' : ''} guardada${count !== 1 ? 's' : ''}`;
        }

        // Sincronizamos TODOS los botones que coincidan con este ID
        document.querySelectorAll(`[data-product-id="${productoId}"]`).forEach(btn => {
            btn.classList.toggle('is-favorite', esFavorito);
        });
    }
    // --- FIN FUNCIONES DE FAVORITOS ---
    // --- INICIO: LÓGICA BOTÓN VOLVER ARRIBA ---
    const btnVolverArriba = document.getElementById('btnVolverArriba');

    if (btnVolverArriba) {
        // Mostrar/Ocultar el botón
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) { // Se muestra después de 400px de scroll
                btnVolverArriba.classList.add('visible');
            } else {
                btnVolverArriba.classList.remove('visible');
            }
        });

        // Acción de clic para volver arriba
        btnVolverArriba.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    // --- FIN: LÓGICA BOTÓN VOLVER ARRIBA ---
    function renderFavoritos() {
        const favIDs = getFavoritos();
        
        // MODIFICADO: Comprobación de existencia
        if (!favoritesGridContainer) return; 
        
        favoritesGridContainer.innerHTML = ''; // Limpia el panel
    
        // --- Actualizar contadores ---
        const count = favIDs.length;
        if (favBadge) {
            favBadge.textContent = count;
            favBadge.style.display = count > 0 ? 'flex' : 'none';
        }
        if (favCounterText) {
            favCounterText.textContent = `${count} planta${count !== 1 ? 's' : ''} guardada${count !== 1 ? 's' : ''}`;
        }
    
        if (count === 0) {
            // --- MOSTRAR ESTADO VACÍO ---
            favoritesGridContainer.innerHTML = `
                <div class="favorites-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.566Z"/><path d="m14.27 10.73-4.54 4.54"/></svg>
                    <h3>Sin favoritos aún</h3>
                    <p>Explora el catálogo y marca tus plantas favoritas</p>
                    <a href="productos.html" class="btn-explorar" id="explore-catalog-btn">Explorar Catálogo</a>
                </div>
            `;
            if (favoritesFooter) favoritesFooter.style.display = 'none';
            
            const exploreBtn = document.getElementById('explore-catalog-btn');
            
            // MODIFICADO: Revisamos si estamos en la página de productos
            if (exploreBtn && document.getElementById('product-grid')) {
                exploreBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeFavoritesModal();
                    document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth' });
                });
            }
            // Si no, el botón funciona como un enlace normal a productos.html
    
        } else {
            // --- DIBUJAR LAS TARJETAS ---
            if (favoritesFooter) favoritesFooter.style.display = 'flex';
            
            // MODIFICADO: Asegurarse de que todosLosProductos exista
            if (todosLosProductos && todosLosProductos.length > 0) {
                const favProducts = todosLosProductos.filter(p => favIDs.includes(p.id));
        
                favProducts.forEach(producto => {
                    
                    // --- CREAR TARJETA MANUALMENTE ---
                    const card = document.createElement('div');
                    card.className = 'product-card-v2 fav-card';
                    
                    // Generar estrellas
                    let estrellasHTML = '';
                    for (let i = 0; i < 5; i++) {
                        const starClass = i < producto.popularidad ? 'star-filled' : 'star-empty';
                        estrellasHTML += `<svg class="${starClass}" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
                    }
        
                    // Construir HTML de la tarjeta
                    card.innerHTML = `
                        <div class="card-image-container">
                            <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                            <button class="heart-btn is-favorite" aria-label="Quitar de favoritos" data-product-id="${producto.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </button>
                        </div>
                        <div class="card-info-container">
                            <h3 class="card-nombre">${producto.nombre}</h3>
                            <p class="card-descripcion">${producto.nombreCientifico || ''}</p>
                            <div class="card-rating">
                                ${estrellasHTML}
                            </div>
                            <span class="card-precio">$${producto.precio.toFixed(2)}</span>
                        </div>
                    `;
        
                    // --- AÑADIR EVENT LISTENERS ---
                    const heartBtn = card.querySelector('.heart-btn');
                    heartBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        toggleFavorito(producto.id);
                        renderFavoritos();
                    });
        
                    card.addEventListener('click', () => {
                        // MODIFICADO: Comprobar si el modal existe
                        if (detailModal) {
                            mostrarModalConProducto(producto);
                            closeFavoritesModal();
                        }
                    });
        
                    // --- AÑADIR AL CONTENEDOR ---
                    favoritesGridContainer.appendChild(card);
                });
            }
        }
    }

    /** Muestra el panel de favoritos */
    function openFavoritesModal() {
        renderFavoritos(); // Dibuja el contenido antes de mostrar
        if (favoritesOverlay) favoritesOverlay.classList.add('active');
        if (favoritesModal) favoritesModal.classList.add('active');
    }

    /** Oculta el panel de favoritos */
    function closeFavoritesModal() {
        if (favoritesOverlay) favoritesOverlay.classList.remove('active');
        if (favoritesModal) favoritesModal.classList.remove('active');
    }

    /** Limpia todos los favoritos */
    function limpiarTodosLosFavoritos() {
        // 1. Confirma con el usuario
        if (!confirm("¿Estás seguro de que quieres limpiar todos tus favoritos?")) {
            return;
        }
        
        // 2. Borra de memoria
        saveFavoritos([]); // Guarda un array vacío
        
        // 3. Vuelve a dibujar el panel (mostrará el estado vacío)
        renderFavoritos(); 
        
        // 4. Quita la clase 'is-favorite' de TODOS los botones de corazón
        document.querySelectorAll('.heart-btn, .heart-btn-modal').forEach(btn => {
            btn.classList.remove('is-favorite');
        });
    }

    /** Envía todos los favoritos a la página de contacto */
    function cotizarTodosLosFavoritos() {
        const favIDs = getFavoritos();
        if (favIDs.length === 0) return;

        // Filtra los productos completos
        const favProducts = todosLosProductos.filter(p => favIDs.includes(p.id));
        
        // 1. Crea una lista de nombres separados por coma
        const productNames = favProducts.map(p => p.nombre).join(', ');

        // 2. Crea un mensaje que diga "los siguientes productos: [LISTA]"
        const message = `los siguientes productos:\n\n- ${productNames.replace(/, /g, '\n- ')}`;

        
        // 3. Envía el mensaje usando el parámetro "?producto="
        const encodedMessage = encodeURIComponent(message);
        window.location.href = `contacto.html?producto=${encodedMessage}`;
        
        closeFavoritesModal(); // Cierra el panel
    }
    

    // --- Variables Globales del Catálogo ---
    let todosLosProductos = [];
    let todasLasCategorias = {};
    
    // --- Elementos del DOM del Catálogo ---
    const gridContainer = document.getElementById('product-grid');
    const filtroBotones = document.querySelectorAll('.filtro-btn');
    const searchBar = document.getElementById('search-bar');
    const productCounter = document.getElementById('product-counter');

    // --- Elementos del Modal de Detalles ---
    const detailModal = document.getElementById('productDetailModal');
    const detailOverlay = document.getElementById('productDetailOverlay');
    const detailCloseBtn = document.getElementById('modalCloseBtn');
    
    const modalNombre = document.getElementById('modal-nombre');
    const modalNombreCientifico = document.getElementById('modal-nombre-cientifico');
    const modalMainImageContainer = document.getElementById('gallery-main-image');
    const modalThumbnailsContainer = document.getElementById('gallery-thumbnails');
    const modalPrecio = document.getElementById('modal-precio');
    const modalInfoGrid = document.getElementById('modal-info-grid');
    const modalCuidadosList = document.getElementById('modal-cuidados-list');
    const modalDatosList = document.getElementById('modal-datos-list');
    const modalCotizarBtn = document.getElementById('modal-cotizar-btn');
    const modalHeartBtn = document.getElementById('modal-heart-btn');
    const toggleFilterBtn = document.getElementById('toggle-filter-btn');
    const advancedFiltersPanel = document.getElementById('advanced-filters-panel');
    const sortBySelect = document.getElementById('sort-by');
    const priceRangeSlider = document.getElementById('price-range');
    const priceValueDisplay = document.getElementById('price-value-display');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    // --- Elementos del Panel de Favoritos (Pueden no existir en todas las páginas) ---
    const openFavoritesBtn = document.getElementById('open-favorites-btn');
    const favoritesOverlay = document.getElementById('favoritesOverlay');
    const favoritesModal = document.getElementById('favoritesModal');
    const closeFavoritesBtn = document.getElementById('close-favorites-btn');
    const favoritesGridContainer = document.getElementById('favorites-grid-container');
    const favoritesFooter = document.getElementById('favorites-footer');
    const clearFavoritesBtn = document.getElementById('clear-favorites-btn');
    const quoteFavoritesBtn = document.getElementById('quote-favorites-btn');
    const favBadge = document.getElementById('fav-badge');
    const favCounterText = document.getElementById('fav-counter-text');

    // --- Listeners de Favoritos (Solo se añaden si los botones existen) ---
    if (openFavoritesBtn) {
        openFavoritesBtn.addEventListener('click', openFavoritesModal);
    }
    if (closeFavoritesBtn) {
        closeFavoritesBtn.addEventListener('click', closeFavoritesModal);
    }
    if (favoritesOverlay) {
        favoritesOverlay.addEventListener('click', closeFavoritesModal);
    }
    if (clearFavoritesBtn) {
        clearFavoritesBtn.addEventListener('click', limpiarTodosLosFavoritos);
    }
    if (quoteFavoritesBtn) {
        quoteFavoritesBtn.addEventListener('click', cotizarTodosLosFavoritos);
    }

    
    // --- Elementos del Modal de Ampliación de Imagen (Puede no existir) ---
    const imageModal = document.getElementById('imageModal');
    const modalImage = imageModal ? document.getElementById('modalImage') : null;
    const imageModalClose = imageModal ? imageModal.querySelector(".modal-close") : null;


    // --- INICIO: CÓDIGO SOLO PARA LA PÁGINA DE CATÁLOGO ---
    // Comprobamos si 'gridContainer' existe.
    // Si no existe, todo este bloque de código se omitirá, evitando errores.
    if (gridContainer) {

        // --- CÓDIGO AÑADIDO PARA OCULTAR FILTRO DE PRECIO ---
        if (document.body.classList.contains('precios-ocultos')) {
            // Busca el <label> del filtro de precio
            const priceFilterLabel = document.querySelector('label[for="price-range"]');
            if (priceFilterLabel) {
                // Oculta el <div> padre que contiene el filtro
                priceFilterLabel.parentElement.style.display = 'none';
            }
        }
        // --- FIN DEL CÓDIGO AÑADIDO ---


        // Listener para el botón de corazón del MODAL
        if (modalHeartBtn) {
            modalHeartBtn.addEventListener('click', () => {
                // El 'dataset.productId' lo asignaremos en la función mostrarModal
                const id = modalHeartBtn.dataset.productId;
                if (id) {
                    toggleFavorito(id);
                }
            });
        }

        // Listener para el slider de precio
        if(priceRangeSlider) {
            
            // Función para actualizar el fondo azul
            function updateSliderBackground() {
                if (!priceRangeSlider) return; // Comprobación por si acaso
                const maxPrice = priceRangeSlider.value;
                const percentage = (maxPrice - priceRangeSlider.min) / (priceRangeSlider.max - priceRangeSlider.min) * 100;
                const sliderColor = '#007bff'; // Mismo color azul del CSS
                
                priceRangeSlider.style.background = `linear-gradient(to right, ${sliderColor} ${percentage}%, #ddd ${percentage}%)`;
            }

            priceRangeSlider.addEventListener('input', () => {
                // 1. Actualiza el texto "Precio: $0 - $..."
                if (priceValueDisplay) {
                    priceValueDisplay.textContent = `$0 - $${priceRangeSlider.value}`;
                }
                // 2. Actualiza el fondo del slider
                updateSliderBackground();

                // 3. Llama a la función de filtrado
                filtrarYDibujar();
            });

            // Llama a la función una vez al cargar la página
            updateSliderBackground();
        }

        // Listener para el dropdown de "Ordenar por"
        if(sortBySelect) {
            sortBySelect.addEventListener('change', () => {
                // Llama a la función de filtrado
                filtrarYDibujar();
            });
        }
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                
                // 1. Resetear filtros avanzados (Dropdown y Slider)
                if (sortBySelect) sortBySelect.value = 'default';
                if (priceRangeSlider) priceRangeSlider.value = priceRangeSlider.max; 
        
                // 2. Actualizar visualmente el slider
                if (priceValueDisplay) priceValueDisplay.textContent = `$0 - $${priceRangeSlider.max}`; 
                const percentage = 100;
                const sliderColor = '#007bff'; // El color azul que definimos
                
                if (priceRangeSlider) priceRangeSlider.style.background = `linear-gradient(to right, ${sliderColor} ${percentage}%, #ddd ${percentage}%)`;
        
                // 3. Volver a dibujar (SIN tocar los chips ni la búsqueda)
                filtrarYDibujar();
            });
        }

        // Listener para el botón de filtros
        if(toggleFilterBtn) { // Buena práctica verificar que existe
            toggleFilterBtn.addEventListener('click', () => {
                if (advancedFiltersPanel) advancedFiltersPanel.classList.toggle('active');
            });
        }

        // Listeners para cerrar el modal de detalles
        if (detailModal) {
            detailModal.addEventListener('click', (e) => {
                if (e.target === detailModal) {
                    cerrarModalDetalles();
                }
            });
        }
        if (detailCloseBtn) {
            detailCloseBtn.addEventListener('click', cerrarModalDetalles);
        }

        // --- Lógica del Modal de Ampliación ---
        if (imageModalClose) {
            imageModalClose.addEventListener('click', () => {
                if (imageModal) imageModal.classList.remove('active');
            });
        }
        if (imageModal) {
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal) {
                    imageModal.classList.remove('active');
                }
            });
        }
    
    }
    // --- FIN: CÓDIGO SOLO PARA LA PÁGINA DE CATÁLOGO ---


    /**
     * Dibuja las tarjetas de producto en el HTML
     */
    function dibujarProductos(productos) {
        if (!gridContainer) return; // Si no estamos en pag de catálogo, no hacer nada

        gridContainer.innerHTML = ''; // Limpia el grid

        if (productos.length === 1) {
            if (productCounter) productCounter.textContent = '1 planta encontrada';
        } else {
            if (productCounter) productCounter.textContent = `${productos.length} plantas encontradas`;
        }
        if (productos.length === 0) {
            gridContainer.innerHTML = '<p class="no-productos">No se encontraron plantas.</p>';
            return;
        }

        // Obtén los favoritos UNA VEZ antes del bucle
        const favoritosActuales = getFavoritos();

        productos.forEach(producto => {
            const card = document.createElement('div');
            card.classList.add('product-card-v2');
            
            // Listener para abrir el modal
            card.addEventListener('click', () => {
                mostrarModalConProducto(producto);
            });

            // Código de Estrellas
            let estrellasHTML = '';
            for (let i = 0; i < 5; i++) {
                estrellasHTML += `<svg class="${i < producto.popularidad ? 'star-filled' : 'star-empty'}" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
            }
            const primeraImagen = producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : 'images/placeholder.webp';

            // Comprueba si este producto es favorito
            const esFavorito = favoritosActuales.includes(producto.id);

            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${primeraImagen}" alt="${producto.nombre}">
                    
                    <button 
                        class="heart-btn ${esFavorito ? 'is-favorite' : ''}" 
                        aria-label="Añadir a favoritos"
                        data-product-id="${producto.id}" 
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                </div>
                <div class="card-info-container">
                    <h3 class="card-nombre">${producto.nombre}</h3>
                    <p class="card-descripcion">${producto.nombreCientifico || ''}</p>
                    <div class="card-rating">
                        ${estrellasHTML}
                    </div>
                    <span class="card-precio">$${producto.precio.toFixed(2)}</span>
                </div>
            `;
            
            // AÑADE EL LISTENER PARA EL BOTÓN DE LA TARJETA
            const heartBtn = card.querySelector('.heart-btn');
            heartBtn.addEventListener('click', (e) => {
                // ¡IMPORTANTE! Evita que el clic en el corazón abra el modal
                e.stopPropagation(); 
                
                toggleFavorito(producto.id);
            });

            gridContainer.appendChild(card);
        });
    }

    
    /**
     * Rellena el modal con los datos del producto y lo muestra
     */
    function mostrarModalConProducto(producto) {
        if (!detailModal) return; // Salir si no estamos en la pág de catálogo

        // Rellenar textos
        modalNombre.textContent = producto.nombre;
        modalNombreCientifico.textContent = producto.descripcion_corta || '';
        modalPrecio.textContent = `$${producto.precio.toFixed(2)}`;

        // Limpiar galería anterior
        modalMainImageContainer.innerHTML = '';
        modalThumbnailsContainer.innerHTML = '';

        // Crear y mostrar imagen principal
        const mainImg = document.createElement('img');
        mainImg.src = producto.imagenes[0];
        mainImg.alt = producto.nombre;
        mainImg.addEventListener('click', () => {
            openImageModal(mainImg.src); // Ampliar al hacer clic
        });
        modalMainImageContainer.appendChild(mainImg);

        // Crear y mostrar miniaturas
        producto.imagenes.forEach((imgSrc, index) => {
            const thumbImg = document.createElement('img');
            thumbImg.src = imgSrc;
            thumbImg.alt = `Miniatura ${index + 1}`;
            if (index === 0) {
                thumbImg.classList.add('active');
            }
            thumbImg.addEventListener('click', () => {
                mainImg.src = imgSrc;
                if (modalThumbnailsContainer) {
                    const activeThumb = modalThumbnailsContainer.querySelector('img.active');
                    if (activeThumb) activeThumb.classList.remove('active');
                }
                thumbImg.classList.add('active');
            });
            modalThumbnailsContainer.appendChild(thumbImg);
        });
        
        // Rellenar Info Grid
        modalInfoGrid.innerHTML = ''; // Limpiamos el contenedor

        if (producto.luz) {
            modalInfoGrid.innerHTML += `
                <div class="modal-info-box" id="info-luz">
                    <div class="info-icon-container">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    </div>
                    <h4 class="info-title">Luz</h4>
                    <p class="info-value">${producto.luz}</p>
                </div>`;
        }
        if (producto.riego) {
            modalInfoGrid.innerHTML += `
                <div class="modal-info-box" id="info-riego">
                    <div class="info-icon-container">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-5.5-6.5c-2 2.5-3.5 4.5-5.5 6.5C3 11.1 2 13 2 15a7 7 0 0 0 7 7z"/></svg>
                    </div>
                    <h4 class="info-title">Riego</h4>
                    <p class="info-value">${producto.riego}</p>
                </div>`;
        }
        if (producto.sustrato) {
            modalInfoGrid.innerHTML += `
                <div class="modal-info-box" id="info-sustrato">
                    <div class="info-icon-container">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.28 22Zm-15.4-6.3a1.5 1.5 0 0 1-2.12-2.12 1.5 1.5 0 0 1 2.12 2.12Z"></path><path d="M12 13.88a1.5 1.5 0 0 1-2.12-2.12 1.5 1.5 0 0 1 2.12 2.12Z"></path><path d="M18.12 13.88a1.5 1.5 0 0 1-2.12-2.12 1.5 1.5 0 0 1 2.12 2.12Z"></path><path d="M15 6.22a1.5 1.5 0 0 1-2.12-2.12 1.5 1.5 0 0 1 2.12 2.12Z"></path><path d="M8.88 6.22a1.5 1.5 0 0 1-2.12-2.12 1.5 1.5 0 0 1 2.12 2.12Z"></path><path d="M12 2a5.5 5.5 0 0 0-5.32 8.16A5.5 5.5 0 0 0 12 22a5.5 5.5 0 0 0 5.32-11.84A5.5 5.5 0 0 0 12 2Z"></path></svg>
                    </div>
                    <h4 class="info-title">Sustrato</h4>
                    <p class="info-value">${producto.sustrato}</p>
                </div>`;
        }
        
        // Rellenar Cuidados
        modalCuidadosList.innerHTML = '';
        if (producto.cuidados) {
            const cuidadosArray = producto.cuidados.split('.').filter(c => c.trim() !== '');
            cuidadosArray.forEach((cuidado, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${index + 1}</span> ${cuidado.trim()}`;
                modalCuidadosList.appendChild(li);
            });
        }

        // Rellenar Datos Interesantes
        modalDatosList.innerHTML = '';
        if (producto.datosInteresantes) {
            const datosArray = producto.datosInteresantes.split('.').filter(d => d.trim() !== '');
            datosArray.forEach(dato => {
                const li = document.createElement('li');
                li.textContent = dato.trim();
                modalDatosList.appendChild(li);
            });
        }

        // --- LÓGICA DE BOTONES (ACTUALIZADA) ---

        // 1. Botón de Cotizar
        const nombreProductoCodificado = encodeURIComponent(producto.nombre);
        modalCotizarBtn.href = `contacto.html?producto=${nombreProductoCodificado}`;

        // 2. Botón de Corazón
        modalHeartBtn.dataset.productId = producto.id;
        const esFavorito = getFavoritos().includes(producto.id);
        modalHeartBtn.classList.toggle('is-favorite', esFavorito);

        // --- FIN DE LÓGICA DE BOTONES ---
        
        // Mostrar el modal
        detailOverlay.classList.add('active');
        detailModal.classList.add('active');
    }
    
    function cerrarModalDetalles() {
        if (detailOverlay) detailOverlay.classList.remove('active');
        if (detailModal) detailModal.classList.remove('active');
    }

    // --- Lógica del Modal de Ampliación ---
    function openImageModal(imgSrc) {
        if (imageModal && modalImage) {
            modalImage.src = imgSrc;
            imageModal.classList.add('active');
        }
    }


    /**
     * Filtra y dibuja los productos
     */
    function filtrarYDibujar() {
        if (!gridContainer) return; // Si no hay catálogo, no filtrar
        
        // 1. OBTENER TODOS LOS VALORES DE LOS FILTROS
        const categoriaActivaBtn = document.querySelector('.filtro-btn.active');
        const categoriaActiva = categoriaActivaBtn ? categoriaActivaBtn.getAttribute('data-categoria') : 'todos';
        
        const terminoBusqueda = searchBar ? searchBar.value.toLowerCase() : '';
        
        // ⬇️ Obtiene los valores de los nuevos filtros ⬇️
        const sortBy = sortBySelect ? sortBySelect.value : 'default';
        const maxPrice = priceRangeSlider ? parseInt(priceRangeSlider.value, 10) : 99999;
        
        let productosFiltrados = [];

        // 2. FILTRAR POR CATEGORÍA (Chips)
        if (categoriaActiva === 'todos') {
            productosFiltrados = todosLosProductos;
        } else {
            productosFiltrados = todasLasCategorias[categoriaActiva] || [];
        }

        // 3. FILTRAR POR TÉRMINO DE BÚSQUEDA
        if (terminoBusqueda) {
            productosFiltrados = productosFiltrados.filter(producto => 
                producto.nombre.toLowerCase().includes(terminoBusqueda) ||
                (producto.nombreCientifico && producto.nombreCientifico.toLowerCase().includes(terminoBusqueda))
            );
        }
        
        // 4. FILTRAR POR PRECIO (Slider)
        productosFiltrados = productosFiltrados.filter(producto => producto.precio <= maxPrice);

        // 5. ORDENAR PRODUCTOS (Dropdown)
        switch (sortBy) {
            case 'nombre-asc':
                productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'nombre-desc':
                productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
                break;
            case 'precio-asc':
                productosFiltrados.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio-desc':
                productosFiltrados.sort((a, b) => b.precio - a.precio);
                break;
            case 'default':
            default:
                // No hacer nada, mantener orden original
                break;
        }

        // 6. DIBUJAR LOS RESULTADOS
        dibujarProductos(productosFiltrados);
    }

    /**
     * Carga inicial de productos desde el JSON
     */
    async function cargarProductos() {
        try {
            const response = await fetch('productos.json');
            if (!response.ok) throw new Error('No se pudo cargar productos.json');
            
            const data = await response.json();
            todasLasCategorias = data;
            
            // Esta parte es necesaria en TODAS las páginas para que el panel de favoritos funcione
            let tempTodosLosProductos = [];
            for (const categoria in data) {
                data[categoria].forEach(producto => {
                    if (typeof producto.imagenes === 'string') {
                        producto.imagenes = [producto.imagenes];
                    } else if (!Array.isArray(producto.imagenes) || producto.imagenes.length === 0) {
                        producto.imagenes = ['images/placeholder.webp'];
                    }
                    tempTodosLosProductos.push(producto);
                });
            }
            todosLosProductos = tempTodosLosProductos;

            // MODIFICADO: Comprobar si estamos en la página del catálogo
            const catalogGrid = document.getElementById('product-grid');
            if (catalogGrid) {
                // Si SÍ estamos, dibujamos el catálogo y asignamos listeners
                filtrarYDibujar();

                if (filtroBotones) {
                    filtroBotones.forEach(boton => {
                        boton.addEventListener('click', () => {
                            filtroBotones.forEach(btn => btn.classList.remove('active'));
                            boton.classList.add('active');
                            filtrarYDibujar();
                        });
                    });
                }
                if (searchBar) {
                    searchBar.addEventListener('input', filtrarYDibujar);
                }
            }

            // MODIFICADO: Esta parte se ejecuta en TODAS las páginas
            const initialFavs = getFavoritos();
            if (favBadge) { // Comprobación de seguridad
                favBadge.textContent = initialFavs.length;
                favBadge.style.display = initialFavs.length > 0 ? 'flex' : 'none';
            }
            
            // --- CÓDIGO PEGADO AQUÍ (EL LUGAR CORRECTO) ---
            // Revisa la URL y abre el panel DESPUÉS de cargar todo
            try {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('ver') === 'favoritos') {
                    // Ya no necesitamos setTimeout, los productos están listos
                    openFavoritesModal();
                }
            } catch (e) {
                console.error('Error al leer URL params:', e);
            }
            // --- FIN DEL CÓDIGO PEGADO ---

        } catch (error) {
            console.error('Error al cargar productos:', error);
            // MODIFICADO: Solo mostrar error si el contador existe
            if (productCounter) {
                productCounter.textContent = 'Error al cargar el catálogo.';
            }
        }
    }
    
    cargarProductos();
    
    
});