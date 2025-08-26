// Utilidades
const $ = (q, c = document) => c.querySelector(q);
const $$ = (q, c = document) => [...c.querySelectorAll(q)];

function normalizeInput(str){
  if(!str) return '';
  str = String(str).trim().toUpperCase();
  if(str.startsWith('$')) str = str.slice(1);
  if(str.startsWith('0X')) str = str.slice(2);
  str = str.replace(/[_\s]/g, '');
  return str;
}

function isValidDelphiHex(h){
  return /^[0-9A-F]{8}$/.test(h);
}

function delphiToRgb(hex8){
  const rr = parseInt(hex8.slice(6,8), 16);
  const gg = parseInt(hex8.slice(4,6), 16);
  const bb = parseInt(hex8.slice(2,4), 16);
  return { r: rr, g: gg, b: bb };
}

function toHex({r,g,b}){
  const h = (n)=> n.toString(16).padStart(2,'0').toUpperCase();
  return `#${h(r)}${h(g)}${h(b)}`;
}

function updatePreview(color){
  $('#swatch').style.background = color || 'transparent';
  const sw = $('.preview');
  if(color){ sw.style.borderColor = '#334155'; }
  else { sw.style.borderColor = '#7f1d1d'; }
}

function setStatus(msg, ok=true){
  const el = $('#status');
  el.textContent = msg || '';
  el.className = `status ${ok ? 'ok' : 'err'}`;
}

function copyFrom(selector){
  const el = $(selector);
  if(!el || !el.value) return;
  el.select();
  document.execCommand('copy');
  const btn = document.activeElement;
  if(btn && btn.classList.contains('copy')){
    const orig = btn.textContent;
    btn.textContent = 'Copiado!';
    setTimeout(()=> btn.textContent = orig, 900);
  }
}

function renderOutputs(rgb){
  if(!rgb){
    ['#hex','#rgb','#bgr'].forEach(id=> $(id).value = '');
    updatePreview('');
    return;
  }
  const hex = toHex(rgb);
  $('#hex').value = hex;
  $('#rgb').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  $('#bgr').value = `B=${rgb.b}  G=${rgb.g}  R=${rgb.r}`;
  updatePreview(hex);
}

function convert(){
  const raw = $('#delphi').value;
  const norm = normalizeInput(raw);
  if(!isValidDelphiHex(norm)){
    renderOutputs(null);
    setStatus('Valor inválido. Use 8 dígitos hexadecimais como $00FFE7B3.', false);
    $('#delphi').style.borderColor = '#ef4444';
    return;
  }
  $('#delphi').style.borderColor = '#334155';
  const rgb = delphiToRgb(norm);
  renderOutputs(rgb);
  setStatus('Conversão realizada com sucesso.');
}

// Eventos
$('#btnConvert').addEventListener('click', convert);
$('#delphi').addEventListener('input', () => {
  const v = normalizeInput($('#delphi').value);
  if(v.length === 8 && isValidDelphiHex(v)){
    const rgb = delphiToRgb(v);
    renderOutputs(rgb);
    setStatus('OK');
  } else {
    renderOutputs(null);
    setStatus('', true);
  }
});

$$('.copy').forEach(btn=> btn.addEventListener('click', e => copyFrom(btn.dataset.copy)));
$$('#hex, #rgb, #bgr').forEach(out=> out.addEventListener('dblclick', e => copyFrom(`#${out.id}`)));

// Exemplo inicial
$('#delphi').value = '$00FFE7B3';
convert();
