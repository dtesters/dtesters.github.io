let $ = document
function _query (q) {
    return $.querySelector(q)
}

let title = _query('.title')
let widgets = $.querySelectorAll('.profile-item')
window.addEventListener('scroll', e=> {
    if(window.scrollY < 300){
        title.style.cssText = `
        transform: translateY(-${window.scrollY / 4}px);
        opacity: ${(300 - window.scrollY)*0.004};
        `
    }
    widgets.forEach(item => {
        if(item.offsetTop - window.scrollY < 0){

            item.style.opacity = ((1450 - -(item.offsetTop - window.scrollY)) / 950)
        }
    })
})


async function ipLoger (){
    let ip = null
    await fetch ('https://api.ipify.org?format=json')
    .then(e => e.json())
    .then(data => ip = data.ip)
    .catch(err => console.log(err))
    await fetch (`https://ipapi.co/${ip}/json/`)
    .then(e => e.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
}
ipLoger()
