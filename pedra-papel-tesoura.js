function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (!process.argv[2]) {
  console.log(
    "\nInsira os valores corretamente para jogar: \n<comando> <pedra/papel/tesoura>"
  );
} else {
  const valUser = process.argv[2].toLowerCase();
  let valBot = getRndInteger(1, 3);

  if (valUser === "pedra" || valUser === "papel" || valUser === "tesoura") {
    switch (valBot) {
      case 1:
        valBot = "pedra";
        break;
      case 2:
        valBot = "papel";
        break;
      case 3:
        valBot = "tesoura";
        break;
    }

    console.log(`\nVocê escolheu ${valUser} \nSeu oponente escolheu ${valBot}`);

    if (valUser === valBot) {
      console.log("\nEita, deu empate!");
    } else {

    switch ((valUser)) {
      case "pedra":
        if (valBot === "papel") {
          console.log("\nOh não, você perdeu!");
        } else if (valBot === "tesoura") {
          console.log("\nParabéns, você venceu!");
        }
        break
      case "papel":
        if (valBot === "tesoura") {
          console.log("\nOh não, você perdeu!");
        } else if (valBot === "pedra") {
          console.log("\nParabéns, você venceu!");
        }
        break
      case "tesoura":
        if (valBot === "pedra") {
          console.log("\nOh não, você perdeu!");
        } else if (valBot === "papel") {
          console.log("\nParabéns, você venceu!");
        }
        break
    }
}
  } else {
    console.log("\nColoque um valor aceitável: pedra, papel ou tesoura.");
  }
}
