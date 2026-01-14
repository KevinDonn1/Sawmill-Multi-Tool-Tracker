document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            document.getElementById(btn.dataset.tab).style.display = 'block';
        });
    });

    // CTP Tool
    const totalHolesSelect = document.getElementById('total-holes');
    const customHoles = document.getElementById('custom-holes');
    totalHolesSelect.addEventListener('change', () => {
        customHoles.style.display = totalHolesSelect.value === 'custom' ? 'block' : 'none';
    });

    document.getElementById('generate-ctp').addEventListener('click', () => {
        let totalHoles = parseInt(totalHolesSelect.value);
        if (totalHolesSelect.value === 'custom') totalHoles = parseInt(customHoles.value) || 18;

        const starts = document.getElementById('group-starts').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const ctps = document.getElementById('ctp-holes').value.split(',').map(h => parseInt(h.trim())).filter(n => !isNaN(n));

        if (starts.length === 0 || ctps.length === 0) return alert('Enter starting and CTP holes.');

        const { bringOut, pickUp } = calculateFlags(starts, ctps, totalHoles);

        let html = '';
        for (let g = 1; g <= starts.length; g++) {
            html += `<h4>Group ${g} (starts ${starts[g-1]})</h4>
                     <p>Take out: ${(bringOut[g] || []).sort((a,b)=>a-b).join(', ') || 'None'}</p>
                     <p>Pick up: ${(pickUp[g] || []).sort((a,b)=>a-b).join(', ') || 'None'}</p><hr>`;
        }
        document.getElementById('ctp-flags').innerHTML = html;
        document.getElementById('ctp-output').style.display = 'block';
    });

    function calculateFlags(starts, ctps, total) {
        const bo = {}, pu = {};
        for (let i = 1; i <= starts.length; i++) { bo[i] = []; pu[i] = []; }
        ctps.forEach(h => {
            let min = Infinity, max = -Infinity, first = -1, last = -1;
            starts.forEach((s, i) => {
                let d = (h - s + total) % total;
                if (d < min) { min = d; first = i+1; }
                if (d > max) { max = d; last = i+1; }
            });
            bo[first].push(h);
            pu[last].push(h);
        });
        return { bringOut: bo, pickUp: pu };
    }

    // Bag Tag Tool (simplified – add later if needed)
    document.getElementById('add-player').addEventListener('click', () => {
        alert('Bag tag tracking coming soon – for now use paper or the old version.');
    });

    // Handicap Calculator
    document.getElementById('calc-handicap').addEventListener('click', () => {
        const name = document.getElementById('hc-name').value.trim() || 'Player';
        const avg = parseFloat(document.getElementById('hc-avg').value);
        const par = parseFloat(document.getElementById('hc-par').value);

        if (isNaN(avg) || isNaN(par)) return alert('Enter valid average and par.');

        const diff = avg - par;
        const adjustment = diff * 0.4; // your custom multiplier
        const handicap = Math.round(adjustment * 10) / 10; // 1 decimal

        document.getElementById('hc-player').textContent = name;
        document.getElementById('hc-raw').textContent = avg.toFixed(1);
        document.getElementById('hc-adjust').textContent = adjustment.toFixed(1);
        document.getElementById('hc-value').textContent = handicap;
        document.getElementById('hc-result').style.display = 'block';
    });
});
