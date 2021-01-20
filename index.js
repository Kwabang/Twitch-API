const fetch = require('node-fetch')
const express = require('express')
const {
	response,
	request
} = require('express')
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
	let token = await fetch(`https://gql.twitch.tv/gql`, {
		"method": 'POST',
		"headers": {
			'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
			'Content-Type': 'application/json',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'
		},
		"body": JSON.stringify({
			"operationName": "PlaybackAccessToken",
			"extensions": {
				"persistedQuery": {
					"version": 1,
					"sha256Hash": "0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712"
				}
			},
			"variables": {
				"isLive": true,
				"login": id,
				"isVod": false,
				"vodID": "",
				"playerType": "embed"
			}
		})
	})

	switch (await token.status) {
		default: //Error with connect with Twitch API
			response.status(500).json({
				'message': 'Error with Twitch API'
			})
			break
		case 200: //Channel founded
			raw = await token.json()
			if (raw.data.streamPlaybackAccessToken === null) { //Channel not found
				reject({
					'code': 404
				})
			} else {
				let url = `http://usher.twitch.tv/api/channel/hls/${id}.m3u8?player=twitchweb&&token=${raw.data.streamPlaybackAccessToken.value}&sig=${raw.data.streamPlaybackAccessToken.signature}&allow_audio_only=true&allow_source=true&type=any&p=${parseInt(Math.random() * 999999)}`
				let hls = await fetch(url, {
					method: 'GET'
				})
				switch (await hls.status) {
					default: //m3u8 data doesn't exsit
						response.status(404).json({
							'message': 'm3u8 data not found'
						})
						break
					case 200: //m3u8 data exist
						hls = await hls.text()
						hls = hls.replace(/.*#.*\n?/gm, '')
						response.status(200).json(hls.split('\n'))
						break
				}
			}
	}
})

app.listen(8080, () => {
	console.log("API started")
})