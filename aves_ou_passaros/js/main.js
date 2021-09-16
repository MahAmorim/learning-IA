// Matriz de elementos para busca
var ce = [
  {
    numero: "1",
    Dedos: "Anisodáctilo",
    Habilidades: "Canto",
    Conclusao: "É um pássaro",
  },
  {
    numero: "2",
    Dedos: "Anisodáctilo",
    Habilidades: "Nenhuma",
    Conclusao: "Não é um pássaro",
  },
  {
    numero: "3",
    Dedos: "Zigodáctilo",
    Habilidades: "Canto",
    Conclusao: "Não é um pássaro",
  },
  {
    numero: "4",
    Dedos: "Zigodáctilo",
    Habilidades: "Nenhuma",
    Conclusao: "Não é um pássaro",
  },
  {
    numero: "5",
    Dedos: "Heterodáctilo",
    Habilidades: "Canto",
    Conclusao: "Não é um pássaro",
  },
  {
    numero: "6",
    Dedos: "Heterodáctilo",
    Habilidades: "Nenhuma",
    Conclusao: "Não é um pássaro",
  },
  {
    numero: "7",
    Dedos: "Pamprodáctilo",
    Habilidades: "Canto",
    Conclusao: "Não é um pássaro",
  },
  {
    numero: "8",
    Dedos: "Pamprodáctilo",
    Habilidades: "Nenhuma",
    Conclusao: "Não é um pássaro",
  },
  {
    numero: "9",
    Dedos: "Perissodáctilos",
    Habilidades: "Canto",
    Conclusao: "Não é um pássaro",
  },
  {
    numero: "10",
    Dedos: "Perissodáctilos",
    Habilidades: "Nenhuma",
    Conclusao: "Não é um pássaro",
  },
];

// Propriedades a serem avaliadas
var pr = ["Dedos", "Habilidades"];
//var pr = ['Dedos', 'Habilidades'];
var modelo;

$(document).ready(function () {
  modelo = induzir_arvore(ce, "Conclusao", pr);
  console.log(modelo);
});

function buscar() {
  $dd = $("#dd").val();
  $hs = $("#hs").val();
  $conclusao = $("#conclusao");

  var amostra = {
    Dedos: $dd,
    Habilidades: $hs,
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
