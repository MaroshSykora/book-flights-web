/* Tento kód zajišťuje, že všechny akce definované uvnitř funkce se spustí až po načtení celého obsahu stránky (tj. po události DOMContentLoaded). Je to důležité, protože chceme mít jistotu, že všechny prvky DOM jsou plně načtené a dostupné před tím, než se na ně začneme odkazovat. */
document.addEventListener("DOMContentLoaded", () => {
  // Prvek pro výběr destinace.
  const destinationSelect = document.querySelector("#destinace-vyber");
  // Prvek pro výběr počtu cestujících.
  const passengersSelect = document.querySelector("#passengers");
  // Prvek pro označení zpáteční cesty.
  const returnCheckbox = document.querySelector("#returnCheckbox");
  // Radio buttony pro výběr třídy letu.
  const radioButtons = document.querySelectorAll('input[name="exampleRadios"]');
  // Pole pro zadání částky, kterou je uživatel ochoten utratit.
  const amountInput = document.querySelector("#amountToSpend");
  // Tlačítko pro kontrolu rozpočtu.
  const checkButton = document.querySelector("#button-addon2");
  // Prvek pro zobrazení celkové ceny.
  const vysledekCeny = document.querySelector("#vysledekCeny");
  // Prvek pro zobrazení výsledku, zda uživatel má dostatek peněz.
  const resultAmount = document.querySelector("#resultAmount");

  // Ceny pro jednotlivé destinace.
  const prices = {
    Prague: 500,
    Frankfurt: 3000,
    "New York": 15000,
    Sydney: 30000,
  };

  // Funkce pro výpočet ceny pouze pro aktuálně vybranou třídu.
  const updatePricesForClass = () => {
    // Získání hodnoty vybrané destinace.
    const destination = destinationSelect.value;
    // Získání počtu cestujících jako číslo.
    const passengers = parseInt(passengersSelect.value, 10);
    // Zjistit, zda je zaškrtnuta zpáteční cesta.
    const isRoundTrip = returnCheckbox.checked;

    // Získání základní ceny pro vybranou destinaci.
    let basePrice = prices[destination] || 0;
    let multiplier = 1;

    // Pokud je vybraná zpáteční cesta, cena se zdvojnásobí.
    if (isRoundTrip) {
      basePrice *= 2;
    }

    //  radioButtons.forEach((radio) => { ... }): Prochází všechny radio buttony (volby třídy) a zjišťuje, který z nich je vybraný (radio.checked).
    // Určení multiplikátoru na základě vybrané třídy.
    radioButtons.forEach((radio) => {
      if (radio.checked) {
        switch (radio.value) {
          case "economy":
            // Multiplikátor pro ekonomickou třídu je 1 (bez příplatku).
            multiplier = 1;
            break;
          case "business":
            // Multiplikátor pro business třídu je 1.25 (příplatek 25%).
            multiplier = 1.25;
            break;
          case "royal":
            // Multiplikátor pro royal třídu je 1.5 (příplatek 50%).
            multiplier = 1.5;
            break;
        }
      }
    });

    // Výpočet celkové ceny.
    const totalPrice = basePrice * multiplier * passengers;

    // Resetování textu cen pro všechny třídy na prázdné hodnoty.
    document.querySelector("#vystupCenyEconomy").textContent = "Economy class:";
    document.querySelector("#vystupCenyBusiness").textContent =
      "Business class:";
    document.querySelector("#vystupCenyRoyal").textContent = "Royal class:";

    // Zobrazení ceny pouze pro vybranou třídu.
    radioButtons.forEach((radio) => {
      if (radio.checked) {
        // Získání prvku pro zobrazení ceny podle vybrané třídy.
        const classPriceElem = document.querySelector(
          "#vystupCeny" +
            radio.value.charAt(0).toUpperCase() +
            radio.value.slice(1)
        );
        // Nastavení textu s cenou pro vybranou třídu.
        classPriceElem.textContent =
          radio.value.charAt(0).toUpperCase() +
          radio.value.slice(1) +
          " class: " +
          totalPrice.toFixed(2) +
          " CZK";
      }
    });

    // Zobrazení celkové ceny.
    vysledekCeny.textContent = "Total price: " + totalPrice.toFixed(2) + " CZK";
  };

  // Funkce pro kontrolu rozpočtu.
  const checkAmount = () => {
    // Získání celkové ceny z textu a převod na číslo.
    const totalPrice =
      parseFloat(
        vysledekCeny.textContent
          .replace("Total price: ", "")
          .replace(" CZK", "")
      ) || 0;
    // Získání částky, kterou je uživatel ochoten utratit, a převod na číslo.
    const amountToSpend = parseFloat(amountInput.value) || 0;

    // Porovnání rozpočtu s celkovou cenou.
    if (amountToSpend >= totalPrice) {
      resultAmount.innerHTML =
        "<span style='color: green;'>Sufficient funds.</span>";
    } else {
      // Výpočet nedostatku peněz.
      const deficit = totalPrice - amountToSpend;
      resultAmount.innerHTML =
        "<span style='color: red;'>Insufficient funds. You are short by " +
        deficit.toFixed(2) +
        " CZK.</span>";
    }
  };
  // Zacatek zakazu specialnich znaku

  const textArea = document.getElementById("textArea");

  textArea.addEventListener("input", () => {
    // Přijímáme pouze alfanumerické znaky a mezery
    textArea.value = textArea.value.replace(/[^\w\s]/gi, "");
  });

  // Konec zakazu specialnich znaku

  // Přidání posluchačů událostí pro změnu vstupů a kontrolu rozpočtu.
  destinationSelect.addEventListener("change", updatePricesForClass);
  passengersSelect.addEventListener("change", updatePricesForClass);
  returnCheckbox.addEventListener("change", updatePricesForClass);
  radioButtons.forEach((radio) =>
    radio.addEventListener("change", updatePricesForClass)
  );
  checkButton.addEventListener("click", checkAmount);

  // Počáteční výpočet ceny.
  updatePricesForClass();
});
