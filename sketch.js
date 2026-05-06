var TelaLargura = 400, TelaAltura = 400;
var TelaContar = 0, TelaTaxa = 30;
var EstrelaImagem, EstrelaDensidade = 20, EstralaTamanho = 7;
var NaveImagem, NaveY, NaveX, NaveVelocidade;
var Projetil = [], ProjetilVelocidade = 10;
var ProjetilFrequencia = 100;
var AsteroideImage, Asteroide = [];

function preload() {
  EstrelaImagem = loadImage('./star.gif');
  NaveImagem = loadImage('./nave.png');
  AsteroideImage = loadImage('./asteroid.gif');
}

function setup() {
  angleMode(DEGREES);
  frameRate(TelaTaxa);
  createCanvas(TelaLargura, TelaAltura);
  NovoJogo();
}

function draw() {
  background(0,0,0);
  TelaCalcular();
  Estrelas();
  NaveControle();
  ProjetilControle();
  AsteroideControle();
  asteroideColisao();
}

function NovoJogo() {
  //inicializa as variáveis do jogo
  NaveX = TelaLargura/2 - 20;
  NaveY = TelaAltura/2 - 20;
  NaveVelocidade = 10;
  Projetil = [];
  Asteroide = [];
}

function TelaCalcular() {
  //conta os quadros para controlar a frequência
  TelaContar++;
  if (TelaContar >= TelaTaxa) {
    TelaContar = 0;
  }
}

function Estrelas() {
  //desenha as estrelas
  for (var x = 0; x < EstrelaDensidade; x++) 
  {
    image(EstrelaImagem, random(0, TelaLargura), 
      random(0, TelaAltura), EstralaTamanho, EstralaTamanho);
  }
}

function NaveControle() {
  //controla a nave
  if (keyIsDown(UP_ARROW) && (NaveY > 0))
    NaveY -= NaveVelocidade;
  if (keyIsDown(DOWN_ARROW) && (NaveY < TelaAltura - 40))
    NaveY += NaveVelocidade;
  if (keyIsDown(LEFT_ARROW) && (NaveX > 0))
    NaveX -= NaveVelocidade;
  if (keyIsDown(RIGHT_ARROW) && (NaveX < TelaLargura - 40))
    NaveX += NaveVelocidade;

  image(NaveImagem, NaveX, NaveY, 40, 40);
}

function ProjetilControle() { 
  //dispara as balas em intervalos regulares de NaveBalaFrequencia milisegundos
  if (keyIsDown(32) 
  && (TelaContar % (TelaTaxa * ProjetilFrequencia / 1000) === 0)) {
    Projetil.push({ x: NaveX + 20, y: NaveY });
  }

  //desenha as balas e as move para cima
  for (var BalaCount = 0; BalaCount < Projetil.length; BalaCount++) {
    fill(255, 0, 0);
    rect(Projetil[BalaCount].x-2.5, Projetil[BalaCount].y, 5, 10);
    Projetil[BalaCount].y -= ProjetilVelocidade;
    if (Projetil[BalaCount].y < 0) {
      Projetil.splice(BalaCount, 1);
      BalaCount--;
    }
  }
}

function AsteroideControle() {
  //lógica para controlar os inimigos
  for (var i = 0; i < Asteroide.length; i++) {
    image(AsteroideImage, Asteroide[i].x, Asteroide[i].y, Asteroide[i].s, Asteroide[i].s);
    Asteroide[i].y += Asteroide[i].v; //move os inimigos para baixo
    if (Asteroide[i].y > TelaAltura) {
      Asteroide.splice(i, 1); //remove inimigo se sair da tela
      i--;
    }
  }
  //gera novos inimigos em intervalos regulares
  if (TelaContar % (TelaTaxa * 2000 / 1000) === 0) {
    Asteroide.push(
      { x: random(0, TelaLargura - 30),
        y: -30, 
        s: random(10, 30),
        v: random(1, 7) 
      }
    );
  }
} 

function asteroideColisao() {
  //verifica colisão entre os projéteis e os inimigos
  for (var i = 0; i < Asteroide.length; i++) { 
    for (var j = 0; j < Projetil.length; j++) {
      if (Projetil[j].x > Asteroide[i].x && Projetil[j].x < Asteroide[i].x + Asteroide[i].s &&
          Projetil[j].y > Asteroide[i].y && Projetil[j].y < Asteroide[i].y + Asteroide[i].s) {
        //colisão detectada, remove o inimigo e o projétil
        Asteroide.splice(i, 1);
        Projetil.splice(j, 1);
        i--;
        break;
      }   
    }
  }
}