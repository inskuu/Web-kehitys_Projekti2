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

function haeHahmo(nimi) {
// Ajax pyynnön lähetys
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET","https://hp-api.onrender.com/api/characters",true);
xmlhttp.send();

//Vastauksen saanti
xmlhttp.onreadystatechange=function() {
if (xmlhttp.readyState==4 &&
xmlhttp.status==200) {

//Etsi oikea hahmo nimen perusteella ja näytä tiedot kortissa
      const tiedot = JSON.parse(xmlhttp.responseText);
      const hahmo = tiedot.find(h => h.name === nimi);
    
      document.querySelector("#hahmoKortti").innerHTML = `
      <h1>${hahmo.name}</h1>

     <h2>Alternate names</h2>
  <p>${hahmo.alternate_names}</p> 

  <h2>Date of birth</h2>
  <p>${hahmo.dateOfBirth}</p>

<h2>Ancestry</h2>
  <p>${hahmo.ancestry}</p>

  <h2>House</h2>
  <p>${hahmo.house}</p>

  <h2>Patronus</h2>
  <p>${hahmo.patronus}</p>

  <h2>Actor</h2>
  <p>${hahmo.actor}</p>

  <h2>Alive status</h2>
  <p>${hahmo.alive ? "Yes" : "No"}</p>

  <div class="kortti-kuva">
  ${hahmo.image ? `<img src="${hahmo.image}" alt="${hahmo.name}">` : ""}
  </div>
`;
}
}
}

//Lisää kuvalliset hahmot oikeisiin alasvetovalikkoihin
let hahmot = [];

fetch("https://hp-api.onrender.com/api/characters")
  .then(response => response.json())
  .then(data => {
    hahmot = data;
    taytaValikot();
  });

function taytaValikot() {
    const opiskelijat = hahmot.filter(h => h.hogwartsStudent && h.image);
    const opettajat = hahmot.filter(h => h.hogwartsStaff  && h.image);

    const opiskelijalista = document.querySelector("#opiskelijatLista");
    const opettajalista = document.querySelector("#opettajatLista");

    
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
}

//Etsi hakukentästä tuvan nimellä tai sen osalla
const hakukentta = document.querySelector("#hakukentta");
const hakutulokset = document.querySelector("#hakuTulokset");
const hakunappi =document.querySelector("#hakunappi")

hakunappi.addEventListener("click", function() {
const sana = hakukentta.value.trim().toLowerCase();

const tulokset = hahmot.filter(h => h.house && h.house.toLowerCase().includes(sana));

 //Tyhjennä vanhat tulokset
    hakutulokset.innerHTML = "";

//Lisää tuvan nimi otsikoksi
    const houseName = tulokset[0].house;
    hakutulokset.innerHTML += `
        <h2 class="house-title">${houseName}</h2>
        <hr>`;

//Lisää hahmot listaan
  tulokset.forEach(h => {
    const div = document.createElement("div");
    div.className = "house-item";

    div.innerHTML = `
      <strong>${h.name}</strong><br>
       ${h.hogwartsStudent ? "Student" : h.hogwartsStaff ? "Teacher" : "Other"}<br>
      <hr>
    `;

        hakutulokset.appendChild(div);
    });
});


