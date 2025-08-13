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

// Discord Status
const statusIndicator = document.getElementById('status-indicator');
const discordStatus = document.getElementById('discord-status');
const discordJoined = document.getElementById('discord-joined');

const lanyardApiUrl = 'https://api.lanyard.rest/v1/users/591534252307513347';

const statusColors = {
    online: '#3BA55D',
    idle: '#FAA81A',
    dnd: '#ED4245',
    offline: '#747F8D'
};


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

fetch(lanyardApiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const status = data.data.discord_status;
            const userId = data.data.discord_user.id;
            const timestamp = (BigInt(userId) >> 22n) + 1420070400000n;
            const joinedAt = new Date(Number(timestamp)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            
            discordStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            statusIndicator.style.backgroundColor = statusColors[status] || '#ccc';
            discordJoined.textContent = joinedAt;
        }
    })
    .catch(error => console.error('Error fetching Lanyard data:', error));

// --- Real-time updates using Lanyard WebSocket ---
function connectLanyardWebsocket(userId) {
    try {
        const ws = new WebSocket('wss://api.lanyard.rest/socket');

        ws.addEventListener('open', () => {
            // subscribe to the user's updates
            ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
        });

        ws.addEventListener('message', (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload.t === 'INIT_STATE' || payload.t === 'PRESENCE_UPDATE') {
                    const d = payload.d;
                    if (d && d.discord_status) {
                        const status = d.discord_status;
                        discordStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                        statusIndicator.style.backgroundColor = statusColors[status] || '#ccc';
                    }
                }
            } catch (e) {
                console.error('Error parsing Lanyard WS message', e);
            }
        });

        ws.addEventListener('close', (ev) => {
            // try to reconnect after short delay
            setTimeout(() => connectLanyardWebsocket(userId), 2500);
        });

        ws.addEventListener('error', (err) => {
            console.error('Lanyard WS error', err);
            ws.close();
        });
    } catch (e) {
        console.error('Failed to connect Lanyard websocket', e);
    }
}

// initialize websocket subscription (use the same id as lanyardApiUrl)
// extract the id from the API url
try {
    const match = lanyardApiUrl.match(/users\/(\d+)/);
    if (match) {
        const userid = match[1];
        connectLanyardWebsocket(userid);
    }
} catch (e) {
    console.error('Error initiating Lanyard WS', e);
}


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
const boxesContainer = $.querySelector('.boxes');
const gap = 1; // gap between boxes

function createBoxes() {
    boxesContainer.innerHTML = ''; // Clear existing boxes if any
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Responsive box sizing: mobile gets smaller boxes
    let calculatedBoxSize;
    if (width <= 480) {
        calculatedBoxSize = 33;
    } else if (width <= 768) {
        calculatedBoxSize = 70;
    } else {
        calculatedBoxSize = 95;
    }

    const cols = Math.ceil(width / (calculatedBoxSize + gap));
    const rows = Math.ceil(height / (calculatedBoxSize + gap));
    const totalBoxes = cols * rows;

    // Use CSS Grid for precise placement
    boxesContainer.style.display = 'grid';
    boxesContainer.style.gridTemplateColumns = `repeat(${cols}, ${calculatedBoxSize}px)`;
    boxesContainer.style.gridAutoRows = `${calculatedBoxSize}px`;
    boxesContainer.style.gap = `${gap}px`;

    for (let i = 0; i < totalBoxes; i++) {
        const box = $.createElement('div');
        box.classList.add('box');
        // enforce size inline so grid is consistent even if CSS differs
        box.style.width = `${calculatedBoxSize}px`;
        box.style.height = `${calculatedBoxSize}px`;
        boxesContainer.appendChild(box);
    }
}

window.addEventListener('resize', createBoxes);
window.addEventListener('load', e =>{
    loader.style.display = 'none'
    page.style.display = 'block'
    createBoxes();
})





