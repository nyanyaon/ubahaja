var Vue = require('vue');

const app = Vue.createApp({
    data() {
        return {
            items: [
                'GIF'
            ],
            from: 'JPG',
            to: 'PNG'
        }
    },
    watch: {
        from(newVal, oldVal) {
            if(this.items.indexOf(newVal) !== -1) {
                this.deleteItem(this.items.indexOf(newVal));
                this.items.push(oldVal);
            }
        },
        to(newVal, oldVal) {
            if(this.items.indexOf(newVal) !== -1) {
                this.deleteItem(this.items.indexOf(newVal));
                this.items.push(oldVal);
            }
        }
    },
    methods: {
        deleteItem(index) {
            this.items.splice(index, 1);
        }
    }
});

app.component('header-brand', {
    template:`
    <header class="header-brand">
        <div class="logo-brand">
            <img class="logo-brand__notext" src="assets/img/_logo_notext.png" alt="logo_notext" />
            <img class="logo-brand__text" src="assets/img/_logo_text.png" alt="logo_text" />
        </div>
        <p>Masih dalam pengembangan</p>
    </header>
    `
});

app.component('selector-list', {
    props: ['list', 'comp'],
    data() {
        return {
            isClicked: false,
        };
    },
    emits: ['update:comp'],
    computed: {
        textLength() {
            return `calc(${this.comp.length}ch + 1em)` ;
        }
    },
    methods: {
        showList() {
            this.isClicked = true;
        },
        hideList() {
            this.isClicked = false;
        },    
        changeInput(event) {
           this.$emit('update:comp', event.target.value);
        },
        setCompValue(event) {
            this.$emit('update:comp', event.target.innerText);
            this.hideList();

        }
    },
    template: `
    <div class="selector-list">
        <input class="selector" :style="{ width: textLength }" :value="comp" type="text" @input="changeInput" @click="showList">
        <ul v-if="isClicked" class="select-list" @mouseleave="hideList">
            <li class="select-item" v-for="item in list" @click="setCompValue"> {{ item }} </li>
        </ul>
    </div>
    `
});


app.mount('#app');
