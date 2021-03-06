import * as Vue from 'vue';
import { call } from 'wasm-imagemagick';


const app = Vue.createApp({
    data() {
        return {
            items: [
                'GIF',
                'BMP'
            ],
            from: 'JPEG',
            to: 'PNG',
            pesan: 'masih dalam pengembangan',
            process: 0
        }
    },
    computed: {
        progresBar() {
            return this.process;
        },
        toFileExt() {
            return (this.to === 'JPEG') ? 'jpg' : this.to.toLowerCase();
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
        },
        convertImageFile() {
            const reader = new FileReader();
            let appin = this;

            reader.addEventListener("load", async function() {
                let link = document.createElement('a');
                link.download = Math.random().toString(16).substr(2, 10) + '.' + appin.toFileExt;
                appin.process = 20;
                const content = new Uint8Array(reader.result);
                const image = { name: 'srcFile.png', content };
                const command = ["convert", "srcFile.png", 'out.' + appin.toFileExt];
                appin.process = 40;
                const resultImage = await call([image], command);
                if(resultImage.exitCode !== 0)
                    return alert('There was an error: ' + result.stderr.join('\n'))
                appin.process = 80;
                const outputImage = resultImage.outputFiles[0];
                link.href = URL.createObjectURL(outputImage.blob); // data url
                link.click();
                URL.revokeObjectURL(link.href);
                appin.process = 100;
            });


            reader.readAsArrayBuffer(this.$refs.imageFile.file);
            
        }
    }
});

app.component('header-brand', {
    props: ['msg'],
    template:`
    <header class="header-brand">
        <div class="logo-brand">
            <img class="logo-brand__notext" src="assets/img/_logo_notext.png" alt="logo_notext" />
            <img class="logo-brand__text" src="assets/img/_logo_text.png" alt="logo_text" />
        </div>
        <p> {{ msg }} </p>
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
            return `calc(${this.comp.length}ch + 0.8rem)` ;
        }
    },
    methods: {
        toggleList() {
            this.isClicked = !this.isClicked;
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
        <div class="input-list">
            <input class="selector" :style="{ width: textLength }" :value="comp" type="text" @input="changeInput"/>
            <button class="selector-btn" @click="toggleList" ><i class="fas fa-chevron-down"></i></button>
        </div>
        <ul v-if="isClicked" class="select-list" @mouseleave="hideList">
            <li class="select-item" v-for="item in list" @click="setCompValue"> {{ item }} </li>
        </ul>
    </div>
    `
});

app.component('input-image-file', {
    props: ['type'],
    data() {
        return {
            msg: 'Select File...',
            file: null,
            filename: null
        }
    },
    computed: {
        fileType() {
            return 'image/' + this.type.toLowerCase();
        },
        smallname() {
            return (this.filename) ? '...' + this.filename.slice(-17) : this.msg;
        }
    },
    methods: {
        observerImage(event) {
            this.file = event.target.files[0];
            this.filename = this.file.name;
        }
    },
    template: `
    <label for="image">
        <div class="icon">
            <i class="fas fa-file"></i>
        </div>
        <div class="file-name">
            <span class="file-name__text"> {{ smallname }} </span>
        </div>
    </label>
    <input type="file" :accept="fileType" id="image" name="image" @change="observerImage">
    `
})


app.mount('#app');
