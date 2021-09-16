// Matriz de elementos para busca
var ce = [
  {
    numero: "1",
    Gênero: "Gênero de ficção",
    Temática: "Temas relacionados a ciência e sociedade no futuro",
    Conclusao: "Ficção científica",
  },
  {
    numero: "2",
    Gênero: "Gênero de ficção",
    Temática: "Temática de acontecimentos históricos reais",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "3",
    Gênero: "Gênero de ficção",
    Temática: "Temática envolvente em conflitos de sentimentos",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "4",
    Gênero: "Gênero de ficção",
    Temática: "Temática de histórias de pessoas reais",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "5",
    Gênero: "Gênero de ficção",
    Temática: "Casal apaixonado como protagonistas",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "6",
    Gênero: "Gênero de ficção",
    Temática: "Humor ácido",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "7",
    Gênero: "Gênero de ficção",
    Temática: "Elementos mágicos ou sobrenaturais",
    Conclusao: "Fantasia",
  },
  {
    numero: "8",
    Gênero: "Gênero reflexivo",
    Temática: "Temática de acontecimentos históricos reais",
    Conclusao: "Histórico",
  },
  {
    numero: "9",
    Gênero: "Gênero reflexivo",
    Temática: "Temática envolvente em conflitos de sentimentos",
    Conclusao: "Drama",
  },
  {
    numero: "10",
    Gênero: "Gênero reflexivo",
    Temática: "Temática de histórias de pessoas reais",
    Conclusao: "Bibliográfico",
  },
  {
    numero: "11",
    Gênero: "Gênero reflexivo",
    Temática: "Casal apaixonado como protagonistas",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "12",
    Gênero: "Gênero reflexivo",
    Temática: "Humor ácido",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "13",
    Gênero: "Gênero reflexivo",
    Temática: "Temas relacionados a ciência e sociedade no futuro",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "14",
    Gênero: "Gênero reflexivo",
    Temática: "Elementos mágicos ou sobrenaturais",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "15",
    Gênero: "Gênero de comédia",
    Temática: "Temática de acontecimentos históricos reais",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "16",
    Gênero: "Gênero de comédia",
    Temática: "Temática envolvente em conflitos de sentimentos",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "17",
    Gênero: "Gênero de comédia",
    Temática: "Temática de histórias de pessoas reais",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "18",
    Gênero: "Gênero de comédia",
    Temática: "Casal apaixonado como protagonistas",
    Conclusao: "Comédia romântica",
  },
  {
    numero: "19",
    Gênero: "Gênero de comédia",
    Temática: "Humor ácido",
    Conclusao: "Comédia besteirol",
  },
  {
    numero: "20",
    Gênero: "Gênero de comédia",
    Temática: "Temas relacionados a ciência e sociedade no futuro",
    Conclusao: "Categoria não encontrada",
  },
  {
    numero: "21",
    Gênero: "Gênero de comédia",
    Temática: "Elementos mágicos ou sobrenaturais",
    Conclusao: "Categoria não encontrada",
  },
];

// Propriedades a serem avaliadas
var pr = ["Gênero", "Temática"];
//var pr = ['Gênero', 'Temática'];
var modelo;

$(document).ready(function () {
  modelo = induzir_arvore(ce, "Conclusao", pr);
  console.log(modelo);
});

function buscar() {
  $g = $("#g").val();
  $t = $("#t").val();
  $conclusao = $("#conclusao");

  var amostra = {
    Gênero: $g,
    Temática: $t,
  };
  var pred = predicao(modelo, amostra);

  $conclusao.text("?");

  setTimeout(function () {
    $conclusao.text(pred);
  }, 1000);
}

// Função induzir arvore do livro
var induzir_arvore = function (ce, alvo, pr) {
  let targets = unicos(filtrarPorPropriedade(ce, alvo));

  if (targets.length == 1) {
    // Todos elementos de CE são da mesma classe
    return { tipo: "resultado", valor: targets[0], rotulo: targets[0] };
  } else if (pr.length == 0) {
    // retornar nó folha rotulado com a disjunção de todas as classes de CE

    // Pega as classes restantes (sem repetição) e tras em forma de array
    var classesRestantes = unicos(filtrarPorPropriedade(ce, alvo));

    // // Cria o texto trocando as virgulas por "OU"
    var disjuncao = classesRestantes.toString().replace(/[,]/g, " ou ");

    return { tipo: "resultado", valor: disjuncao, rotulo: disjuncao };
  } else {
    // retira uma propriedade p das propriedades ( por ordem da fila )
    var p = pr.shift();

    // evita passar a referencia para a proxima chamada
    var copiadePr = null;

    // cria um nó rotulado com p
    var nodo = { tipo: "propriedade", rotulo: p };

    // Pega os valores da coluna de propriedade p
    var valoresDeP = unicos(filtrarPorPropriedade(ce, p));

    nodo.valores = valoresDeP.map(function (v) {
      copiadePr = copia(pr);

      // Pega todas as linhas que tem o valor de P do momento
      var particao = ce.filter(function (x) {
        return x[p] == v;
      });

      var nodo_filho = { rotulo: v, tipo: "propriedade_valor" };

      nodo_filho.filho = induzir_arvore(particao, alvo, copiadePr);

      return nodo_filho;
    });

    return nodo;
  }
};

var filtrarPorPropriedade = function (ce, prop) {
  // Filtra o conjunto de exemplos pela propriedade alvo
  return ce.map(function (obj) {
    return obj[prop];
  });
};

// recebe um array e o retorna sem elementos repetidos
var unicos = function (array) {
  return array.filter(function (obj, index) {
    return array.indexOf(obj) == index;
  });
};

// Função que prediz o risco com base no modelo aprendido e numa amostra de entrada do usuário
var predicao = function (modelo, amostra) {
  // Arvore de valores aprendidos
  var root = modelo;

  // Enquanto não for noh resultado (folha do ramo)
  while (root.tipo != "resultado") {
    var amostraVal = amostra[root.rotulo];

    // Encontrar entre os ramos do noh um ramo que tenha um noh rotulado com o valor da amostra
    var nodo_filho = _.find(root.valores, function (nodo) {
      return nodo.rotulo == amostraVal;
    });

    root = nodo_filho.filho;
  }
  return root.valor;
};

function copia(estado) {
  // retorna uma copia do estado
  var retorno = [];
  for (var i = 0; i < estado.length; i++) {
    // copia elementos do array
    retorno[i] = estado[i].slice(0); // necessario para evitar a copia por referencia
  }
  return retorno;
}
