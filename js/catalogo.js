/* === CÓDIGO COMPLETO Y CORREGIDO PARA catalogo.js === */

document.addEventListener('DOMContentLoaded', () => {

    // === TAREA 1: CREAR EL HTML DEL MODAL PRIMERO ===
    const modalHTML = `
    <div class="product-detail-overlay" id="productDetailOverlay"></div>
    <div class="product-detail-modal" id="productDetailModal">
        <div class="modal-content">
            <header class="modal-header">
                <button class="modal-back-btn" id="modalCloseBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div class="modal-image-gallery">
                    <div class="gallery-thumbnails" id="gallery-thumbnails"></div>
                    <div class="gallery-main-image" id="gallery-main-image"></div>
                </div>
            </header>
            <div class="modal-body">
                <h2 id="modal-nombre">Nombre de la Planta</h2>
                <p id="modal-nombre-cientifico">Nombreus Cientificus</p>
                <section class="modal-actions">
                    <div>
                        <p class="label">Precio</p>
                        <p class="price" id="modal-precio">$0.00</p>
                    </div>
                    <div class="action-buttons">
                        <button class="heart-btn-modal" id="modal-heart-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                        <a href="contacto.html" class="btn-modal-cotizar-sm" id="modal-cotizar-btn"> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <span class="text-desktop">Cotizar este producto</span>
                            <span class="text-mobile">Cotizar</span>
                        </a>
                    </div>
                </section>
                <section class="modal-info-grid" id="modal-info-grid"></section>
                <section class="modal-care-list">
                    <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Cuidados Esenciales</h3>
                    <ul id="modal-cuidados-list"></ul>
                </section>
                <section class="modal-facts-box">
                    <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Datos Interesantes</h3>
                    <ul id="modal-datos-list"></ul>
                </section>
            </div>
        </div>
    </div>
    `;
    // Inyectamos el HTML en la página
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    
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
    
    // --- FIN FUNCIONES DE FAVORITOS ---
    

    // === TAREA 2: BUSCAR TODOS LOS ELEMENTOS ===
    // (Ahora que el HTML del modal YA EXISTE, podemos buscar todo)

    // --- Variables Globales ---
    let todosLosProductos = [];
    let todasLasCategorias = {};
    
    // --- Elementos del DOM (Página de Productos) ---
    const gridContainer = document.getElementById('product-grid');
    const filtroBotones = document.querySelectorAll('.filtro-btn');
    const searchBar = document.getElementById('search-bar');
    const productCounter = document.getElementById('product-counter');
    const toggleFilterBtn = document.getElementById('toggle-filter-btn');
    const advancedFiltersPanel = document.getElementById('advanced-filters-panel');
    const sortBySelect = document.getElementById('sort-by');
    const priceRangeSlider = document.getElementById('price-range');
    const priceValueDisplay = document.getElementById('price-value-display');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    // --- Elementos del Modal de Detalles (GLOBALES) ---
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

    // --- Elementos del Panel de Favoritos (GLOBALES) ---
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

    // --- Elementos del Modal de Ampliación de Imagen (GLOBALES) ---
    const imageModal = document.getElementById('imageModal');
    const modalImage = imageModal ? document.getElementById('modalImage') : null;
    const imageModalClose = imageModal ? imageModal.querySelector(".modal-close") : null;
    
    // --- Botón Volver Arriba (GLOBAL) ---
    const btnVolverArriba = document.getElementById('btnVolverArriba');


    // === TAREA 3: AÑADIR CLICS (LISTENERS) ===

    // --- Listeners del Panel de Favoritos (Globales) ---
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

    // --- Listeners del Modal de Detalles (Globales) ---
    if (modalHeartBtn) {
        modalHeartBtn.addEventListener('click', () => {
            const id = modalHeartBtn.dataset.productId;
            if (id) {
                toggleFavorito(id);
            }
        });
    }
    if (detailModal) { // <--- CORREGIDO: Usar detailOverlay
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) { 
                cerrarModalDetalles(); 
            }
        });
    }
    if (detailCloseBtn) {
        detailCloseBtn.addEventListener('click', cerrarModalDetalles); // Clic en el botón "X"
    }

    // --- Listener de Volver Arriba (Global) ---
    if (btnVolverArriba) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btnVolverArriba.classList.add('visible');
            } else {
                btnVolverArriba.classList.remove('visible');
            }
        });
        btnVolverArriba.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Lógica del Modal de Ampliación (Global) ---
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


    // --- INICIO: CÓDIGO SOLO PARA LA PÁGINA DE CATÁLOGO ---
    // (Estas acciones solo se añaden si estamos en productos.html)
    if (gridContainer) {

        // --- CÓDIGO AÑADIDO PARA OCULTAR FILTRO DE PRECIO ---
        if (document.body.classList.contains('precios-ocultos')) {
            const priceFilterLabel = document.querySelector('label[for="price-range"]');
            if (priceFilterLabel) {
                priceFilterLabel.parentElement.style.display = 'none';
            }
        }

        // Listener para el slider de precio
        if(priceRangeSlider) {
            
            function updateSliderBackground() {
                if (!priceRangeSlider) return;
                const maxPrice = priceRangeSlider.value;
                const percentage = (maxPrice - priceRangeSlider.min) / (priceRangeSlider.max - priceRangeSlider.min) * 100;
                const sliderColor = '#007bff';
                priceRangeSlider.style.background = `linear-gradient(to right, ${sliderColor} ${percentage}%, #ddd ${percentage}%)`;
            }

            priceRangeSlider.addEventListener('input', () => {
                if (priceValueDisplay) {
                    priceValueDisplay.textContent = `$0 - $${priceRangeSlider.value}`;
                }
                updateSliderBackground();
                filtrarYDibujar();
            });
            updateSliderBackground();
        }

        // Listener para el dropdown de "Ordenar por"
        if(sortBySelect) {
            sortBySelect.addEventListener('change', () => {
                filtrarYDibujar();
            });
        }
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                if (sortBySelect) sortBySelect.value = 'default';
                if (priceRangeSlider) priceRangeSlider.value = priceRangeSlider.max; 
                if (priceValueDisplay) priceValueDisplay.textContent = `$0 - $${priceRangeSlider.max}`; 
                const percentage = 100;
                const sliderColor = '#007bff';
                if (priceRangeSlider) priceRangeSlider.style.background = `linear-gradient(to right, ${sliderColor} ${percentage}%, #ddd ${percentage}%)`;
                filtrarYDibujar();
            });
        }

        // Listener para el botón de filtros
        if(toggleFilterBtn) {
            toggleFilterBtn.addEventListener('click', () => {
                if (advancedFiltersPanel) advancedFiltersPanel.classList.toggle('active');
            });
        }

        // Listeners para los botones de filtros (chips)
        if (filtroBotones) {
            filtroBotones.forEach(boton => {
                boton.addEventListener('click', () => {
                    filtroBotones.forEach(btn => btn.classList.remove('active'));
                    boton.classList.add('active');
                    filtrarYDibujar();
                });
            });
        }

        // Listener para la barra de búsqueda
        if (searchBar) {
            searchBar.addEventListener('input', filtrarYDibujar);
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
        if (!detailModal) return; // Salir si el modal no existe

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

        // --- LÓGICA DE BOTONES ---
        const nombreProductoCodificado = encodeURIComponent(producto.nombre);
        modalCotizarBtn.href = `contacto.html?producto=${nombreProductoCodificado}`;
        modalHeartBtn.dataset.productId = producto.id;
        const esFavorito = getFavoritos().includes(producto.id);
        modalHeartBtn.classList.toggle('is-favorite', esFavorito);
        
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

    // --- FUNCIÓN PARA EL NUEVO CARRUSEL DE NOCHEBUENA ---
    function dibujarCarouselNochebuena() {
        const idsNochebuena = ['temp-004', 'temp-005', 'temp-006'];
        const carouselContainer = document.querySelector('#promo-nochebuena .promo-carousel');
        
        if (!carouselContainer) {
            return; 
        }
        if (!todosLosProductos || todosLosProductos.length === 0) {
            console.warn('Productos no cargados, no se puede dibujar el carrusel');
            return;
        }
        
        const productosNochebuena = todosLosProductos.filter(p => idsNochebuena.includes(p.id));
        const favoritosActuales = getFavoritos();

        productosNochebuena.forEach(producto => {
            const card = document.createElement('div');
            card.classList.add('product-card-v2');
            
            card.addEventListener('click', () => {
                mostrarModalConProducto(producto);
            });

            let estrellasHTML = '';
            for (let i = 0; i < 5; i++) {
                estrellasHTML += `<svg class="${i < producto.popularidad ? 'star-filled' : 'star-empty'}" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
            }
            
            const primeraImagen = producto.imagenes[0];
            const esFavorito = favoritosActuales.includes(producto.id);

            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${primeraImagen}" alt="${producto.nombre}">
                    <button class="heart-btn ${esFavorito ? 'is-favorite' : ''}" aria-label="Añadir a favoritos" data-product-id="${producto.id}">
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
            
            const heartBtn = card.querySelector('.heart-btn');
            heartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorito(producto.id);
            });

            carouselContainer.appendChild(card);
        });
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
            
            // Esta parte es necesaria en TODAS las páginas
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

            // Si SÍ estamos en la pág. de catálogo, dibujamos el grid
            if (gridContainer) {
                filtrarYDibujar();
            }

            // --- LLAMADAS GLOBALES (se ejecutan en TODAS las páginas) ---
            
            // 1. Dibuja el carrusel de Nochebuena (si existe en la página)
            dibujarCarouselNochebuena();
            
            // 2. Actualiza el contador de favoritos del nav
            const initialFavs = getFavoritos();
            if (favBadge) {
                favBadge.textContent = initialFavs.length;
                favBadge.style.display = initialFavs.length > 0 ? 'flex' : 'none';
            }
            
            // 3. Revisa si la URL pide abrir favoritos
            try {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('ver') === 'favoritos') {
                    openFavoritesModal();
                }
            } catch (e) {
                console.error('Error al leer URL params:', e);
            }

        } catch (error) {
            console.error('Error al cargar productos:', error);
            if (productCounter) {
                productCounter.textContent = 'Error al cargar el catálogo.';
            }
        }
    }
    
    // === TAREA 4: EJECUTAR TODO ===
    cargarProductos();
    
});