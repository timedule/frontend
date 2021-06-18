<template>
    <div>
        <b-navbar type="dark" variant="dark" class="px-3">
            <b-navbar-brand>Timedule</b-navbar-brand>
        </b-navbar>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',

    components: {
    },

    mounted : function(){
        let routeInstance = this.$route;
        this.createTitleDesc(routeInstance);
    },

    data: () => ({
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
            this.createTitleDesc(routeInstance);
        }
    },
};
</script>
