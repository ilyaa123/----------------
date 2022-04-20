'use strict'
// Плавный скролл
const anchors = document.querySelector('.intro__a'),
      animationTime = 300,
      framesCount = 20,
      time = animationTime / framesCount;

anchors.addEventListener('click', function(e) {
    e.preventDefault();
    let coordY = document.querySelector(anchors.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset;
    let scroller = setInterval(() => {

    let scrollBy = coordY / framesCount;

    if(scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
        window.scrollBy(0, scrollBy);
    } else {
        window.scrollTo(0, coordY);
        clearInterval(scroller);
    }

    }, time);
        
})


let options = {threshold: [0.2]};
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll('.animate');
console.log(elements)
elements.forEach((i) => {
    observer.observe(i); 
});

function onEntry (entry){
    entry.forEach(change => {
       if (change.isIntersecting){
           change.target.classList.add('show');
       } 
    });
}