function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (!process.argv[2] || !process.argv[3]) {
    console.log("Insira os valores corretamente para jogar: \n<comando> <par-ou-impar> <seu-valor>")
} else {

const timeUser = process.argv[2].toLowerCase()
const timeBot = timeUser === "par" ? "impar" : "par";

const numUser = +process.argv[3];
const numBot = getRndInteger(0, 10);

const numTotal = numUser + numBot;
const timeVencedor = (numTotal % 2 === 0 ? "par" : "impar")
const jogadorVencedor = ( timeVencedor === timeUser ? "você usuário, parabéns!" : "o bot, a dominação está chegando..." )

console.log(`---------------------- \nBem vindo ao jogo de par ou impar! \nVocê escolheu ${timeUser} e jogou o valor ${numUser} \nSeu adversário ficou com o ${timeBot} e jogou o valor ${numBot} \nE o vencedor dessa disputa é ${jogadorVencedor} \n----------------------`)
}