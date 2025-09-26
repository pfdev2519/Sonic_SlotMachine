let totalScore = Number.parseInt(localStorage.getItem("score"))
  ? Number.parseInt(localStorage.getItem("score"))
  : Number(0);

const icon_width = 100;
const icon_height = 101.3;
const num_icons = 5;
const time_per_icon = 90;
const indexes = [0, 0, 0];
const iconMap = ["Sonic", "Robotnik", "Bar", "Jackpot", "Tails"];

const roll = (reel, offset = 0) => {
  const delta =
    (offset + 2) * num_icons + Math.round(Math.random() * num_icons);
  const style = getComputedStyle(reel),
    backgroundPositionY = parseFloat(style["background-position-y"]),
    targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
    normalTargetBackgroundPositionY =
      targetBackgroundPositionY % (num_icons * icon_height);

  return new Promise((resolve, reject) => {
    reel.style.transition = `background-position-y ${4 + delta * time_per_icon}ms cubic-bezier( 0.73, 0.07, 0.36, 0.94 )`;
    reel.style.backgroundPositionY = `${backgroundPositionY + delta * icon_height}px`;

    setTimeout(
      () => {
        reel.style.transition = "none";
        reel.style.backgroundPositionY = `${normalTargetBackgroundPositionY}px`;

        resolve(delta % num_icons);
      },
      4 + delta * time_per_icon,
    );
  });
};

function rollAll() {
  const reelLsList = document.querySelectorAll(".slot > .reel");

  Promise.all([...reelLsList].map((reel, i) => roll(reel, i))).then(
    (deltas) => {
      deltas.forEach(
        (delta, i) => (indexes[i] = (indexes[i] + delta) % num_icons),
      );
      indexes.map((index) => {});

      computeScore();

      displayScore();
    },
  );
}

function computeScore() {
  const spinResult = indexes.map((index) => iconMap[index]);
  console.log("Spin Result", spinResult);

  const countOccurrences = (arr, value) =>
    arr.filter((item) => item === value).length;

  if (countOccurrences(spinResult, "Sonic") === 3) {
    totalScore += 30;
    displayPoints("+ 30 points");
    localStorage.setItem("score", Number(totalScore));
  } else if (countOccurrences(spinResult, "Tails") === 3) {
    totalScore += 25;
    displayPoints("+ 25 points");
    localStorage.setItem("score", Number(totalScore));
  } else if (countOccurrences(spinResult, "Jackpot") === 3) {
    totalScore += 150;
    displayPoints("+ 150 points");
    localStorage.setItem("score", Number(totalScore));
  } else if (countOccurrences(spinResult, "Bar") === 1) {
    totalScore += 2;
    displayPoints("+ 2 points");
    localStorage.setItem("score", Number(totalScore));
  } else if (countOccurrences(spinResult, "Bar") === 2) {
    totalScore += 4;
    displayPoints("+ 4 points");
    localStorage.setItem("score", Number(totalScore));
  } else if (countOccurrences(spinResult, "Bar") === 3) {
    totalScore += 20;
    displayPoints("+ 20 points");
    localStorage.setItem("score", Number(totalScore));
  } else if (countOccurrences(spinResult, "Robotnik") === 3) {
    totalScore = totalScore > 100 ? (totalScore -= 100) : (totalScore = 0);
    displayPoints("LOSE 100 points");
    localStorage.setItem("score", Number(totalScore));
  } else if (
    countOccurrences(spinResult, "Robotnik") === 2 &&
    countOccurrences(spinResult, "Jackpot") === 1
  ) {
    totalScore = totalScore > 100 ? (totalScore -= 100) : (totalScore = 0);
    displayPoints("LOSE 100 points");
    localStorage.setItem("score", Number(totalScore));
  } else if (
    countOccurrences(spinResult, "Robotnik") === 1 &&
    countOccurrences(spinResult, "Jackpot") === 2
  ) {
    totalScore = totalScore > 100 ? (totalScore -= 100) : (totalScore = 0);
    displayPoints("LOSE 100 points");
    localStorage.setItem("score", Number(totalScore));
  } else if (
    countOccurrences(spinResult, "Sonic") === 2 &&
    countOccurrences(spinResult, "Jackpot") === 1
  ) {
    totalScore *= 2;
    displayPoints("+ 2X points");
    localStorage.setItem("score", Number(totalScore));
  } else if (
    countOccurrences(spinResult, "Tails") === 2 &&
    countOccurrences(spinResult, "Jackpot") === 1
  ) {
    totalScore *= 2;
    displayPoints("+ 2X points");
    localStorage.setItem("score", Number(totalScore));
  } else if (
    countOccurrences(spinResult, "Bar") === 2 &&
    countOccurrences(spinResult, "Jackpot") === 1
  ) {
    totalScore *= 2;
    displayPoints("+ 2X points");
    localStorage.setItem("score", Number(totalScore));
  } else if (
    countOccurrences(spinResult, "Sonic") === 1 &&
    countOccurrences(spinResult, "Jackpot") === 2
  ) {
    totalScore *= 4;
    displayPoints("+ 4X points");
    localStorage.setItem("score", Number(totalScore));
  } else if (
    countOccurrences(spinResult, "Tails") === 1 &&
    countOccurrences(spinResult, "Jackpot") === 2
  ) {
    totalScore *= 4;
    displayPoints("+ 4X points");
    localStorage.setItem("score", Number(totalScore));
  } else if (
    countOccurrences(spinResult, "Bar") === 1 &&
    countOccurrences(spinResult, "Jackpot") === 2
  ) {
    totalScore *= 4;
    displayPoints("+ 4X points");
    localStorage.setItem("score", Number(totalScore));
  }
}

function displayScore() {
  const currentScore = Number.parseInt(localStorage.getItem("score"));
  document.getElementById("score-panel").textContent = currentScore;
}

function resetScore() {
  totalScore = Number(0);
  localStorage.setItem("score", totalScore);
  console.log("Score reseted to: ", totalScore);
  location.reload();
}

function displayPoints(points) {
  document.getElementById("points").textContent = points;
  console.log(points);
  setTimeout(() => {
    document.getElementById("points").textContent = "";
  }, 2000);
}

window.onload = function () {
  displayScore();
};
