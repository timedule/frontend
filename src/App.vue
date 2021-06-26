<template>
    <div>
        <b-navbar type="dark" variant="dark">
            <div class="row w-100">
                <b-navbar-brand class="col my-auto mx-3" href="/">
                    <img src="@/assets/logo.png" alt="Logo" height="30px" class="d-inline-block align-top">
                    Timedule
                </b-navbar-brand>
                <div class="col-auto my-auto px-0">
                    <router-link to="/login" class="link-light">
                        <b-icon-person v-if="user === null" class="h1 my-auto"></b-icon-person>
                        <div v-else class="my-auto">
                            <b-icon-person-circle></b-icon-person-circle>
                            {{ user.uid }}
                        </div>
                    </router-link>
                </div>
            </div>
        </b-navbar>
        <router-view></router-view>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'App',

    components: {
    },

    mounted : function(){
        let routeInstance = this.$route;
        this.createTitleDesc(routeInstance);
        this.user = firebase.auth().currentUser;
    },

    data: () => ({
        user: null,
        drawer: false,
    }),

    methods: {
        createTitleDesc : function(routeInstance){
            if(routeInstance.meta.title){
                let setTitle = routeInstance.meta.title;
                document.title = setTitle;
            } else {
                document.title = 'title is not set'
            }
            if(routeInstance.meta.desc){
                let setDesc = routeInstance.meta.desc + ' | MIYACHIN VUE';
                document.querySelector("meta[name='description']").setAttribute('content', setDesc)
            } else {
                document.querySelector("meta[name='description']").setAttribute('content', 'description is not set')
            }
        },
    },

    watch: {
        '$route' (routeInstance, from) {
            from;
            this.user = firebase.auth().currentUser;
            this.createTitleDesc(routeInstance);
        },
    },
};
</script>
