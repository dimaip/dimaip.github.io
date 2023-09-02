
const startDate = new Date("Jun 17, 2020 00:00:00").getTime();

const x = setInterval(function() {
  const now = new Date().getTime();
  const distance = now - startDate;

  const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
  const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById(
    "countdown"
  ).innerHTML = `Антон прохлаждается ${years} года ${days} дней ${hours} часов ${minutes} минут ${seconds} секунд`;

}, 1000);
