// Debate: Wookie vs Wookiee?
// http://www.latimes.com/entertainment/herocomplex/la-et-hc-the-times-star-wars-style-guide-20151130-story.html
//
// I was too lazy to change the variable names, but it's actually wookiee, as shown by the Star Wars API
/* globals Vue */

var app = new Vue({
    el: '#app',
    data: {
        likedOnly: false,
        characters: [],
        liked: [],
        next: ''
    },

    created: function () {
        this.fetchData();
    },

    watch: {
        characters: 'checkForMore'
    },

    methods: {
        fetchData: function (url) {
            console.log('hi');
            url = url || 'http://swapi.co/api/people';
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.open('GET', url);
            xhr.onload = function () {
                var response = JSON.parse(xhr.responseText);
                self.next = response.next;
                self.characters.push.apply(self.characters, response.results);
            };
            xhr.send();
        },
        addToLiked: function () {
            this.liked.push(this.characters.shift());
        },
        discard: function () {
            this.characters.shift();
        },
        checkForMore: function () {
            if (this.characters.length <= 2 && this.next !== null) {
                this.fetchData(this.next);
            }
        }
    }
});

Vue.component('sw-character', {
    props: ['character', 'visible', 'options'],
    template: `<transition name="fade"><li class="card" v-if="visible" :class="likedClass">
                <div class="name">
                    {{ character.name }}
                </div>
                <div class="stats">
                    <ul>
                        <li>Gender: {{ character.gender }}</li>
                        <li>Skin Color: {{ character.skin_color }}</li>
                        <li>Eye Color: {{ character.eye_color }}</li>
                    </ul>
                </div>
                <div v-if="options" class="buttons">
                    <button v-on:click="yesClick" class="yes">&#128175;</button> 
                    <button @click="noClick" class="no">&#10060;</button> 
                </div>
            </li></transition>`,
    methods: {
        yesClick: function () {
            console.log(this.likedClass);
            this.$emit('yes');
        },

        noClick: function () {
            this.$emit('no');
        }
    },
    data: function () {
        return {
            likedClass: ''    
        };
    }
});
