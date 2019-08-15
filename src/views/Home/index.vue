<template>
    <div class="home">
        <div class="search-wrap">
            <div class="checkboxes">
                <label for="album">
                    <span>album</span>
                    <input type="checkbox" id="album" v-model="types.album">
                </label>
                <label for="artist">
                    <span>artist</span>
                    <input type="checkbox" id="artist" v-model="types.artist">
                </label>
                <label for="playlist">
                    <span>playlist</span>
                    <input type="checkbox" id="playlist" v-model="types.playlist">
                </label>
                <label for="track">
                    <span>track</span>
                    <input type="checkbox" id="track" v-model="types.track">
                </label>
            </div>
            <div class="input">
                <input type="text" placeholder="search query" v-model="query">
                <button @click="find()">Find</button>
            </div>
        </div>
        <div class="results">
            <div class="item" v-for="item in results.items">
                <div class="album-icon" :style="{'background-image': `url(${item.album.images[1].url})`}"></div>
                <div class="right">
                    <div class="name">
                        {{item.name}} - {{item.artists[0].name}}
                    </div>
                    <audio :src="item.preview_url" controls></audio>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'home',
    data () {
        return {
            types: {
                album: false,
                artist: false,
                playlist: false,
                track: false
            },
            query: '',
            results: []
        }
    },
    computed: {
        searchType () {
            let arr = []
            for (let i in this.types) {
                if (this.types[i]) {
                    arr.push(i)
                }
            }
            return arr.join(',')
        },
        searchQuery () {
            return {
                q: this.query,
                type: this.searchType || 'track'
            }
        }
    },
    methods: {
        find () {
            this.$router.push({
                name: 'home',
                query: this.searchQuery
            })
            this.receive()
        },
        receive () {
            axios.get('https://api.spotify.com/v1/search', {
                params: this.searchQuery
            }).then(res => {
                this.results = res.data.tracks
            })
        },
        setData () {
            let types = this.$route.query.type.split(',')
            this.query = this.$route.query.q
            for (let i in this.types) {
                if (types.find(e => e == i)) this.types[i] = true
            }
        }
    },
    created () {
        this.setData()
        this.receive()
    }
}
</script>

<style src="./styles.sass" lang="sass"></style>
