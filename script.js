$(document).ready(function () {

  /* ========================================================
     DADOS DOS JOGOS (usados para renderização dinâmica)
  ======================================================== */
  const jogos = [
    {
      id: 1,
      nome: "GTA V",
      img: "./img/image copy.png",
      preco: 354.0,
      precoAntigo: 590.0,
      desconto: 40,
      categoria: "acao",
      gratis: false,
    },
    {
      id: 2,
      nome: "ROBLOX",
      img: "./img/image copy 3.png",
      preco: 0,
      categoria: "aventura",
      gratis: true,
    },
    {
      id: 3,
      nome: "NBA 2K22",
      img: "./img/image copy 4.png",
      preco: 297.0,
      precoAntigo: 990.0,
      desconto: 70,
      categoria: "esporte",
      gratis: false,
    },
    {
      id: 4,
      nome: "Dead by Daylight",
      img: "./img/image copy 5.png",
      preco: 214.5,
      precoAntigo: 429.0,
      desconto: 50,
      categoria: "terror",
      gratis: false,
    },
    {
      id: 5,
      nome: "ARK: Survival Evolved",
      img: "./img/image copy 6.png",
      preco: 430.0,
      categoria: "aventura",
      gratis: false,
    },
    {
      id: 6,
      nome: "Rocket League",
      img: "./img/image copy 7.png",
      preco: 0,
      categoria: "esporte",
      gratis: true,
    },
    {
      id: 7,
      nome: "Forza Horizon 5",
      img: "./img/image copy 2.png",
      preco: 356.0,
      precoAntigo: 890.0,
      desconto: 60,
      categoria: "corrida",
      gratis: false,
    },
    {
      id: 8,
      nome: "Cities: Skylines",
      img: "./img/image copy 8.png",
      preco: 590.0,
      categoria: "estrategia",
      gratis: false,
    },
  ];

  /* ========================================================
     CARRINHO (estado em memória)
  ======================================================== */
  let carrinho = [];

  function totalCarrinho() {
    return carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  }

  function qtdCarrinho() {
    return carrinho.reduce((acc, item) => acc + item.qtd, 0);
  }

  /* -------- Renderiza itens do carrinho -------- */
  function renderCarrinho() {
    const $lista = $("#carrinho-lista");
    $lista.empty();

    if (carrinho.length === 0) {
      $lista.html(`<p class="carrinho-vazio">Seu carrinho está vazio 🎮</p>`);
    } else {
      carrinho.forEach((item) => {
        $lista.append(`
          <div class="carrinho-item" data-id="${item.id}">
            <img src="${item.img}" alt="${item.nome}">
            <div class="carrinho-info">
              <span class="carrinho-nome">${item.nome}</span>
              <span class="carrinho-preco">R$ ${(item.preco * item.qtd).toFixed(2).replace(".", ",")}</span>
            </div>
            <div class="carrinho-controles">
              <button class="btn-qtd menos" data-id="${item.id}">−</button>
              <span>${item.qtd}</span>
              <button class="btn-qtd mais" data-id="${item.id}">+</button>
            </div>
            <button class="remover-item" data-id="${item.id}">✕</button>
          </div>
        `);
      });
    }

    $("#carrinho-total").text(`Total: R$ ${totalCarrinho().toFixed(2).replace(".", ",")}`);
    $("#carrinho-badge").text(qtdCarrinho());
    $("#carrinho-badge").toggle(qtdCarrinho() > 0);
  }

  /* -------- Adiciona ao carrinho -------- */
  function adicionarAoCarrinho(id) {
    const jogo = jogos.find((j) => j.id === id);
    if (!jogo || jogo.gratis) return;

    const existente = carrinho.find((item) => item.id === id);
    if (existente) {
      existente.qtd++;
    } else {
      carrinho.push({ ...jogo, qtd: 1 });
    }

    renderCarrinho();
    mostrarToast(`🛒 ${jogo.nome} adicionado ao carrinho!`);
    animarBotaoCompra(id);
  }

  /* -------- Toast de notificação -------- */
  function mostrarToast(msg) {
    const $toast = $(`<div class="toast">${msg}</div>`);
    $("body").append($toast);
    setTimeout(() => $toast.addClass("show"), 10);
    setTimeout(() => {
      $toast.removeClass("show");
      setTimeout(() => $toast.remove(), 300);
    }, 2500);
  }

  /* -------- Animação no botão de compra -------- */
  function animarBotaoCompra(id) {
    $(`.game-card[data-id="${id}"] .btn-comprar, .card[data-id="${id}"] button`)
      .addClass("adicionado")
      .text("✓ Adicionado");
    setTimeout(() => {
      $(`.game-card[data-id="${id}"] .btn-comprar, .card[data-id="${id}"] button`)
        .removeClass("adicionado")
        .text("Comprar");
    }, 1500);
  }

  /* ========================================================
     RENDERIZAÇÃO DINÂMICA: POPULAR GAMES
  ======================================================== */
  function renderJogos(lista) {
    const $grid = $(".games-grid");
    $grid.empty();

    if (lista.length === 0) {
      $grid.html(`<p class="sem-resultado">Nenhum jogo encontrado 😢</p>`);
      return;
    }

    lista.forEach((jogo) => {
      const precoHtml = jogo.gratis
        ? `<span class="free">Free Download</span>`
        : jogo.desconto
        ? `<div class="price">
             <span class="new">R$ ${jogo.preco.toFixed(2).replace(".", ",")}</span>
             <span class="discount">${jogo.desconto}%</span>
             <span class="old">R$ ${jogo.precoAntigo.toFixed(2).replace(".", ",")}</span>
           </div>`
        : `<span class="new">R$ ${jogo.preco.toFixed(2).replace(".", ",")}</span>`;

      const btnComprar = jogo.gratis
        ? `<button class="btn-comprar btn-free">Download Grátis</button>`
        : `<button class="btn-comprar" data-id="${jogo.id}">Comprar</button>`;

      $grid.append(`
        <div class="game-card" data-id="${jogo.id}" data-categoria="${jogo.categoria}">
          <img src="${jogo.img}" alt="${jogo.nome}" loading="lazy">
          <h3>${jogo.nome}</h3>
          ${precoHtml}
          ${btnComprar}
        </div>
      `);
    });

    /* Anima entrada dos cards */
    $(".game-card").each(function (i) {
      const $card = $(this);
      setTimeout(() => $card.addClass("visivel"), i * 80);
    });
  }

  /* Render inicial */
  renderJogos(jogos);

  /* ========================================================
     FILTRO POR CATEGORIA
  ======================================================== */
  $(".filtro-btn").on("click", function () {
    const cat = $(this).data("cat");
    $(".filtro-btn").removeClass("ativo");
    $(this).addClass("ativo");

    const filtrados = cat === "todos" ? jogos : jogos.filter((j) => j.categoria === cat);
    renderJogos(filtrados);
  });

  /* ========================================================
     BUSCA EM TEMPO REAL
  ======================================================== */
  $("#busca-jogo").on("input", function () {
    const termo = $(this).val().toLowerCase().trim();
    const resultado = jogos.filter((j) => j.nome.toLowerCase().includes(termo));
    renderJogos(resultado);
  });

  /* ========================================================
     EVENTOS DO CARRINHO (delegação)
  ======================================================== */

  /* Abre/fecha sidebar do carrinho */
  $("#btn-carrinho").on("click", function () {
    $("#sidebar-carrinho").toggleClass("aberto");
    $("#overlay").toggleClass("ativo");
  });

  $("#fechar-carrinho, #overlay").on("click", function () {
    $("#sidebar-carrinho").removeClass("aberto");
    $("#overlay").removeClass("ativo");
  });

  /* Delegar cliques de "Comprar" nos game-cards */
  $(document).on("click", ".btn-comprar:not(.btn-free)", function () {
    const id = parseInt($(this).data("id"));
    adicionarAoCarrinho(id);
  });

  /* Botões de quantidade no carrinho */
  $(document).on("click", ".btn-qtd.mais", function () {
    const id = parseInt($(this).data("id"));
    const item = carrinho.find((i) => i.id === id);
    if (item) { item.qtd++; renderCarrinho(); }
  });

  $(document).on("click", ".btn-qtd.menos", function () {
    const id = parseInt($(this).data("id"));
    const item = carrinho.find((i) => i.id === id);
    if (item) {
      item.qtd--;
      if (item.qtd <= 0) carrinho = carrinho.filter((i) => i.id !== id);
      renderCarrinho();
    }
  });

  /* Remover item */
  $(document).on("click", ".remover-item", function () {
    const id = parseInt($(this).data("id"));
    carrinho = carrinho.filter((i) => i.id !== id);
    renderCarrinho();
  });

  /* Botão finalizar compra */
  $("#btn-finalizar").on("click", function () {
    if (carrinho.length === 0) {
      mostrarToast("⚠️ Seu carrinho está vazio!");
      return;
    }
    const total = totalCarrinho().toFixed(2).replace(".", ",");
    mostrarToast(`✅ Compra finalizada! Total: R$ ${total}`);
    carrinho = [];
    renderCarrinho();
    $("#sidebar-carrinho").removeClass("aberto");
    $("#overlay").removeClass("ativo");
  });

  /* ========================================================
     BOTÕES "COMPRAR" DA SEÇÃO PROMOÇÕES (HTML estático)
  ======================================================== */
  $(".promocoes .card button").on("click", function () {
    const nome = $(this).closest(".card").find("h3").text();
    mostrarToast(`🎮 ${nome} adicionado ao carrinho!`);
    $(this).addClass("adicionado").text("✓ Adicionado");
    setTimeout(() => $(this).removeClass("adicionado").text("Comprar"), 1500);
  });

  /* ========================================================
     SMOOTH SCROLL NA NAVEGAÇÃO
  ======================================================== */
  $("nav a, header a").on("click", function (e) {
    const href = $(this).attr("href");
    if (href && href.startsWith("#") && href.length > 1) {
      e.preventDefault();
      const $alvo = $(href);
      if ($alvo.length) {
        $("html, body").animate({ scrollTop: $alvo.offset().top - 80 }, 600, "swing");
      }
    }
  });

  /* ========================================================
     ANIMAÇÃO DE ENTRADA POR SCROLL (Intersection Observer)
  ======================================================== */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $(entry.target).addClass("fade-in");
        }
      });
    },
    { threshold: 0.1 }
  );

  $(".card, .game-card, .coming-soon .card").each(function () {
    observer.observe(this);
  });

  /* ========================================================
     CONTADOR ANIMADO — "12.000+ gamers satisfeitos"
  ======================================================== */
  function animarContador($el, alvo, sufixo = "") {
    let atual = 0;
    const passo = Math.ceil(alvo / 60);
    const intervalo = setInterval(() => {
      atual = Math.min(atual + passo, alvo);
      $el.text(`${atual.toLocaleString("pt-BR")}+ ${sufixo}`);
      if (atual >= alvo) clearInterval(intervalo);
    }, 25);
  }

  const obsContador = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animarContador($(".testimonials h1"), 12000, "gamers satisfeitos");
        obsContador.disconnect();
      }
    });
  });

  if ($(".testimonials h1").length) {
    obsContador.observe($(".testimonials h1")[0]);
  }

  /* ========================================================
     ESTRELAS INTERATIVAS NOS DEPOIMENTOS
  ======================================================== */
  $(".stars").each(function () {
    $(this).html(`
      <span class="estrela" data-val="1">★</span>
      <span class="estrela" data-val="2">★</span>
      <span class="estrela" data-val="3">★</span>
      <span class="estrela" data-val="4">★</span>
      <span class="estrela active" data-val="5">★</span>
    `);
  });

  $(document).on("mouseenter", ".estrela", function () {
    const val = $(this).data("val");
    $(this).closest(".stars").find(".estrela").each(function () {
      $(this).toggleClass("hover", $(this).data("val") <= val);
    });
  }).on("mouseleave", ".stars", function () {
    $(this).find(".estrela").removeClass("hover");
  });

  /* ========================================================
     RENDER INICIAL DO CARRINHO
  ======================================================== */
  renderCarrinho();

});
