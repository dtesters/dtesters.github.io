let $ = document
function _query (q) {
    return $.querySelector(q)
}

let title = _query('.title')
let serverMap = _query('.server-map')
let serverMapChildren = serverMap.children
let titleContents = $.querySelectorAll('.title-contents')
let sideMap = $.querySelectorAll('.side-map')
window.addEventListener('scroll', e=> {

    //! Title
    if(window.scrollY < 500){
        title.style.cssText = `
        transform: translateY(-${window.scrollY / 1.5}px);
        opacity: ${(300 - window.scrollY)*0.004};
        `
    }

    //! Side Map
    sideMap.forEach(side => {
        let rect = side.getBoundingClientRect()
        let finalRectTop = (window.innerHeight - rect.top)
        if(finalRectTop > 600 && finalRectTop < side.clientHeight+800){
            let asideName = side.getAttribute('name')
            for(let child of serverMapChildren){
                if(child.lastElementChild.getAttribute('name') === asideName){
                    let anchor = child.lastElementChild
                    for (let map of serverMapChildren){
                        map.firstElementChild.innerText = '+'
                        map.lastElementChild.style.color = '#ced6e0'
                    }
                    anchor.style.color = '#e7d881'
                    anchor.previousElementSibling.innerText = '-'
                }
            }
        }
    })
})
// async function ipLoger (){
//     let ip = null
//     await fetch ('https://api.ipify.org?format=json')
//     .then(e => e.json())
//     .then(data => ip = data.ip)
//     .catch(err => console.log(err))
//     await fetch (`https://ipapi.co/${ip}/json/`)
//     .then(e => e.json())
//     .then(data => console.log(data))
//     .catch(err => console.log(err))
// }
// ipLoger()
