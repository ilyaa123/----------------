'use strict';
const main = document.querySelector('.main');
const selection = document.querySelector('.selection');
const title = document.querySelector('.main__title');

const getData = () => {
    const data = [{
        "id": "89345",
        "theme": "Осевая симметрия",
        "result": [
          [10, "плохой результат"],
          [60, "средний результат"],
          [90, "отличный результат"]
        ],
        "list": [
          {
            "type": "radio",
            "question": "Осевая симметрия - это симметрия относительно",
            "answers": ["некоторой прямой (оси)", "некоторой точки", "некоторой фигуры",]
          },
          {
            "type": "radio",
            "question": "Сколько осей симметрии имеет равнобедренный треугольник?",
            "answers": ["Одну", "Две", "Три",]
          },
          {
            "type": "radio",
            "question": "Сколько осей симметрии имеет равносторонний треугольник?",
            "answers": ["Не имеет осей симметрии", "Одну", "Две", "Три"],
            "correct": 1
          },
          {
            "type": "radio",
            "question": "Какие из букв имеют ось симметрии?",
            "answers": ["Е", "Б", "Г",]
          },
          {
            "type": "radio",
            "question": "Сколько осей симметрии имеет квадрат?",
            "answers": ["4", "1", "2", "3"]
          },
          {
            "type": "radio",
            "question": "Точки M и N называют симметричными относительно прямой l, если...",
            "answers": ["прямая l перпендикулярна отрезку MN и делит его пополам", "прямая l перпендикулярна отрезку MN", "прямая l делит отрезок MN пополам.",]
          },
        ]
      }];
    return data
};

const showElem = elem => {
    let opacity = 0;
    elem.opacity = opacity;
    elem.style.display = '';

    const animation = () => {
        opacity += 0.05;
        elem.style.opacity = opacity;

        if (opacity < 1){
            requestAnimationFrame(animation);        
        }
    };

    requestAnimationFrame(animation);
};

const hideElem = (elem, cb) => {
    let opacity = getComputedStyle(elem).getPropertyValue('opacity');

    const animation = () => {
        opacity -= 0.05;
        elem.style.opacity = opacity;

        if (opacity > 0){
            requestAnimationFrame(animation);
        } else {
            elem.style.display = 'none';
            if (cb) cb();
        }
    };
    requestAnimationFrame(animation)
};

const renderTheme = (themes) => {

    const list = document.querySelector('.selection__list');
    list.textContent = '';

    const buttons = [];

    for(let i = 0; i < themes.length; i += 1){
        const li = document.createElement('li');
        li.className = 'selection__item';

        const button = document.createElement('button');
        button.className = 'selection__theme';
        button.dataset.id = themes[i].id;
        button.textContent = themes[i].theme;

        li.append(button);

        const result = loadResult(themes[i].id);
        if (result){
            const p = document.createElement('p');
            p.className = 'selection__result';
            p.innerHTML = `
               <span class="selection__result-ratio">${result}/${themes[i].list.length}</span>
               <span class="selection__result-text">Последний результат</span>
            `;
            li.append(p);
        }

        
        list.append(li);

        buttons.push(button);
    }
    return buttons;
};

const shuffle = array => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i -= 1){
        let j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray;
}

const saveResult = (result, id) => {
    localStorage.setItem(id, result);
};
const loadResult = (id) => {
    return localStorage.getItem(id);
};

const createKeyAnswers = (data) => {
    const keys = [];

    for (let i = 0; i < data.answers.length; i++){
        if (data.type === 'radio'){
            keys.push([data.answers[i], !i]);
        } else {
            keys.push([data.answers[i], i < data.correct]);
        }
    }

    return shuffle(keys);
};

const createAnswer = (data) => {
    const type = data.type;
    const answers = createKeyAnswers(data);

    const labels = answers.map((item, i) => {
        const label = document.createElement('label');
        label.className = 'answer';

        const input = document.createElement('input');
        input.type = type;
        input.name = 'answer';
        input.className = `answer__${type}`;
        input.value = i;

        const text = document.createTextNode(item[0]);

        label.append(input, text);
        return label;
    });
    
    const keys = answers.map( answer => answer[1]);
    return {
        labels,
        keys
    }
};

const showResult = (result, quiz) => {
    const block = document.createElement('div');
    block.className = 'main__box main_box_result result';

    const percent = result/quiz.list.length * 100;
    let ratio = 0;
    for (let i = 0; i < quiz.result.length; i++){
        if(percent >= quiz.result[i][0]){
            ratio = i;
        }
    };

    block.innerHTML = `
        <h2 class="main__subtitle main__subtitle_result">Ваш результат</h2>
        <div class="result__box">
            <p class="result__ratio result__ratio_${ratio + 1}">${result}/${quiz.list.length}</p>
            <p class="result__text ">${quiz.result[ratio][1]}</p>
        </div>
    `;
    const button = document.createElement('button');
    button.className = 'main__btn result__return';
    button.textContent = 'К списку квизов';

    block.append(button);
    main.append(block);
    showElem(block);

    button.addEventListener('click', () => {
        hideElem(block, initQuiz);
    });
};

const renderQuiz = quiz => {

    const questionBox = document.createElement('div');
    questionBox.className = 'main__box main__box_question';

    hideElem(title);
    hideElem(selection, () => {
        showElem(questionBox);
        main.append(questionBox);
    });

    let result = 0;
    let questionCount = 0;
    const showQuestion = () => {
        const data = quiz.list[questionCount];
        questionCount += 1;

        questionBox.textContent = '';

        const form = document.createElement('form');
        form.className = 'main__form-question';
        form.dataset.count = `${questionCount}/${quiz.list.length}`;

        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.className = 'main__subtitle';
        legend.textContent = data.question;

        const answersData = createAnswer(data);

        const button = document.createElement('button');
        button.className = 'main__btn question__next';
        button.type = 'submit';
        button.textContent = 'Подтвердить';

        fieldset.append(legend, ...answersData.labels);
        form.append(fieldset, button);
        questionBox.append(form);
        showElem(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            let ok = false;
            const answers = [...form.answer].map( input => {
                if (input.checked) ok = true;
                return input.checked ? input.value : false;
            });
            if (ok) {       
                if (answers.every((result, i) => !!result === answersData.keys[i])) {
                    result += 1;
                }
                if (questionCount < quiz.list.length){
                    showQuestion();
                } else {
                    saveResult(result, quiz.id);
                    hideElem(questionBox, () => {
                        showResult(result, quiz);
                    });
                    
                }
            } else {
                form.classList.add('main__form-question_error');
                setTimeout(() => {
                    form.classList.remove('main__form-question_error');
                }, 1000);
            }
        });
    };
    showQuestion();
};

const addClick = (buttons, data) => {
    buttons.forEach( btn => {
        btn.addEventListener('click', () => {
            const quiz = data.find(item => item.id === btn.dataset.id);
            renderQuiz(quiz);
        });
    });
};

const initQuiz = async () => {
    showElem(title);
    showElem(selection);

    const data = await getData();

    const obj = localStorage.getItem('obj');
    const object = JSON.parse(obj);
    
    if (obj) {
        for (let i = 0; i < object.length; i++) {
            data.push(object[i]);
        }
    }
    console.log(data);
    const buttons = renderTheme(data);

    addClick(buttons, data);
}

initQuiz();