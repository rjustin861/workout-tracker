const btn_search = document.querySelector('#btn-search');
const btn_generate = document.querySelector('#btn-generate');
const search_text_box = document.querySelector('#search-text-box');
const container_data = document.querySelector('#container-data');
const main = document.querySelector('#main');
const loader = document.querySelector('.loader');

const render = (exercises) => {
    // console.log('exercises', exercises);
    let thead_el = document.createElement('thead');
    let tbody_el = document.createElement('tbody');
    let tr_el = document.createElement('tr');
    let th_el = `<th>Name</th><th>Description</th>`
    tr_el.innerHTML = th_el;
    thead_el.appendChild(tr_el);


    exercises.forEach((exercise) => {
        tr_el = document.createElement('tr');
        // console.log(exercise);
        

        for(value in exercise) {
            if(value == 'description' || value == 'name') {
                let td_el = document.createElement('td');
                let text = document.createTextNode(exercise[value]);
                td_el.appendChild(text);
                if(value == 'name') {
                    td_el.className = 'nameEl'
                    tr_el.prepend(td_el);
                }
                else
                    tr_el.appendChild(td_el);
            }
        }

        tbody_el.appendChild(tr_el);
    });

    container_data.appendChild(thead_el);
    container_data.appendChild(tbody_el);
}

const getExercises = (name) => {
    name = name.toLowerCase();
    const param = name.charAt(0).toUpperCase() + name.slice(1);

    return fetch(`http://wger.de/api/v2/exercisecategory/?name=${param}`)
        .then((data) => {          
            return data.json();     
        })
        .then((response) => {
            return (response.results[0].id);
        })
        .then((data2) => {
            return fetch (`http://wger.de/api/v2/exercise/?category=${data2}&language=2`);
        })
        .then((response2) => {    
            return response2.json();      
        })
        .then((data3) => {
            btn_search.disabled = false;
            btn_generate.disabled = false;
            loader.classList.add('hidden');
            render(data3.results);
        });
}

btn_search.onclick = function(e) {
    btn_search.disabled = true;
    btn_generate.disabled = true;
    loader.classList.remove('hidden');
    main.classList.remove('main-background');
    container_data.innerHTML = '';
    getExercises(search_text_box.value);
}

document.addEventListener('keypress', function(e) {
    if(e.which === 13)
        btn_search.click();
});