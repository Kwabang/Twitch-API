const fetch = require('node-fetch')
const express = require('express')

const app = express()

app.use((request, response, next) => {
	console.log(`IP : ${request.ip} | Method : ${request.method} | Url : ${request.originalUrl}`)
	next()
})

app.get('/', (response) => {
	response.json({
		'message': "Welcome to Twitch API"
	})
})

app.get('/hls', (response) => {
	response.json({
		'message': 'unknown channel name'
	})
})

app.get('/hls/:id', async (request, response) => {
	let id = request.params.id
	try {
		let token = await fetch(`https://api.twitch.tv/api/channels/${id}/access_token`, {
			method: 'GET',
			headers: {
				'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
				'Content-Type': 'application/json'
			}
		})
		if (await token.status == 404) {
			response.json({
				'message': 'unknown channel name'
			})
			return
		}
		raw = await token.json()
		url = `http://usher.twitch.tv/api/channel/hls/${id}.m3u8?player=twitchweb&&token=${raw.token}&sig=${raw.sig}&allow_audio_only=true&allow_source=true&type=any&p=${parseInt(Math.random() * 999999)}`
		let hls = await fetch(url, {
			method: 'GET'
		})
		hls = await hls.text()
		hls = hls.replace(/.*#.*\n?/gm,'')
		response.json(hls.split('\n'))
	} catch (e) {
		console.log(e)
		response.json({
			'message': 'Error with Twitch API'
		})
	}
})

app.listen(8080, () => {
	console.log("API started")
})