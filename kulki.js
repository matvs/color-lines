"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var bok = 50; // dlugosc boku jednego pola planszy;
var level;
var kolory_next = [];
var kolka = []; // tablica docelowo dwumwymiarowa bedaca modelem planszy
var clicknr; //zmienna okreslajaca numer klikniecia
//var odwiedzone=[];
var wynik;
var outWynik;
var koniec_gry;
window.addEventListener('load', function () {
    var game = new game_1.Game();
});
/*


function los_kolory(tryb) {
    var los;
    if (tryb == "trzy")
        for (var i = 3; i < 6; ++i) {
            los = Math.floor(Math.random() * level);
            kolory_next[i] = kolory[los];
        }

    if (tryb == "piec")
        for (var i = 0; i < 5; ++i) {
            los = Math.floor(Math.random() * level);
            kolory_next[i] = kolory[los];
        }

}

function los(ile) {
    if (przegrana()) { koniec_gry = true; alert("Przegrales! \n Zdobyles " + wynik + " punktow"); return; }
    var i = 0;
    while (i < ile) {
        var x = Math.round(Math.random() * 490) + 50;
        var y = Math.round(Math.random() * 490) + 50;
        var koniec = false;
        for (var yy = 50; (!koniec) && yy <= 490; yy += bok + 5)
            for (var xx = 50; xx <= 490; xx += bok + 5) if (x >= xx && x <= xx + (bok + 5) && y >= yy && y <= yy + (bok + 5)) {
                x = xx;
                y = yy;
                koniec = true;
                break;
            }
        if ((kolka[(y - 50) / (bok + 5)][(x - 50) / (bok + 5)]).widoczny == false) {
            if (level > 1) (kolka[(y - 50) / (bok + 5)][(x - 50) / (bok + 5)]).kolor = kolory_next[i];
            (kolka[(y - 50) / (bok + 5)][(x - 50) / (bok + 5)]).rysuj();
            if (przegrana()) { koniec_gry = true; alert("Przegrales! \n Zdobyles " + wynik + " punktow"); return; }
            ++i;
        }
    }
    if (level > 1) {
        los_kolory("trzy");
        kolory_next[0] = kolory_next[3]; kolory_next[1] = kolory_next[4]; kolory_next[2] = kolory_next[5];
        wyswietl_nastepne();
    }

}


function wyswietl_nastepne() {
    var y = 25;
    for (x = 380; x <= 450; x += 35) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.arc(x, y, (bok / 3) - 3, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.fillStyle = kolory_next[3 + (x - 380) / 35];
        this.ctx.arc(x, y, (bok / 3) - 3, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}

function przegrana() {
    for (var i = 0; i < 9; ++i)
        for (var j = 0; j < 9; ++j)
            if (kolka[i][j].widoczny == false) return false
    return true;
}



function punkty() {
    var kolor;

    var udalo_sie = false;

    var nr_wiersza = 0;
    var poczatek_poziom = 0;
    var length_poziom = 0;
    var koniec = false;
    for (var i = 0; (!koniec) && i < 9; ++i)
        for (var j = 0; j < 9; ++j) {
            if (kolka[i][j].widoczny == true) {
                kolor = kolka[i][j].kolor;
                poczatek_poziom = j;
                ++j;
                while (j < 9 && kolka[i][j].widoczny == true && kolka[i][j].kolor == kolor) ++j;
                length_poziom = j - poczatek_poziom;
                if (length_poziom >= 5) { koniec = true; nr_wiersza = i; udalo_sie = true; break; }
                else { --j; continue; }
            }
        }


    var nr_kolumny = 0;
    var poczatek_pion = 0;
    var length_pion = 0;
    koniec = false;
    for (var i = 0; (!koniec) && i < 9; ++i)
        for (var j = 0; j < 9; ++j) {
            if (kolka[j][i].widoczny == true) {
                kolor = kolka[j][i].kolor;
                poczatek_pion = j;
                ++j;
                while (j < 9 && kolka[j][i].widoczny == true && kolka[j][i].kolor == kolor) ++j;
                length_pion = j - poczatek_pion;
                if (length_pion >= 5) { koniec = true; nr_kolumny = i; udalo_sie = true; break; }
                else { --j; continue; }
            }
        }


    var przesuniecie_skos_lp_wier = 0;
    var poczatek_skos_lp = 0;
    var length_skos_lp = 0;
    koniec = false;
    var koniec_skos_lp = false;
    for (j = 0; (!koniec) && j < 5; ++j)
        for (var i = 0; i < 9 - j; ++i) {
            if (kolka[i + j][i].widoczny == true) {
                kolor = kolka[i + j][i].kolor;
                poczatek_skos_lp = i;
                while (i < 9 - j && kolka[i + j][i].widoczny == true && kolka[i + j][i].kolor == kolor) ++i;
                length_skos_lp = i - poczatek_skos_lp;
                if (length_skos_lp >= 5) { koniec = true; koniec_skos_lp = true; przesuniecie_skos_lp_wier = j; udalo_sie = true; break; }
                else { --i; continue; }
            }
        }

    var przesuniecie_skos_lp_kol = 0;
    if (!koniec_skos_lp) {
        koniec = false;
        for (j = 0; (!koniec) && j < 5; ++j)
            for (var i = 0; i < 9 - j; ++i) {
                if (kolka[i][i + j].widoczny == true) {
                    kolor = kolka[i][i + j].kolor;
                    poczatek_skos_lp = i;
                    while (i < 9 - j && kolka[i][i + j].widoczny == true && kolka[i][i + j].kolor == kolor) ++i;
                    length_skos_lp = i - poczatek_skos_lp;
                    if (length_skos_lp >= 5) { koniec = true; przesuniecie_skos_lp_kol = j; udalo_sie = true; break; }
                    else { --i; continue; }
                }
            }
    }


    var przesuniecie_skos_pl_kol = 0;
    var poczatek_skos_pl = 0;
    var length_skos_pl = 0;
    koniec = false;
    var koniec_skos_pl = false;
    for (j = 8; (!koniec) && j >= 4; --j)
        for (var i = 0; i < 9 - (8 - j); ++i) {
            if (kolka[i][j - i].widoczny == true) {
                kolor = kolka[i][j - i].kolor;
                poczatek_skos_pl = i;
                while (i < 9 - (8 - j) && kolka[i][j - i].widoczny == true && kolka[i][j - i].kolor == kolor) ++i;
                length_skos_pl = i - poczatek_skos_pl;
                if (length_skos_pl >= 5) { koniec = true; koniec_skos_pl = true; przesuniecie_skos_pl_kol = j; udalo_sie = true; break; }
                else { --i; continue; }
            }
        }

    var przesuniecie_skos_pl_wier = 0;

    if (!koniec_skos_pl) {
        koniec = false;
        for (var j = 0; (!koniec) && j < 5; ++j)
            for (var i = j; i < 9; ++i) {
                if (kolka[8 - i + j][i].widoczny == true) {
                    kolor = kolka[8 - i + j][i].kolor;
                    poczatek_skos_pl = i;
                    while (i < 9 && kolka[8 - i + j][i].widoczny == true && kolka[8 - i + j][i].kolor == kolor) ++i;
                    length_skos_pl = i - poczatek_skos_pl;
                    if (length_skos_pl >= 5) { koniec = true; przesuniecie_skos_pl_wier = j; udalo_sie = true; break; }
                    else { --i; continue; }
                }
            }
    }

    if (length_poziom >= 5) {
        for (var i = poczatek_poziom; i < poczatek_poziom + length_poziom; ++i) kolka[nr_wiersza][i].usun();
        wynik += length_poziom;
        outWynik.innerHTML = wynik;
    }

    if (length_pion >= 5) {
        for (var i = poczatek_pion; i < poczatek_pion + length_pion; ++i) kolka[i][nr_kolumny].usun();
        wynik += length_pion;
        outWynik.innerHTML = wynik;
    }

    if (length_skos_lp >= 5) {
        for (var i = poczatek_skos_lp; i < poczatek_skos_lp + length_skos_lp; ++i) kolka[i + przesuniecie_skos_lp_wier][i + przesuniecie_skos_lp_kol].usun();
        wynik += length_skos_lp;
        outWynik.innerHTML = wynik;
    }

    if (length_skos_pl >= 5) {
        for (var i = poczatek_skos_pl; i < poczatek_skos_pl + length_skos_pl; ++i) kolka[Math.abs(8 * (przesuniecie_skos_pl_wier == 0 ? 0 : 1) + przesuniecie_skos_pl_wier - i)][Math.abs(przesuniecie_skos_pl_kol - i)].usun();
        wynik += length_skos_pl;
        outWynik.innerHTML = wynik;
    }

    if (udalo_sie) return true;
    else return false;

}



 */ 
