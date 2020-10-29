const fetch = require('node-fetch')
const express = require('express')
const { response, request } = require('express')
const app = express()
app.disable('etag')

app.use((request, response, next) => {
	console.log(`IP : ${request.headers['x-forwarded-for']} | Method : ${request.method} | Url : ${request.originalUrl}`)
	next()
})

app.get('/', (request, response) => {
	response.status(200).json({
		'message': "Welcome to Twitch API"
	})
})

app.get('/hls', (request, response) => {
	response.status(404).json({
		'message': 'unknown channel name'
	})
})

app.get('/hls/:id', async (request, response) => {
	let id = request.params.id
		let token = await fetch(`https://api.twitch.tv/api/channels/${id}/access_token`, {
			method: 'GET',
			headers: {
				'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
				'Content-Type': 'application/json'
			}
		})
	
		switch(await token.status) {
			case 200: //Channel founded
				raw = await token.json()
				url = `http://usher.twitch.tv/api/channel/hls/${id}.m3u8?player=twitchweb&&token=${raw.token}&sig=${raw.sig}&allow_audio_only=true&allow_source=true&type=any&p=${parseInt(Math.random() * 999999)}`
				let hls = await fetch(url, {
					method: 'GET'
				})
				switch(await hls.status) {
					case 200: //m3u8 data exist
						hls = await hls.text()
						hls = hls.replace(/.*#.*\n?/gm, '')
						response.status(200).json(hls.split('\n'))
						return
					default: //m3u8 data doesn't exsit
						response.status(404).json({
							'message': 'm3u8 data not found'
						})
						return
				}
			case 404: //Channel not founded
				response.status(404).json({
					'message':'Channel not found'
				})
				return
			default: //Error with connect with Twitch API
				response.status(500).json({
					'message':'Error with Twitch API'
				})
				return
		}
	})

app.listen(8080, () => {
	console.log("API started")
})