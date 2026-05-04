//Käännökset
const kaannokset = {
    ancestry: {
        "pure-blood": "Puhdasverinen",
        "half-blood": "Puoliverinen",
        "muggleborn": "Jästisyntyinen",
        "squib": "Surkki",
        "": "Tuntematon"
    },
    house: {
        "Gryffindor": "Rohkelikko",
        "Slytherin": "Luihuinen",
        "Hufflepuff": "Puuskupuh",
        "Ravenclaw": "Korpinkynsi",
        "": "Tuntematon"
    },
    patronus: {
        "stag": "Uroshirvi",
        "otter": "Saukko",
        "Jack Russel terrier": "Jack Russelin terrieri",
        "swan": "Joutsen",
        "hare": "Jänis",
        "horse": "Hevonen",
        "tabby cat": "Kissa",
        "doe": "Naarashirvi",
        "wolf": "Susi",
        "persian cat": "Kissa",
        "weasel": "Kärppä",
        "lynx": "Ilves",
        "non-corporeal": "Aineeton",
        "": "Tuntematon"
    }
}


//Hae hahmon tiedot klikkaamalla nimeä
document.querySelectorAll(".valikonsisalto").forEach(valikko => {
  valikko.addEventListener("click", function (e) {
    e.preventDefault();

    if (e.target.tagName === "A") {
      const hahmonNimi = e.target.dataset.name;
      haeHahmo(hahmonNimi); 
    }
  });
});

let hahmot = [];

//Lataa kaikki hahmot
function lataaHahmot() {
// Ajax pyynnön lähetys
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET","https://hp-api.onrender.com/api/characters",true);
xmlhttp.send();

//Vastauksen käsittely
xmlhttp.onreadystatechange=function() {
if (xmlhttp.readyState==4 &&
xmlhttp.status==200) {

//Parsitaan JSON ja tallennetaan hahmolista    
    const tiedot = JSON.parse(xmlhttp.responseText);
    hahmot = tiedot;
    taytaValikot();
}
};
}

lataaHahmot();

//Hae yksittäinen hahmo ja sen lisää sen tiedot hahmokortille
    function haeHahmo(nimi) {
    const hahmo = hahmot.find(hahmo => hahmo.name === nimi);
    
      document.querySelector("#hahmoKortti").innerHTML = `
      <h1>${hahmo.name}</h1>
<hr>
     <h3>Muut nimet</h3>
  <p>${hahmo.alternate_names.join(", ") || "-"}</p> 

  <h3>Syntymäaika</h3>
  <p>${hahmo.dateOfBirth || "Ei tiedossa"}</p>

<h3>Syntyperä</h3>
  <p>${kaannokset.ancestry[hahmo.ancestry]}</p>

  <h3>Tupa</h3>
  <p>${kaannokset.house[hahmo.house]}</p>

  <h3>Suojelius</h3>
  <p>${kaannokset.patronus[hahmo.patronus]}</p>

   <h3>Status</h3>
  <p>${hahmo.alive ? "Elossa" : "Kuollut"}</p>

  <h3>Näyttelijä</h3>
  <p>${hahmo.actor}</p>

  <div class="kortti-kuva">
  ${hahmo.image ? `<img src="${hahmo.image}" alt="${hahmo.name}" class="hahmokuva">` : ""}
  </div>
`;
}

//Lisää kuvalliset hahmot oikeisiin alasvetovalikkoihin
function taytaValikot() {
    const opiskelijat = hahmot.filter(h => h.hogwartsStudent && h.image);
    const opettajat = hahmot.filter(h => h.hogwartsStaff  && h.image);
    const muut = hahmot.filter(h => !h.hogwartsStudent && !h.hogwartsStaff && h.image);

    const opiskelijalista = document.querySelector("#opiskelijatLista");
    const opettajalista = document.querySelector("#opettajatLista");
    const muutlista = document.querySelector("#muutLista");

    
  opiskelijat.forEach(hahmo => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = hahmo.name;
    a.dataset.name = hahmo.name;
    opiskelijalista.appendChild(a);
  });

  opettajat.forEach(hahmo => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = hahmo.name;
    a.dataset.name = hahmo.name;
    opettajalista.appendChild(a);
  });

    muut.forEach(hahmo => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = hahmo.name;
    a.dataset.name = hahmo.name;
    muutlista.appendChild(a);
  });
}

//Etsi hakukentästä tuvan nimellä tai sen osalla
function haeTupa(tupa) {
const tulokset = hahmot.filter(hahmo => kaannokset.house[hahmo.house] && kaannokset.house[hahmo.house].toLowerCase().includes(tupa));

 //Tyhjennä vanhat tulokset
const hakutulokset = document.querySelector("#hakuTulokset");
hakutulokset.innerHTML = "";


    if (tulokset.length === 0) {
        hakutulokset.innerHTML = "<h1 class = 'virhe'>Ei hakutuloksia</h1>";
        return;
    }

//Lisää tuvan nimi otsikoksi
    const houseName = tulokset[0].house;
    hakutulokset.innerHTML += `
        <h1>${kaannokset.house[houseName]}</h1>
        <hr>`;

//Lisää hahmot listaan
  tulokset.forEach(h => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${h.name}</strong>
       ${h.hogwartsStudent ? "Oppilas" : h.hogwartsStaff ? "Opettaja" : "Muu"}<br><br>
    `;

        hakutulokset.appendChild(div);
    });
};

//Hakunappi hakee hahmot tuvan perusteella. Napin painaminen tyhjentää hakukentän.
const hakunappi = document.querySelector("form");
const hakukentta = document.querySelector("#hakukentta");
const alkuperainenPlaceholder = hakukentta.placeholder;

hakunappi.addEventListener("submit", function(e) {
    e.preventDefault();
const sana = hakukentta.value.trim().toLowerCase();

//Lisää virhe, jos tyhjä haku tai väärä hakusana
if (sana === "") {
  hakukentta.placeholder = "Yritä uudestaan";
  hakukentta.classList.add("virhe");
  return; 
}

hakukentta.classList.remove("virhe");
hakukentta.placeholder = alkuperainenPlaceholder;
haeTupa(sana);
hakukentta.value ="";
});

//Palauta hakukenttä ennalleen, kun aloitetaan uusi haku
hakukentta.addEventListener("input", function () {
    hakukentta.classList.remove("virhe");
    hakukentta.placeholder = alkuperainenPlaceholder;
});
