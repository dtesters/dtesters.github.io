let $ = document
function _ID(id) {
    return $.getElementById(id)
}
function _Query(query){
    return $.querySelector(query)
}

// --- Elements ----------------
// User
let nameElem = _ID('name')
let tagElem = _ID('tag')
let avatarElem = _ID('avatar')


// Server
let serverNameElem = _ID('server-name')
let serverIconElem = _ID('server-img')
let serverMembersElem = _ID('server-members')
let serverOnlineMembersElem = _ID('server-online-members')

// --- API ---------------------
let dataObjectUser
let dataObjectServer
const apiUrlUser = 'https://discordlookup.mesavirep.xyz/v1/user/591534252307513347'
const apiUrlServer = 'https://canary.discord.com/api/v10/invites/kHQjhXnxkM?with_counts=true'
fetch (apiUrlUser)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        dataObjectUser = data
        nameElem.innerText = dataObjectUser.global_name
      
        tagElem.innerText = '@' + dataObjectUser.username 
        avatarElem.setAttribute('src', '' + dataObjectUser.avatar.link + '')
		// let tagConvert = (dataObjectUser.tag)
       // tagElem.innerText = '#' + tagConvert.slice(0, tagConvert.length - 2)
    })
    .catch(error => {
        console.error('Error:', error);
});
fetch (apiUrlServer)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        dataObjectServer = data
        serverNameElem.innerText = dataObjectServer.guild.name
        serverIconElem.setAttribute('src', 'https://cdn.discordapp.com/icons/' + dataObjectServer.guild.id + '/' + dataObjectServer.guild.icon)
        serverMembersElem.innerText = dataObjectServer.approximate_member_count + ' Members'
        serverOnlineMembersElem.innerText = dataObjectServer.approximate_presence_count + ' Online'
    })
    .catch(error => {
        console.error('Error:', error);
});



// Pages Menu
let pageMenu = $.querySelectorAll('.page')
let btnMenu = $.querySelectorAll('.btn-menu')
btnMenu.forEach(btn=> {
    btn.addEventListener('click', e=>{
        if(btn.style.color !== '#ffffff'){
            btnMenu.forEach(e => {
                e.style.color = '#acacac'
            })
            btn.style.color = '#ffffff'
        }
        pageMenu.forEach(page=>{
            if(btn.id === page.getAttribute('page')){
                page.style.display = 'flex'
            } else {
                page.style.display = 'none'
            }
        })
    })
})

// Loader
let loader = $.querySelector('.page_loader')
let page = $.querySelector('.container')
window.addEventListener('load', e =>{
    loader.style.display = 'none'
    page.style.display = 'block'
})

// Text Animate
let texts = $.querySelector('.hello-animate')
let animate = false
setInterval(e=>{
    if(!animate){
        texts.classList.add('enableText')
        texts.classList.remove('disableText')
        animate = true
    } else {
        texts.classList.add('disableText')
        texts.classList.remove('enableText')
        animate = false
    }
}, 3000)

