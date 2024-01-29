let $ = document


// Box Hover
let boxes = $.querySelectorAll('.box')
boxes.forEach(box=>{
    box.addEventListener('mouseenter', e=>{
        box.style.backgroundColor = '#3742ff'
        box.style.transition = '500ms'
        setTimeout(time => {
            box.style.backgroundColor = '#131414'
            box.style.transition = '1000ms'
        }, 600);
    })
})

const apiUrl = 'https://discordstatus.com/api/v2/status.json';

// Make a GET request
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });