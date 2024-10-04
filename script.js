document.addEventListener('DOMContentLoaded', function() {
document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    document.getElementById('tableBody1').innerHTML = '';
    document.getElementById('tableBody2').innerHTML = '';
    document.getElementById('results1').style.display = 'none';
    document.getElementById('results2').style.display = 'none';

    let method = document.getElementById('method').value;
    let x0 = parseFloat(document.getElementById('x0').value);
    let y0 = parseFloat(document.getElementById('y0').value);
    let xn = parseFloat(document.getElementById('xn').value);
    let h = parseFloat(document.getElementById('step').value);
    let inputfn = document.getElementById('equation').value; 

    if (method == 'euler') 
    {
        document.getElementById('tableTitle1').style.display = 'block';
        document.getElementById('results1').style.display = 'block';
    } 
    else if (method === 'heun') 
    {
        document.getElementById('tableTitle2').style.display = 'block';
        document.getElementById('results2').style.display = 'block';
    }

    let f = new Function('x', 'y', 'return ' + inputfn);
    let x_val = [], y_val = [], itr_val = [];
    let x = x0, y = y0;

    x_val.push(x);
    y_val.push(y);

    if (method === 'euler') 
    {
        let n = Math.floor((xn - x0) / h);
        for (let i = 0; i < n; i++) 
        {
            y += h * f(x, y);
            x += h;
            x_val.push(x);
            y_val.push(y);
        }

        let tableBody1 = document.getElementById('tableBody1');
        for (let i = 0; i < x_val.length; i++) 
        {
            let row = document.createElement('tr');
            row.innerHTML = `<td>${i}</td><td>${x_val[i].toFixed(5)}</td><td>${y_val[i].toFixed(5)}</td>`;
            tableBody1.appendChild(row);
        }

        plotGraph1(x_val, y_val);
    } 
    else if (method === 'heun') 
    {
        let n = Math.floor((xn - x0) / h);
        for (let i = 0; i < n; i++) 
        {
            let initial = f(x, y);
            let y_pred = y + h * initial;
            let x_next = x + h;
            let y_corr = y_pred;
            let itr = 0;
            let diff;

            do 
            {
                let next = f(x_next, y_corr);
                let y_new = y + (h / 2) * (initial + next);
                diff = Math.abs(y_new - y_corr);
                y_corr = y_new;
                itr++;
            } 
            while (diff > 10 ** -6);

            itr_val.push(itr);
            x = x_next;
            y = y_corr;
            x_val.push(x);
            y_val.push(y);
        }

        let tableBody2 = document.getElementById('tableBody2');
        for (let i = 0; i < x_val.length; i++) 
        {
            let row = document.createElement('tr');
            row.innerHTML = `<td>${i}</td><td>${x_val[i].toFixed(5)}</td><td>${y_val[i].toFixed(5)}</td><td>${itr_val[i] || 0}</td>`;
            tableBody2.appendChild(row);
        }

        plotGraph2(x_val, y_val);
    }

    let value = y_val[y_val.length - 1].toFixed(5);
    let message = `∴ y(${xn}) ≈ ${value}`;

    let concludeDiv = document.createElement('div');
    concludeDiv.innerHTML = message;

    let concludeContainer = document.getElementById('conclusion');
    concludeContainer.innerHTML = '';
    concludeContainer.appendChild(concludeDiv);

    function plotGraph1(xval, yval) 
    {
        var trace1 = {
                x: xval,
                y: yval,
                mode: 'lines',
                name: 'Euler\'s approximation',
            };

        var data = [trace1];
        var layout = {
                title: 'Graph for Euler\'s formula',
                xaxis: {
                    title: 'x',
                },
                yaxis: {
                    title: 'y',
                }
            };

        Plotly.newPlot('graph', data, layout);
    }

    function plotGraph2(xval, yval) {
        var trace1 = {
                x: xval,
                y: yval,
                mode: 'lines',
                name: 'Heun\'s approximation',
            };

        var data = [trace1];
        var layout = {
                title: 'Graph for Heun\'s formula',
                xaxis: {
                    title: 'x',
                },
                yaxis: {
                    title: 'y',
                }
            };

        Plotly.newPlot('graph', data, layout);
    }
    });
});
