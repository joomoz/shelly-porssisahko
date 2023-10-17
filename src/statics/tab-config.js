/**
 * shelly-porssisahko
 * 
 * (c) Jussi isotalo - http://jisotalo.fi
 * https://github.com/jisotalo/shelly-porssisahko
 * 
 * License: GNU Affero General Public License v3.0 
 */
{
  let configRead = false;

  const onUpdate = async () => {
    try {
      if (state === undefined || configRead || !state) {
        return;
      }
      let c = state.c;

      qs("#mode").innerHTML = MODE_STR.map((m, i) => `<option value="${i}">${m}</option>`)

      qs("#mode").value = c.mode;
      qs("#out").value = c.out;
      qs("#inv").checked = c.inv ? "checked" : "";
      qs("#vat").value = c.vat;
      qs("#day").value = c.day;
      qs("#night").value = c.night;

      let hours = "";
      for (let i = 0; i < 24; i++) {
        hours += `<input type="checkbox" id="X${i}">${("" + i).padStart(2, "0")} `
      }
      qs("#bk").innerHTML = hours.replaceAll("X", "b");
      qs("#fh").innerHTML = hours.replaceAll("X", "f");

      for (let i = 0; i < 24; i++) {
        qs(`#b${i}`).checked = (c.bk & (1 << i)) == (1 << i);
        qs(`#f${i}`).checked = (c.fh & (1 << i)) == (1 << i);
      }

      qs("#err").checked = c.err ? "checked" : "";
      qs("#m0-cmd").checked = c.m0.cmd ? "checked" : "";
      qs("#m1-lim").value = c.m1.lim;
      qs("#m2-per").value = c.m2.per;
      qs("#m2-cnt").value = c.m2.cnt;
      qs("#m2-lim").value = c.m2.lim;

      configRead = true;
    } catch (err) {
      console.error(me(), `Error:`, err);

    }
  };

  const save = async (e) => {
    e.preventDefault();

    try {
      let c = state.c
      let n = (v) => Number(v);

      c.mode = n(qs("#mode").value);
      c.out = n(qs("#out").value);
      c.inv = qs("#inv").checked ? 1 : 0;
      c.vat = n(qs("#vat").value);
      c.day = n(qs("#day").value);
      c.night = n(qs("#night").value);

      c.bk = 0;
      c.fh = 0;
      for (let i = 0; i < 24; i++) {
        if (qs(`#b${i}`).checked) {
          c.bk = c.bk | (1 << i);
        }
        if (qs(`#f${i}`).checked) {
          c.fh = c.fh | (1 << i);
        }
      }

      c.err = qs("#err").checked ? 1 : 0;
      c.m0.cmd = qs("#m0-cmd").checked ? 1 : 0;
      c.m1.lim = n(qs("#m1-lim").value);
      c.m2.per = n(qs("#m2-per").value);
      c.m2.cnt = n(qs("#m2-cnt").value);
      c.m2.lim = n(qs("#m2-lim").value);

      if (c.m2.cnt > c.m2.per) {
        throw new Error("Tuntimäärä > ajanjakso");
      }

      DBG(me(), "Settings to save:", c);

      const res = await getData(`${URL}/rpc/KVS.Set?key="porssi-config"&value=${(JSON.stringify(c))}`);

      if (res.ok) {
        getData(`${URL_SCRIPT}?r=r`)
          .then(res => {
            alert(`Asetukset tallennettu!`);
            configRead = false;
          })
          .catch(err => {
            alert(`Virhe: ${err})`);
          });

      } else {
        alert(`Virhe: ${res.txt})`);
      }
    } catch (err) {
      alert("Virhe: " + err.message);
    }
  };

  const force = async () => {
    let data = prompt("Tuntimäärä:");
    if (data !== null) {
      data = Number(data);
      data = data > 0 ? Math.floor(Date.now() / 1000 + data * 60 * 60) : 0;

      let res = await getData(`${URL_SCRIPT}?r=f&ts=${data}`);
      console.log(res);

      alert(res.ok ? "OK!" : `Virhe: ${res.txt}`);
    }
  }

  onUpdate();
  CBS.push(onUpdate);
  qs("#save").addEventListener("click", save);
  qs("#force").addEventListener("click", force);
}
