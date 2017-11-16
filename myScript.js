var rgxLletra = /[A-Za-zÀàÈèÉéÍíÏïÒòÓóÚúÜüÇç']/;
var rgxVocal = /[AaEeIiOoUuÀàÈèÉéÍíÏïÒòÓóÚúÜü]/;
var rgxVocalForta = /[AaEeOoÀàÈèÉéÒòÓóÏïÍíÚúÜü]/;

function es_lletra(caracter) {return rgxLletra.test(caracter);}
function es_vocal(caracter) {return rgxVocal.test(caracter);}
function es_vocal_forta(caracter) {return rgxVocalForta.test(caracter);}
function es_simbol(caracter) {return !es_lletra(caracter);}
function es_consonant(caracter) {
    if (es_simbol(caracter)) return false;
    if (es_vocal(caracter)) return false;
    return true;
}
function es_vocal_feble(caracter) {
    return (es_vocal(caracter) && !es_vocal_forta(caracter));
}

function separa() {
    var text = document.getElementById("entrada").value;
    text = text.replace(/</g,"&lt;");
    text = text.replace(/>/g,"&gt;");
    text = text.replace(/l·l/gi,"l-l");
    text = text.replace(/rr/gi,"r-r");
    text = text.replace(/ss/gi,"s-s");
    text = text.replace(/\bex/gi,"ex-");
    text = text.replace(/\bsub/gi,"sub-");
    text = text.replace(/\btrans/gi,"trans-");
    text = text.replace(/\binter/gi,"inter-");
    text = text.replace(/nosaltres/gi,"nos-altres");
    text = text.replace(/besavi/gi,"bes-avi");
    text = text.replace(/besàvia/gi,"bes-àvia");
    text = text.replace(/vosaltres/gi,"vos-altres");
    text = text.replace(/benesta/gi,"ben-esta");
    text = text.replace(/\bdesinf/gi,"des-inf");
    text = text.replace(/\bdesocu/gi,"des-ocu");
    text = text.replace(/\bdesestim/gi,"des-estim");
    text = text.replace(/\bdesesper/gi,"des-esper");
    text = text.replace(/\bdesendr/gi,"des-endr");
    text = text.replace(/\bdesarm/gi,"des-arm");
    text = text.replace(/\binex/gi,"in-ex");
    text = text.replace(/\binef/gi,"in-ef");
    text = text.replace(/\bdesob/gi,"des-ob");
    text = text.replace(/\btrans-ici/gi,"transici");
    text = text.replace(/\btrans-i/gi,"transi");
    text = text.replace(/\bargü/gi,"argü-")
    var v = text.split("");
    text = "";
    var i, j, k, r, s;
    var mida = v.length;
    for (i = 0; i < mida; ++i) {
        if (es_simbol(v[i])) {
            text += v[i];
        } else {
            var mot;
            j = i;
            while(j < mida && es_lletra(v[j])) {
                ++j;
            }
            mot = v.slice(i,j);
            i = --j;
            var midaMot = mot.length;
            var principi = true;
            k = 0;
            while (k < midaMot) {
                var consonants = "";
                while (k < midaMot && es_consonant(mot[k])) {
                    consonants += mot[k];
                    ++k;
                }
                var midaConsonants = consonants.length;
                if (principi || k == midaMot) {text += consonants;}
                else {
                    if (midaConsonants === 0) {}
                    else if (midaConsonants === 1) {text += "-" + consonants;}
                    else if (consonants.slice(0,midaConsonants-1).search(/s/i) !== -1) {
                        var pos = consonants.slice(0,midaConsonants-1).search(/s/i);
                        text += consonants.slice(0,pos+1);
                        text += "-";
                        text += consonants.slice(pos+1,midaConsonants);
                    }
                    else if (/\b([^rlnmsx][rl]|ll|ny)/i.test(consonants)) {
                        if (!/\b(tl|dl)/i.test(consonants)) {
                            text += "-" + consonants;
                        } else {
                            text += consonants[0];
                            text += "-";
                            text += consonants.slice(1);
                        }
                    }
                    else {
                        text += consonants[0];
                        text += "-";
                        text += consonants.slice(1);
                    }
                }
                r = 0;
                s = k;
                if (k > 0) {principi = false;}
                var vocals = "";
                while (k < midaMot && es_vocal(mot[k])) {
                    vocals += mot[k];
                    ++k;
                }
                var midaVocals = vocals.length;
                if (midaVocals === 0) {}
                else if (midaVocals === 1) {text += vocals;}
                else {
                    if (s>0 && /[qg]/i.test(mot[s-1]) && /[uü]/i.test(mot[s])) {
                        text += vocals[0];
                        r = 1;
                    }
                    else if (principi) {
                        if (/[iu]/i.test(mot[s])) {
                            text += vocals[0];
                            r = 1;
                        }
                    }
                    while(r < midaVocals - 1) {
                        text += vocals[r];
                        if (es_vocal_forta(vocals[r]) && es_vocal_forta(vocals[r+1])) {
                            text += "-";
                        } else if (es_vocal_feble(vocals[r+1]) && r+2 < midaVocals && es_vocal_forta(vocals[r+2])) {
                            text += "-";
                        } else if (es_vocal_feble(vocals[r]) && es_vocal_forta(vocals[r+1]) && r === 0) {
                            text += "-";
                        }
                        else {
                            
                        }
                        ++r;
                    }
                    text += mot[k-1];
                }
                principi = false;
            }
        }
    }
    document.getElementById("sortida").innerHTML = text;
}

document.getElementById("separa").onclick = separa;
document.getElementById("entrada").onkeypress = function(e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13') { // si s'ha premut Enter
        separa();
        return false;
    }
};