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
const profileImgElem = document.querySelector('.profile-img');
const statusTooltipElem = document.querySelector('.status-tooltip');
// floating tooltip (separate top-level element that overrides everything)
let floatingTooltipElem = null;
let floatingDiscordStatusElem = null;
let floatingDiscordJoinedElem = null;

function computeJoinedFromSnowflake(id) {
    try {
        const timestamp = (BigInt(id) >> 22n) + 1420070400000n;
        return new Date(Number(timestamp)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
        return null;
    }
}

function updateStatusText(statusText, joinedText) {
    if (typeof statusText === 'string') {
        if (discordStatus) discordStatus.textContent = statusText;
        if (floatingDiscordStatusElem) floatingDiscordStatusElem.textContent = statusText;
    }
    if (typeof joinedText === 'string') {
        if (discordJoined) discordJoined.textContent = joinedText;
        if (floatingDiscordJoinedElem) floatingDiscordJoinedElem.textContent = joinedText;
    }
}

function createFloatingTooltip() {
    if (floatingTooltipElem) return;
    floatingTooltipElem = document.createElement('div');
    floatingTooltipElem.id = 'floating-status-tooltip';
    floatingTooltipElem.className = 'floating-status-tooltip';
    floatingTooltipElem.innerHTML = `
        <p>Status: <span id="floating-discord-status">Loading...</span></p>
        <p>Joined: <span id="floating-discord-joined">Loading...</span></p>
    `;
    document.body.appendChild(floatingTooltipElem);
    // cache inner elements for updates
    floatingDiscordStatusElem = floatingTooltipElem.querySelector('#floating-discord-status');
    floatingDiscordJoinedElem = floatingTooltipElem.querySelector('#floating-discord-joined');
}

// Move tooltip out of the card into document.body and position it to avoid clipping
function initTooltip() {
    if (!profileImgElem) return;

    // create a separate floating tooltip that lives at body root so it cannot be clipped
    try {
        createFloatingTooltip();
    } catch (e) {}

    // hide the original tooltip to avoid duplication
    if (statusTooltipElem) statusTooltipElem.style.display = 'none';

    // ensure floating tooltip starts hidden
    if (floatingTooltipElem) {
        floatingTooltipElem.style.position = 'fixed';
        floatingTooltipElem.style.zIndex = '2147483000';
        floatingTooltipElem.style.display = 'none';
    }

    function positionTooltip(event) {
        const rect = profileImgElem.getBoundingClientRect();
        const el = floatingTooltipElem || statusTooltipElem;
        if (!el) return;
        // ensure it's measurable
        el.style.display = 'block';
        el.style.visibility = 'hidden';
        const tw = el.offsetWidth;
        const th = el.offsetHeight;

        let left = rect.left + rect.width / 2 - tw / 2;
        let top = rect.top - th - 8; // above by default

        // keep within viewport
        if (left < 8) left = 8;
        if (left + tw > window.innerWidth - 8) left = window.innerWidth - tw - 8;
        // if not enough space above, place below
        if (top < 8) top = rect.bottom + 8;

        el.style.left = left + 'px';
        el.style.top = top + 'px';
        el.style.visibility = 'visible';
        el.style.display = 'block';
    }

    profileImgElem.addEventListener('mouseenter', positionTooltip);
    profileImgElem.addEventListener('mousemove', positionTooltip);
    profileImgElem.addEventListener('mouseleave', () => {
        if (floatingTooltipElem) floatingTooltipElem.style.display = 'none';
        if (statusTooltipElem) statusTooltipElem.style.display = 'none';
    });

    // On touch devices, toggle on click
    profileImgElem.addEventListener('click', (e) => {
        const el = floatingTooltipElem || statusTooltipElem;
        if (!el) return;
        if (el.style.display === 'block') {
            el.style.display = 'none';
        } else {
            positionTooltip();
        }
    });

    window.addEventListener('resize', () => {
        const el = floatingTooltipElem || statusTooltipElem;
        if (el && el.style.display === 'block') positionTooltip();
    });
}

initTooltip();

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
let lanyardWs = null;
let lanyardHeartbeat = null;
let lanyardReconnectAttempts = 0;

function connectLanyardWebsocket(userId) {
    try {
        lanyardWs = new WebSocket('wss://api.lanyard.rest/socket');

        lanyardWs.addEventListener('open', () => {
            // wait for HELLO message from server to get heartbeat interval
            console.info('Lanyard WS opened');
        });

        lanyardWs.addEventListener('message', (event) => {
            try {
                const payload = JSON.parse(event.data);

                // Hello (server tells us heartbeat interval)
                if (payload.op === 1 && payload.d && payload.d.heartbeat_interval) {
                    const heartbeatIntervalMs = payload.d.heartbeat_interval;
                    // clear any previous heartbeat
                    if (lanyardHeartbeat) clearInterval(lanyardHeartbeat);
                    // send heartbeat regularly
                    lanyardHeartbeat = setInterval(() => {
                        try { lanyardWs.send(JSON.stringify({ op: 3 })); } catch (e) {}
                    }, heartbeatIntervalMs);

                    // After HELLO, initialize subscription
                    lanyardWs.send(JSON.stringify({ op: 2, d: { subscribe_to_ids: [userId] } }));
                    return;
                }

                // Event payloads
                if (payload.op === 0 && (payload.t === 'INIT_STATE' || payload.t === 'PRESENCE_UPDATE')) {
                    // payload.d may be a mapping or a single presence object
                    const data = payload.d || {};
                    let presence = data[userId] || data;
                    if (presence && presence.discord_status) {
                        const status = presence.discord_status;
                        const formatted = status.charAt(0).toUpperCase() + status.slice(1);
                        updateStatusText(formatted, null);
                        statusIndicator.style.backgroundColor = statusColors[status] || '#ccc';
                        // joined date from snowflake if available
                        if (presence.discord_user && presence.discord_user.id) {
                            const joined = computeJoinedFromSnowflake(presence.discord_user.id);
                            if (joined) updateStatusText(null, joined);
                        }
                    }
                }
            } catch (e) {
                console.error('Error parsing Lanyard WS message', e);
            }
        });

        lanyardWs.addEventListener('close', (ev) => {
            console.warn('Lanyard WS closed', ev);
            if (lanyardHeartbeat) { clearInterval(lanyardHeartbeat); lanyardHeartbeat = null; }
            // reconnect with backoff
            lanyardReconnectAttempts++;
            const backoff = Math.min(30000, 1000 * Math.pow(2, Math.min(6, lanyardReconnectAttempts)));
            setTimeout(() => connectLanyardWebsocket(userId), backoff);
        });

        lanyardWs.addEventListener('error', (err) => {
            console.error('Lanyard WS error', err);
            try { lanyardWs.close(); } catch (e) {}
        });
    } catch (e) {
        console.error('Failed to connect Lanyard websocket', e);
    }
}

// initialize websocket subscription (use the same id as lanyardApiUrl)
// extract the id from the API url and start connection
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

// Recreate the original flex-based box layout: create enough .box elements
// to fill the viewport and rely on CSS (.box rules + media queries) to size them.
function createBoxes() {
    boxesContainer.innerHTML = ''; // Clear existing boxes if any

    // Determine approximate box size to compute how many are needed.
    // Keep this in sync with the CSS breakpoints: mobile uses 33px, small uses 70px, desktop 95px.
    const width = window.innerWidth;
    const height = window.innerHeight;

    let approxBoxSize;
    if (width <= 480) {
        approxBoxSize = 33;
    } else if (width <= 768) {
        approxBoxSize = 70;
    } else {
        approxBoxSize = 95;
    }

    const cols = Math.ceil(width / (approxBoxSize + gap));
    const rows = Math.ceil(height / (approxBoxSize + gap));
    const totalBoxes = cols * rows;

    // Ensure container uses flex (as in original CSS) and doesn't have inline grid styles
    boxesContainer.style.display = '';
    boxesContainer.style.gridTemplateColumns = '';
    boxesContainer.style.gridAutoRows = '';
    boxesContainer.style.gap = '';

    for (let i = 0; i < totalBoxes; i++) {
        const box = $.createElement('div');
        box.classList.add('box');
        boxesContainer.appendChild(box);
    }
}

window.addEventListener('resize', createBoxes);
window.addEventListener('load', e =>{
    loader.style.display = 'none'
    page.style.display = 'block'
    createBoxes();
})





