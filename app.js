const searchEl = document.querySelector('#search')
const displayEl = document.querySelector('#display')
const searchBtn = document.querySelector('#btn')
const prevBtn = document.querySelector('#prev')
const nextBtn = document.querySelector('#next')

let query
let qType
let results 
let searchURL
let prevPageURL
let nextPageURL

const baseURL = 'https://api.kkbox.com/v1.1/search?'
const widgetURL = 'https://widget.kkbox.com/v1/?'
let res_limit = 20


const getKKbox = async (URL) => {
  try {    
    qType = document.querySelector('[name="q-type"]:checked')
    const config = { headers: { 'Authorization': 'Bearer nWR8zYN_rhnsKCGVyuthLg==' } }
    const res = await axios.get(URL, config)
    const result = res.data[`${qType.id}s`]
    return result
  } catch (e) {
    console.log(e)
  }

}

const getTracks = (tracks) => {
  tracks.data.forEach( el => {

    const boxEl = document.createElement('div')
    boxEl.classList.add('box', 'col-md-6', 'col-lg-4')

    const trackId = el.id
    const trackName = el.name
    const trackURL = el.url
    const artist = el.album.artist.name
    const artistURL = el.album.artist.url

    const iframeEl = document.createElement('iframe')
    iframeEl.setAttribute('src', `${widgetURL}id=${trackId}&type=song&terr=TW&lang=TC`)
    iframeEl.setAttribute('height', '100px')

    boxEl.appendChild(iframeEl)
    

    const show = document.createElement('div')
    show.innerHTML = `
    <p class="h4">${trackName}</p>
    <h6 class="h6"><a target="_blank" class="artist" href=${artistURL}>${artist}</a></h6>
    <button class="btn btn-outline-light"><a target="_blank" href=${trackURL}><i class="fas fa-headphones"></i> 聽歌去</a></button>
    `
    boxEl.appendChild(show)

    displayEl.appendChild(boxEl)

  })
}

const getAlbums = (albums) => {

  albums.data.forEach( el => {

    const boxEl = document.createElement('div')
    boxEl.classList.add('box', 'col-md-6', 'col-lg-4')

    const albumId = el.id
    const albumName = el.name
    const albumURL = el.url
    const artist = el.artist.name
    const artistURL = el.artist.url

    const iframeEl = document.createElement('iframe')
    iframeEl.setAttribute('src', `${widgetURL}id=${albumId}&type=album&terr=TW&lang=TC`)
    iframeEl.setAttribute('height', '420px')
    iframeEl.setAttribute('width', '280px')

    boxEl.appendChild(iframeEl)

    const show = document.createElement('div')
    show.innerHTML = `
    <p class="h4">${albumName}</p>
    <h6 class="h6"><a target="_blank" class="artist" href=${artistURL}>${artist}</a></h6>
    <button class="btn btn-outline-light"><a target="_blank" href=${albumURL}>專輯介紹</a></button>
    `
  
    boxEl.appendChild(show)

    displayEl.appendChild(boxEl)
  })


  
}

const getArtists = (artists) => {
 
  artists.data.forEach( el => {
    const boxEl = document.createElement('div')
    boxEl.classList.add('box', 'col-sm-6', 'col-md-4' , 'col-lg-3')

    const artist = el.name
    const artistURL = el.url
    const imgURL = el.images[1].url
    const show = document.createElement('div')
    show.innerHTML = `
    <img class="img-fluid" src=${imgURL}>
    <p class="h4">${artist}</p>
    <button class="btn btn-outline-light"><a target="_blank" href=${artistURL}>Artist介紹</a></button>
    `
    boxEl.appendChild(show)

    displayEl.appendChild(boxEl)
  })


}

const getPlaylists = (playlists) => {

  playlists.data.forEach( el => {

    const boxEl = document.createElement('div')
    boxEl.classList.add('box', 'col-md-6', 'col-lg-4')

    const plaslistId = el.id
    const title = el.title
    const description = el.description.length > 50 ? el.description.slice(0,50)+'...' : el.description
    const plaslistURL = el.url
    const owner = el.owner.name
    const ownerUrl = el.owner.url

    const iframeEl = document.createElement('iframe')
    iframeEl.setAttribute('src', `${widgetURL}id=${plaslistId}&type=playlist&terr=TW&lang=TC`)
    iframeEl.setAttribute('height', '420px')
    iframeEl.setAttribute('width', '280px')

    boxEl.appendChild(iframeEl)

    const show = document.createElement('div')
    show.innerHTML = `
    <p class="h5">${title}</p>
    <a target="_blank" href=${ownerUrl}>${owner}</a>
    <p>${description}</p>
    <button class="btn btn-outline-light"><a target="_blank" href=${plaslistURL}><i class="fas fa-headphones"></i> 聽歌去</a></button>
    `

    boxEl.appendChild(show)

    displayEl.appendChild(boxEl)
  })
  
}


const addResults = (results) => {

  if (qType.id === "track") {
    getTracks(results)
  } else if(qType.id === "album") {
    getAlbums(results);
  } else if (qType.id === "artist") {
    getArtists(results)
  } else {
    getPlaylists(results)
  }

}



searchBtn.addEventListener('click', async function(e) {
  e.preventDefault();
  searchEl.style.minHeight = '50%'
  displayEl.innerHTML = '';
  prevBtn.setAttribute('disabled', true)
  nextBtn.removeAttribute( 'disabled')

  query = document.querySelector('#q')
  qType = document.querySelector('[name="q-type"]:checked')

  searchURL = baseURL + `q=${query.value}&type=${qType.id}&territory=TW&limit=${res_limit}`

  results = await getKKbox(searchURL);
  //console.log(results.summary.total);

  prevPageURL = results.paging.previous
  nextPageURL = results.paging.next

  if(nextPageURL === null) {
   nextBtn.setAttribute('disabled', true)
  }

  addResults(results)
   
})

prevBtn.addEventListener('click', async function(e){
  e.preventDefault();
  searchEl.style.minHeight = '50%'
  displayEl.innerHTML = '';
  nextBtn.removeAttribute( 'disabled')


  results = await getKKbox(prevPageURL)

  prevPageURL = results.paging.previous
  nextPageURL = results.paging.next

  if(prevPageURL == null) {
    prevBtn.setAttribute('disabled', true)
  }

  addResults(results)
})

nextBtn.addEventListener('click', async function(e){
  e.preventDefault();
  searchEl.style.minHeight = '50%'
  displayEl.innerHTML = '';
  prevBtn.removeAttribute( 'disabled')
  results = await getKKbox(nextPageURL)

  prevPageURL = results.paging.previous
  nextPageURL = results.paging.next

  if(nextPageURL == null) {
   nextBtn.setAttribute('disabled', true)
  }

  addResults(results)

})

